import * as tl from 'vsts-task-lib/task';
import * as request from 'request';
import * as path from 'path';
import * as url from 'url';

// node js modules
import * as ltclt from '../outsystems-task/outsystemsreleasetaskV2/oslifetime.sdk';
import * as ostask from '../outsystems-task/outsystemsreleasetaskV2/ostask';
import OsDeploy = ostask.OsDeploy;
import * as osreport from '../outsystems-task/outsystemsreleasetaskV2/osreport';
import OsReport = osreport.OsReport;

import * as util from '../outsystems-task/outsystemsreleasetaskV2//util';

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
    public osAutomaticVersioning: boolean;   //outsystemsAutomaticVersioning

    public saveResultsTo: string;
    public strictSSL: boolean;

    constructor() {

        this.osServerEndpoint = '';
        this.osServerEndpointUrl = 'https://os10lt.northeurope.cloudapp.azure.com/lifetimeapi/rest/v1';

        // this.osApplication = 'ffc7e96f-f0d7-4803-bf77-e348a6596ba8'; //X01Darts
        this.osApplication = 'fbc16570-8002-4a25-aabc-b647cb0d256a'; //X0MDarts
        // this.osApplication = 'ffc7e96f-f0d7-4803-bf77-e348a6596ba8,fbc16570-8002-4a25-aabc-b647cb0d256a'; //X01Darts & X0MDarts

        this.osTagAndDeploy = false;
        this.osAutomaticVersioning = true;

        this.osAppVersion = '0.5.42';
        this.osExistingAppVersion = '';

        this.osChangeLog = `OS App Change log from test: ${new Date().toUTCString()}`;
        this.osNotes = `OS App Deploy Notes from test: ${new Date().toUTCString()}`;

        // this.osSource = '6edd0422-74c7-4fe9-bd2a-b3eb1ae30cba'; //Dev
        // this.osTarget = '6eac907e-f9ad-48c6-994d-7acda431aa3c'; //Test

        this.osSource = '6eac907e-f9ad-48c6-994d-7acda431aa3c'; //Test
        this.osTarget = 'd690b43e-f77a-48bf-a610-fdb7ac3fc062'; //Prod

        // let resultsDirectory: string = tl.getVariable('Build.StagingDirectory');
        // if (!resultsDirectory) {
        //     // 'System.DefaultWorkingDirectory' is available during build and release
        //     resultsDirectory = tl.getVariable('System.DefaultWorkingDirectory');
        // }

        // this.saveResultsTo = path.join(resultsDirectory, 'outsystemsResults');

        this.strictSSL = false;
        tl.debug('strictSSL=' + this.strictSSL);
    }
}

async function doWork() {
    try {
//        tl.setResourcePath(path.join(__dirname, 'task.json'));

        const taskOptions: TaskOptions = new TaskOptions();
        const lifetime = new ltclt.V1Api(taskOptions.osServerEndpointUrl, taskOptions.strictSSL);
        // tslint:disable-next-line:max-line-length
        lifetime.setApiKey(ltclt.V1ApiApiKeys.os_auth, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJsaWZldGltZSIsInN1YiI6IllUWTFPVGs1T0RFdE5XWmtOUzAwWW1aa0xXSmhPR1F0TnpNd01EQmxaRFF5TXpsaCIsImF1ZCI6ImxpZmV0aW1lIiwiaWF0IjoiMTQ5NzIyMzc5OSIsImppdCI6InlNZkhaZnVMOHkifQ==.dmMX09hcZh3Hqa3oHFpFoZ9AZU2VjK35XArCgCCPaZ0=');

        const curTask: OsDeploy = new OsDeploy(taskOptions, lifetime);
        await curTask.start();
    } catch (err) {
        const errorMessage = JSON.stringify(err);
        //tl.debug(errorMessage);
        tl.setResult(tl.TaskResult.Failed, `Error: ${err.message} Details: ${errorMessage}`);
    }
}

doWork();
