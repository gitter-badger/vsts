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
const osDeployPlan = require("./OutsystemsDeploymentPlan");
var OutsystemsDeploymentPlan = osDeployPlan.OutsystemsDeploymentPlan;
class TaskOptions {
    constructor() {
        this.osServerEndpoint = tl.getInput('outsystemsServiceEndpoint', true);
        this.osServerEndpointUrl = tl.getEndpointUrl(this.osServerEndpoint, false);
        this.osServerEndpointAuth = tl.getEndpointAuthorization(this.osServerEndpoint, false);
        tl.debug('serverEndpointUrl=' + this.osServerEndpointUrl);
        tl.debug('osServerEndpointAuth=' + this.osServerEndpointAuth);
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
            var osDeployPlan = new OutsystemsDeploymentPlan(taskOptions);
            // var queueUri = await util.pollSubmitJob(taskOptions);
            // console.log(tl.loc('JenkinsJobQueued'));
            // var rootJob = await util.pollCreateRootJob(queueUri, jobQueue, taskOptions);
            // //start the job queue
            // jobQueue.start();
        }
        catch (e) {
            tl.debug(e.message);
            tl._writeError(e);
            tl.setResult(tl.TaskResult.Failed, e.message);
        }
    });
}
doWork();
