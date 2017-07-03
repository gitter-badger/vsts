import tl = require('vsts-task-lib/task');
import fs = require('fs');
import path = require('path');
import shell = require('shelljs');
import Q = require('q');
import url = require('url');

// node js modules
import ltclt = require('./oslifetime.sdk');

import util = require('./util');

export class TaskOptions {
    public osServerEndpoint: string;  //outsystemsServiceEndpoint
    public osServerEndpointUrl: string;
    public osServerEndpointAuth: tl.EndpointAuthorization;

    public osApplication: string;  // outsystemsApplication
    public osTagAndDeploy: boolean; // outsystemsTagAndDeploy
    public osAppVersion: string; //outsystemsAppVersionName
    public osExistingAppVersion: string; //outsystemsExistingAppVersion
    public osChangeLog: string; //outsystemsDeployPlanChangeLog
    public osNotes: string;   //outsystemsDeployNotes
    public osSource: string;   //outsystemsSourceEnvironment
    public osTarget: string;   //outsystemsTargetEnvironment

    public saveResultsTo: string;
    public strictSSL: boolean;

    constructor() {

        this.osServerEndpoint = tl.getInput('outsystemsServiceEndpoint', true);
        this.osServerEndpointUrl = url.resolve(tl.getEndpointUrl(this.osServerEndpoint, false), 'lifetimeapi/rest/v1');
        this.osServerEndpointAuth = tl.getEndpointAuthorization(this.osServerEndpoint, false);

        this.osApplication = tl.getInput('outsystemsApplication', true);
        this.osTagAndDeploy = util.ConvertToBoolean(tl.getInput('outsystemsTagAndDeploy', true));
        this.osAppVersion = tl.getInput('outsystemsAppVersionName', true);
        this.osExistingAppVersion = tl.getInput('outsystemsExistingAppVersion', false);
        this.osChangeLog = tl.getInput('outsystemsDeployPlanChangeLog', true);
        this.osNotes = tl.getInput('outsystemsDeployNotes', false);
        this.osSource = tl.getInput('outsystemsSourceEnvironment', true);
        this.osTarget = tl.getInput('outsystemsTargetEnvironment', true);

        let resultsDirectory: string = tl.getVariable('Build.StagingDirectory');
        if (!resultsDirectory) {
            // 'System.DefaultWorkingDirectory' is available during build and release
            resultsDirectory = tl.getVariable('System.DefaultWorkingDirectory');
        }

        this.saveResultsTo = path.join(resultsDirectory, 'outsystemsResults');

        this.strictSSL = ('true' !== tl.getEndpointDataParameter(this.osServerEndpoint, 'acceptUntrustedCerts', true));
        tl.debug('strictSSL=' + this.strictSSL);
    }
}

async function doWork() {

    try {
        tl.setResourcePath(path.join(__dirname, 'task.json'));

        const taskOptions: TaskOptions = new TaskOptions();
        //let lifetimeTokenApi = new ltclt.OAuth();
        const lifetime = new ltclt.V1Api(taskOptions.osServerEndpointUrl);
        const ltTokenApi = tl.getEndpointAuthorizationParameter(taskOptions.osServerEndpoint, 'apitoken', false);
        lifetime.setApiKey(ltclt.V1ApiApiKeys.os_auth, ltTokenApi);
        const APPVERSIONSTAGINGPUBLISHINGINTERVAL = 5000;
        const MAXAPPVERSIONTORETURN = 120;

        util.log(`Starting release of Apps ${taskOptions.osApplication}`);
        lifetime.applicationsGet(taskOptions.osApplication, true, true)

            //MULTI APPS: lifetime.applicationsList(false,true)
            .then((!taskOptions.osTagAndDeploy) ? (res) => {

                if (taskOptions.osAppVersion) {
                    //Not for Tag & Deploy and with osAppVersion
                    return lifetime.applicationsVersionsList(taskOptions.osApplication, MAXAPPVERSIONTORETURN);
                } else {
                    return CreateAndExecuteDeployPan(taskOptions, lifetime, [taskOptions.osExistingAppVersion]);
                }
            } : Promise.resolve())
            .then(!taskOptions.osTagAndDeploy ? (res) => {
                const appVersionList: Array<ltclt.ApplicationVersion> = res.body;
                const existingAppVersion = appVersionList.find(item => { return item.Version === taskOptions.osAppVersion; });
                taskOptions.osExistingAppVersion = existingAppVersion.Key;

                return CreateAndExecuteDeployPan(taskOptions, lifetime, [taskOptions.osExistingAppVersion]);

            } : Promise.resolve())
            .then(taskOptions.osTagAndDeploy ? (res) => {
                const newApp: ltclt.Application = res.body;

                const lastModified: ltclt.AppStatusInEnv = newApp.AppStatusInEnvs.find(item => { return item.IsModified === true; });
                if (lastModified) {
                    const newModuleVersionKey = lastModified.ModuleStatusInEnvs[0].ModuleVersionKey;
                    tl.debug(`newModuleVersionKey = ${newModuleVersionKey}`);

                    const newAppVersion: ltclt.ApplicationVersionCreate = new ltclt.ApplicationVersionCreate();
                    newAppVersion.changeLog = taskOptions.osChangeLog;
                    newAppVersion.mobileVersions = new Array<ltclt.MobileVersion>();
                    newAppVersion.moduleVersionKeys = [newModuleVersionKey];
                    newAppVersion.version = taskOptions.osAppVersion;
                    tl.debug(`New App Version :` + JSON.stringify(newAppVersion));

                    //Base Environment where to TAG version
                    return lifetime.environmentsApplicationsVersionsCreate(taskOptions.osSource, taskOptions.osApplication, newAppVersion);
                } else {
                    const message = tl.loc('OSFailureAppNotModified', newApp.Name);
                    tl.setResult(tl.TaskResult.Failed, message);
                    throw new Error(message);
                }
            } : Promise.resolve())
            .delay(APPVERSIONSTAGINGPUBLISHINGINTERVAL).then(taskOptions.osTagAndDeploy ? (res) => {
                // Application Version taskes time to be published in staging.
                // Else DeploymentCreate throws 'Failed to include application version
                // in staging because it was never published in source environment '%s''.

                const newAppVersionKey: string = res.body.ApplicationVersionKey;
                tl.debug(`newAppVersionKey = ${newAppVersionKey}`);

                //return lifetime.deploymentsCreate(deployPlan);
                return CreateAndExecuteDeployPan(taskOptions, lifetime, [newAppVersionKey]);
            } : Promise.resolve())

            .catch((err) => {
                let taskMessage: string;

                if (err.body) {
                    taskMessage = ` [${err.body.StatusCode}] ${err.body.Errors}`;
                    taskMessage = JSON.stringify(err) + taskMessage;
                }
                if (err.message) {
                    taskMessage = ` ${err.message}`;
                } else { taskMessage = taskMessage = JSON.stringify(err); }

                //let message = tl.loc('OSAppVersionAlreadyExists',somthing);
                tl.error(taskMessage);
                tl.setResult(tl.TaskResult.Failed, taskMessage);
            });

    } catch (e) {
        tl.debug(e.message);
        tl._writeError(e);
        tl.setResult(tl.TaskResult.Failed, e.message);
    }
}

async function CreateNewApplicationVersion(taskOptions: TaskOptions, lifetime: ltclt.V1Api, appVersionStagingPublishingInterval: number) {

    lifetime.applicationsGet(taskOptions.osApplication, true, true)
        .then((res) => {
            const newApp: ltclt.Application = res.body;

            const lastModified: ltclt.AppStatusInEnv = newApp.AppStatusInEnvs.find(item => { return item.IsModified === true; });
            if (lastModified) {
                const newModuleVersionKey = lastModified.ModuleStatusInEnvs[0].ModuleVersionKey;
                tl.debug(`newModuleVersionKey = ${newModuleVersionKey}`);

                const newAppVersion: ltclt.ApplicationVersionCreate = new ltclt.ApplicationVersionCreate();
                newAppVersion.changeLog = taskOptions.osChangeLog;
                newAppVersion.mobileVersions = new Array<ltclt.MobileVersion>();
                newAppVersion.moduleVersionKeys = [newModuleVersionKey];
                newAppVersion.version = taskOptions.osAppVersion;
                tl.debug(`New App Version :` + JSON.stringify(newAppVersion));

                //Base Environment where to TAG version
                return lifetime.environmentsApplicationsVersionsCreate(taskOptions.osSource, taskOptions.osApplication, newAppVersion);
            } else {
                const message = tl.loc('OSFailureAppNotModified', newApp.Name);
                tl.setResult(tl.TaskResult.Failed, message);
                throw new Error(message);
            }
        })
        .delay(appVersionStagingPublishingInterval).then((res) => {
            // Application Version taskes time to be published in staging.
            // Else DeploymentCreate throws 'Failed to include application version
            // in staging because it was never published in source environment %s'.

            const newAppVersionKey: string = res.body.ApplicationVersionKey;
            tl.debug(`newAppVersionKey = ${newAppVersionKey}`);

            //return lifetime.deploymentsCreate(deployPlan);
            return CreateAndExecuteDeployPan(taskOptions, lifetime, [newAppVersionKey]);
        });
}

async function CreateAndExecuteDeployPan(taskOptions: TaskOptions, lifetime: ltclt.V1Api, appVersionKeys: Array<string>) {

    const deployPlan: ltclt.NotesSourceEnvironmentKeyTargetEnvironmentKeyApplicationVersionKeysRecord = new ltclt.NotesSourceEnvironmentKeyTargetEnvironmentKeyApplicationVersionKeysRecord();
    let newDeployPlanKey;

    deployPlan.applicationVersionKeys = appVersionKeys;
    tl.debug(`ApplicationVersionKeys= ${deployPlan.applicationVersionKeys}`);

    if (taskOptions.osNotes == null) {
        const deployPlanTimestamp = new Date();
        taskOptions.osNotes = taskOptions.osNotes || deployPlanTimestamp.getDate() + '-' + (deployPlanTimestamp.getMonth() + 1) + '-' + deployPlanTimestamp.getFullYear() + '-' + deployPlanTimestamp.getHours() + '-' + deployPlanTimestamp.getMinutes();
    }
    deployPlan.notes = taskOptions.osNotes;
    tl.debug(`Deployment Plan Note set to '${taskOptions.osNotes}'.`);

    deployPlan.sourceEnvironmentKey = taskOptions.osSource;
    deployPlan.targetEnvironmentKey = taskOptions.osTarget;
    tl.debug(`Deployment Plan :` + JSON.stringify(deployPlan));

    lifetime.deploymentsCreate(deployPlan)
        //New Deployment Plan
        .then((res) => {
            newDeployPlanKey = res.body;
            tl.debug(`tempDeployKey = ${newDeployPlanKey}`);

            return lifetime.deploymentsExecuteCommand(newDeployPlanKey, util.osDeployPlanCommands.Start);
        })
        .then((res) => {
            const deployCommandMessage: string = res.body.Errors[0];
            const deployStatusCode = res.body.StatusCode;
            tl.debug(`deployCommandMessage = ${deployCommandMessage}`);

            return MonitorProgress(lifetime, newDeployPlanKey);
        });
}

async function MonitorProgress(lifetime: ltclt.V1Api, deployKey: string) {

    const intervalMillis = 1000;
    //let completeFullLog: Array<string>;
    let intervalId;
    let deploylog: Array<string> = [];

    try {

        intervalId = setInterval(() => {

            lifetime.deploymentsGetStatus(deployKey)
                .then((res) => {
                    const deployStatus: string = res.body.DeploymentStatus;
                    const curDeploylog = res.body.DeploymentLog;

                    const deltaLog = curDeploylog.slice(deploylog.length, curDeploylog.length);
                    deploylog = curDeploylog;

                    deltaLog.forEach((entry) => {
                        tl.debug(entry.Message);
                    });

                    if (deployStatus === util.osDeploymentStatus.Running ||
                        deployStatus === util.osDeploymentStatus.Aborting) {
                        deploylog = curDeploylog;
                    } else if (deployStatus === util.osDeploymentStatus.FinishedSuccessfully ||
                        deployStatus === util.osDeploymentStatus.FinishedWithWarnings ||
                        deployStatus === util.osDeploymentStatus.NeedsUserIntervention) {
                        //SUCCESS
                        clearInterval(intervalId);

                        const message = tl.loc('OSSuccessfulDeployment', deployStatus);
                        tl.debug(message);
                        tl.setResult(tl.TaskResult.Succeeded, message);

                    } else if (deployStatus === util.osDeploymentStatus.FinishedWithErrors ||
                        deployStatus === util.osDeploymentStatus.Aborted) {
                        //ERROR
                        clearInterval(intervalId);

                        const message = tl.loc('OSFailedDeployment', deployStatus);
                        tl.debug(message);
                        tl.setResult(tl.TaskResult.Succeeded, message);

                    } else {
                        //We should never get to this situation.
                        //Status set to deployStatus == util.osDeploymentStatus.Saved
                        // or a Lifetime API change
                        //Abort deployment task and report issue
                        clearInterval(intervalId);
                        const message = tl.loc('OSUnabletoMonitorProgress', deployStatus);
                        tl.debug(message);
                    }
                });

        }, intervalMillis);

    } catch (e) {
        tl.debug(e.message);
        tl._writeError(e);
        tl.setResult(tl.TaskResult.Failed, e.message);
    }

}

doWork();
