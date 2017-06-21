import tl = require('vsts-task-lib/task');
import fs = require('fs');
import path = require('path');
import shell = require('shelljs');
import Q = require('q');
import url = require('url');

// node js modules
import ltclt = require('./oslifetime.sdk');
// import osDeployPlan = require('./OutsystemsDeploymentPlan');
// import OutsystemsDeploymentPlan = osDeployPlan.OutsystemsDeploymentPlan;

import util = require('./util');

export class TaskOptions {
    osServerEndpoint: string;  //outsystemsServiceEndpoint
    osServerEndpointUrl: string;
    osServerEndpointAuth: tl.EndpointAuthorization;

    osDeployPlanOption: boolean;   //outsystemsDeployPlanOption
    osExistingDeployPlan: string;   //outsystemsExistingDeployPlan
    osApplication: string;  // outsystemsApplication
    osNotes: string;   //outsystemsDeployNotes
    osSource: string;   //outsystemsSourceEnvironment
    osTarget: string;   //outsystemsTargetEnvironment

    osChangeLog: string; //outsystemsDeployPlanChangeLog
    osAppVersion: string; //outsystemsAppVersionName

    saveResultsTo: string;
    strictSSL: boolean;

    constructor() {

        this.osServerEndpoint = tl.getInput('outsystemsServiceEndpoint', true);
        this.osServerEndpointUrl = url.resolve(tl.getEndpointUrl(this.osServerEndpoint, false), "lifetimeapi/rest/v1");
        this.osServerEndpointAuth = tl.getEndpointAuthorization(this.osServerEndpoint, false);

        tl.debug('serverEndpointUrl=' + this.osServerEndpointUrl);
        tl.debug('osServerEndpointAuth.Parameters=' + tl.getEndpointAuthorizationParameter("outsystems","apitoken",true));
        tl.debug('osServerEndpointAuth.Scheme=' + tl.getEndpointAuthorizationScheme("outsystems",true));
        //tl.debug('osServerEndpointAuth=' + JSON.stringify(this.osServerEndpointAuth));
        

        this.osApplication = tl.getInput('outsystemsApplication', true);
        this.osAppVersion = tl.getInput('outsystemsAppVersionName', true);
        this.osChangeLog = tl.getInput('outsystemsDeployPlanChangeLog', true);
        this.osNotes = tl.getInput('outsystemsDeployNotes', false);
        this.osSource = tl.getInput('outsystemsSourceEnvironment', true);
        this.osTarget = tl.getInput('outsystemsTargetEnvironment', true);

        // tl.debug('outsystemsApplication=' + this.osApplication);
        // tl.debug('outsystemsAppVersionName=' + this.osAppVersion);
        // tl.debug('outsystemsDeployPlanChangeLog=' + this.osChangeLog);
        // tl.debug('outsystemsDeployNotes=' + this.osNotes || "Not defined");
        // tl.debug('outsystemsSourceEnvironment=' + this.osSource);
        // tl.debug('outsystemsTargetEnvironment=' + this.osTarget);

        var resultsDirectory: string = tl.getVariable('Build.StagingDirectory');
        if (!resultsDirectory) {
            // 'System.DefaultWorkingDirectory' is available during build and release
            resultsDirectory = tl.getVariable('System.DefaultWorkingDirectory');
        }

        //TEMP
        //this.saveResultsTo = path.join(__dirname, 'outsystemsResults')
        this.saveResultsTo = path.join(resultsDirectory, 'outsystemsResults');

        this.strictSSL = ("true" !== tl.getEndpointDataParameter(this.osServerEndpoint, "acceptUntrustedCerts", true));
        tl.debug('strictSSL=' + this.strictSSL);
    }
}

async function doWork() {
    try {
        tl.setResourcePath(path.join(__dirname, 'task.json'));

        var taskOptions: TaskOptions = new TaskOptions();

        let lifetime = new ltclt.V1Api(taskOptions.osServerEndpointUrl);

        let tempDeployKey;
        let AppVersionStagingPublishingInterval = 5000;
        let deployPlan: ltclt.NotesSourceEnvironmentKeyTargetEnvironmentKeyApplicationVersionKeysRecord = new ltclt.NotesSourceEnvironmentKeyTargetEnvironmentKeyApplicationVersionKeysRecord();

        lifetime.applicationsGet(taskOptions.osApplication, true, true)
            //MULTI APPS: lifetime.applicationsList(false,true)
            .then((res) => {
                let newApp: ltclt.Application = res.body;

                let lastModified: ltclt.AppStatusInEnv = newApp.AppStatusInEnvs.find(item => { return item.IsModified === true; });
                if (lastModified) {
                    let newModuleVersionKey = lastModified.ModuleStatusInEnvs[0].ModuleVersionKey
                    tl.debug(`newModuleVersionKey = ${newModuleVersionKey}`);

                    let newAppVersion: ltclt.ApplicationVersionCreate = new ltclt.ApplicationVersionCreate();
                    newAppVersion.changeLog = taskOptions.osChangeLog;
                    newAppVersion.mobileVersions = new Array<ltclt.MobileVersion>();
                    newAppVersion.moduleVersionKeys = [newModuleVersionKey];
                    newAppVersion.version = taskOptions.osAppVersion;
                    tl.debug(`New App Version :` + JSON.stringify(newAppVersion));

                    //Base Environment where to TAG versiion 
                    return lifetime.environmentsApplicationsVersionsCreate(taskOptions.osSource, taskOptions.osApplication, newAppVersion);
                }
                else {
                    let message = tl.loc('OSFailureAppNotModified', newApp.Name);
                    tl.setResult(tl.TaskResult.Failed, message);
                    throw new Error(message);
                }
            })
            //New Deployment Plan
            .delay(AppVersionStagingPublishingInterval).then((res) => {
                // Application Version taskes time to be published in staging.
                // Else DeploymentCreate throws "Failed to include application version in staging because it was never published in source environment '%s'".                

                let newAppVersionKey: string = res.body.ApplicationVersionKey;
                tl.debug(`newAppVersionKey = ${newAppVersionKey}`);

                deployPlan.applicationVersionKeys = [newAppVersionKey];
                if (taskOptions.osNotes == null) {
                    let deployPlanTimestamp = new Date();
                    taskOptions.osNotes || deployPlanTimestamp.getDate() + "-" + (deployPlanTimestamp.getMonth() + 1) + "-" + deployPlanTimestamp.getFullYear() + "-" + deployPlanTimestamp.getHours() + "-" + deployPlanTimestamp.getMinutes(); + `:${taskOptions.osSource}-${taskOptions.osTarget}'.`;
                }
                tl.debug(`Deployment Plan Note set to '${taskOptions.osNotes}'.`);
                deployPlan.notes = taskOptions.osNotes;
                deployPlan.sourceEnvironmentKey = taskOptions.osSource;
                deployPlan.targetEnvironmentKey = taskOptions.osTarget;
                tl.debug(`Deployment Plan :` + JSON.stringify(deployPlan));

                return lifetime.deploymentsCreate(deployPlan);
            })
            .then((res) => {
                tempDeployKey = res.body;
                tl.debug(`tempDeployKey = ${tempDeployKey}`);

                return lifetime.deploymentsExecuteCommand(tempDeployKey, util.osDeployPlanCommands.Start)
            })
            .then((res) => {
                let deployCommandMessage: string = res.body.Errors[0];
                let deployStatusCode = res.body.StatusCode;
                tl.debug(`deployCommandMessage = ${deployCommandMessage}`);

                return MonitorProgress(taskOptions, lifetime, tempDeployKey);
            })
            .catch((err) => {
                let taskMessage: string;

                if (err.body) {
                    taskMessage = ` [${err.body.StatusCode}] ${err.body.Errors}`;
                    taskMessage = JSON.stringify(err); + taskMessage;
                }
                if(err.message){
                    taskMessage = ` ${err.message}`;
                }
                else taskMessage = taskMessage = JSON.stringify(err);

                //let message = tl.loc('OSAppVersionAlreadyExists',somthing);
                tl.error(taskMessage);
                tl.setResult(tl.TaskResult.Failed, taskMessage);

            })
            .finally(() => {
                //let message = tl.loc('OSAppVersionAlreadyExists',somthing);
                //console.error(taskMessage);
                //tl.setResult(tl.TaskResult.Failed, tl.loc('CMakeFailed', err.message));
                //console.log('Done! ');
            });


    } catch (e) {
        tl.debug(e.message);
        tl._writeError(e);
        tl.setResult(tl.TaskResult.Failed, e.message);
    }
}

async function MonitorProgress(taskOptopns: TaskOptions, lifetime: ltclt.V1Api, deployKey: string) {

    let intervalMillis = 1000;
    let completeFullLog: Array<string>;
    let intervalId;
    let deploylog: Array<string> = [];

    try {

        intervalId = setInterval(() => {

            lifetime.deploymentsGetStatus(deployKey)
                .then((res) => {
                    let deployStatus: string = res.body.DeploymentStatus;
                    let curDeploylog = res.body.DeploymentLog;

                    let deltaLog = curDeploylog.slice(deploylog.length, curDeploylog.length);
                    deploylog = curDeploylog;

                    if (deltaLog.length > 0) {
                        let deltaLogString: string = deltaLog.map((_log) => {
                            return _log.Message;
                        }).join("\r\n");
                        tl.debug(`${deltaLogString}`);
                    }

                    if (deployStatus == util.osDeploymentStatus.Running ||
                        deployStatus == util.osDeploymentStatus.Aborting) {
                        deploylog = curDeploylog;
                    }
                    else if (deployStatus == util.osDeploymentStatus.FinishedSuccessfully ||
                        deployStatus == util.osDeploymentStatus.FinishedWithWarnings ||
                        deployStatus == util.osDeploymentStatus.NeedsUserIntervention) {
                        //SUCCESS
                        clearInterval(intervalId);

                        let message = tl.loc('OSSuccessfulDeployment', deployStatus);
                        tl.debug(message);
                        tl.setResult(tl.TaskResult.Succeeded, message);

                    } else if (deployStatus == util.osDeploymentStatus.FinishedWithErrors ||
                        deployStatus == util.osDeploymentStatus.Aborted) {
                        //ERROR
                        clearInterval(intervalId);

                        let message = tl.loc('OSFailedDeployment', deployStatus);
                        tl.debug(message);
                        tl.setResult(tl.TaskResult.Succeeded, message);

                    } else {
                        //We should never get to this situation.
                        //Status set to deployStatus == util.osDeploymentStatus.Saved
                        // or a Lifetime API change
                        //Abort deployment task and report issue
                        clearInterval(intervalId);
                        let message = tl.loc('OSUnabletoMonitorProgress', deployStatus);
                        tl.debug(message);
                    }
                })

        }, intervalMillis);

    } catch (e) {
        tl.debug(e.message);
        tl._writeError(e);
        tl.setResult(tl.TaskResult.Failed, e.message);
    }

}

doWork();
