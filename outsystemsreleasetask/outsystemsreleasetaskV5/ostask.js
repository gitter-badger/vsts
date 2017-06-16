"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("vsts-task-lib/task");
const path = require("path");
// node js modules
const ltclt = require("./oslifetime.sdk");
class TaskOptions {
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
        var resultsDirectory = tl.getVariable('Build.StagingDirectory');
        if (!resultsDirectory) {
            // 'System.DefaultWorkingDirectory' is available during build and release
            resultsDirectory = tl.getVariable('System.DefaultWorkingDirectory');
        }
        this.saveResultsTo = path.join(resultsDirectory, 'outsystemsResults');
        this.strictSSL = ("true" !== tl.getEndpointDataParameter(this.osServerEndpoint, "acceptUntrustedCerts", true));
        tl.debug('strictSSL=' + this.strictSSL);
    }
}
exports.TaskOptions = TaskOptions;
function doWork() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            tl.setResourcePath(path.join(__dirname, 'task.json'));
            var taskOptions = new TaskOptions();
            //var osDeployPlan: OutsystemsDeploymentPlan = new OutsystemsDeploymentPlan(taskOptions);
            let lifetime = new ltclt.V1Api("https://os10lt.northeurope.cloudapp.azure.com/lifetimeapi/rest/v1");
            let depCommand = "start"; // "Continue", "abort"
            if (taskOptions.osDeployPlanOption) {
                let deployParameters = new ltclt.NotesSourceEnvironmentKeyTargetEnvironmentKeyApplicationVersionKeysRecord();
                deployParameters.applicationVersionKeys = [taskOptions.osApplicationVersion];
                deployParameters.notes = taskOptions.osNotes;
                deployParameters.sourceEnvironmentKey = taskOptions.osSource;
                deployParameters.targetEnvironmentKey = taskOptions.osTarget;
                //New Deployment Plan
                lifetime.deploymentsCreate(deployParameters)
                    .then((res) => {
                    let deployKey = res.body;
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
                    let deployCommandMessage = res.body.Errors[0];
                    let deployStatusCode = res.body.StatusCode;
                    tl.debug(`Outsystems Deployment Execute Command successfully. Status Code was [${deployStatusCode}]. Command messages were ${deployCommandMessage}`);
                })
                    .finally(() => {
                    tl.debug('Task completed');
                });
            }
        }
        catch (e) {
            tl.debug(e.message);
            tl._writeError(e);
            tl.setResult(tl.TaskResult.Failed, e.message);
        }
    });
}
doWork();
