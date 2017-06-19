import tl = require('vsts-task-lib/task');
import fs = require('fs');
import path = require('path');
import shell = require('shelljs');
import Q = require('q');

// node js modules
import ltclt = require('./oslifetime.sdk');
// import osDeployPlan = require('./OutsystemsDeploymentPlan');
// import OutsystemsDeploymentPlan = osDeployPlan.OutsystemsDeploymentPlan;

import util = require('./util');

export class TaskOptions {
    osServerEndpoint: string;  //outsystemsServiceEndpoint
    osServerEndpointUrl: string;

    osServerEndpointAuth: tl.EndpointAuthorization;

    osApplication: string;  // outsystemsApplication
    osApplicationVersion: string;  // outsystemsApplicationVersion
    osSource: string;   //outsystemsSourceEnvironment
    osTarget: string;   //outsystemsTargetEnvironment
    osNotes: string;   //outsystemsDeployNotes

    osDeployPlanOption: string;   //outsystemsDeployPlanOption
    osNewDeployPlan: string;   //outsystemsNewDeployPlan
    osExistingDeployPlan: string;   //outsystemsExistingDeployPlan

    saveResultsTo: string;
    strictSSL: boolean;

    constructor() {

        this.osServerEndpoint = tl.getInput('outsystemsServiceEndpoint', true);
        this.osServerEndpointUrl = tl.getEndpointUrl(this.osServerEndpoint, false);

        this.osServerEndpointAuth = tl.getEndpointAuthorization(this.osServerEndpoint, false);

        tl.debug('serverEndpointUrl=' + this.osServerEndpointUrl);
        tl.debug('osServerEndpointAuth=' + this.osServerEndpointAuth);

        this.osApplication = tl.getInput('outsystemsApplication', true);
        this.osApplicationVersion = tl.getInput('outsystemsApplicationVersion', true);
        this.osSource = tl.getInput('outsystemsSourceEnvironment', true);
        this.osTarget = tl.getInput('outsystemsTargetEnvironment', true);
        this.osNotes = tl.getInput('outsystemsDeployNotes', true);

        tl.debug('outsystemsApplication=' + this.osApplication);
        tl.debug('outsystemsApplicationVersions=' + this.osApplicationVersion);
        tl.debug('outsystemsSourceEnvironment=' + this.osSource);
        tl.debug('outsystemsTargetEnvironment=' + this.osTarget);
        tl.debug('outsystemsDeployNotes=' + this.osNotes);

        this.osDeployPlanOption = tl.getInput('outsystemsDeployPlanOption', true);
        this.osNewDeployPlan = tl.getInput('outsystemsNewDeployPlan', true);
        this.osExistingDeployPlan = tl.getInput('outsystemsExistingDeployPlan', true);

        tl.debug('outsystemsDeployPlanOption=' + this.osDeployPlanOption);
        tl.debug('outsystemsNewDeployPlan=' + this.osNewDeployPlan);
        tl.debug('outsystemsExistingDeployPlan=' + this.osExistingDeployPlan);

        var resultsDirectory: string = tl.getVariable('Build.StagingDirectory');
        if (!resultsDirectory) {
            // 'System.DefaultWorkingDirectory' is available during build and release
            resultsDirectory = tl.getVariable('System.DefaultWorkingDirectory');
        }
        this.saveResultsTo = path.join(resultsDirectory, 'outsystemsResults');

        this.strictSSL = ("true" !== tl.getEndpointDataParameter(this.osServerEndpoint, "acceptUntrustedCerts", true));
        tl.debug('strictSSL=' + this.strictSSL);
    }
}

async function doWork() {
    try {
        tl.setResourcePath(path.join(__dirname, 'task.json'));

        var taskOptions: TaskOptions = new TaskOptions();

        //var osDeployPlan: OutsystemsDeploymentPlan = new OutsystemsDeploymentPlan(taskOptions);
        let lifetime = new ltclt.V1Api("https://os10lt.northeurope.cloudapp.azure.com/lifetimeapi/rest/v1");

        let depCommand: string = "start" // "Continue", "abort"

        if (taskOptions.osDeployPlanOption) {
            let deployParameters: ltclt.NotesSourceEnvironmentKeyTargetEnvironmentKeyApplicationVersionKeysRecord = new ltclt.NotesSourceEnvironmentKeyTargetEnvironmentKeyApplicationVersionKeysRecord();
            deployParameters.applicationVersionKeys = [taskOptions.osApplicationVersion];
            deployParameters.notes = taskOptions.osNotes;
            deployParameters.sourceEnvironmentKey = taskOptions.osSource;
            deployParameters.targetEnvironmentKey = taskOptions.osTarget;

            //New Deployment Plan
            lifetime.deploymentsCreate(deployParameters)
                .then((res) => {

                    let deployKey: string = res.body;
                    tl.debug(`Outsystems Deployment Plan created: ${deployKey}`);
                    return lifetime.deploymentsExecuteCommand(deployKey, depCommand);
                })
                .finally(() => {
                    tl.debug('Task completed');
                });
        }
        else {
            //Existing Deployment Plan
            lifetime.deploymentsExecuteCommand(taskOptions.osExistingDeployPlan, depCommand)
                .then((res) => {
                    let deployCommandMessage: string = res.body.Errors[0];
                    let deployStatusCode = res.body.StatusCode;

                    tl.debug(`Outsystems Deployment Execute Command successfully. Status Code was [${deployStatusCode}]. Command messages were ${deployCommandMessage}`);
                })
                .finally(() => {
                    tl.debug('Task completed');
                });
        }

    } catch (e) {
        tl.debug(e.message);
        tl._writeError(e);
        tl.setResult(tl.TaskResult.Failed, e.message);
    }
}

doWork();
