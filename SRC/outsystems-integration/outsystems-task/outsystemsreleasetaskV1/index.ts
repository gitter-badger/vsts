import * as tl from 'vsts-task-lib/task';
import * as path from 'path';
import * as url from 'url';

// node js modules
import * as ltclt from './oslifetime.sdk';
import * as ostask from './ostask';
import OsDeploy = ostask.OsDeploy;
import * as osreport from './osreport';
import OsReport = osreport.OsReport;

import * as util from './util';

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
        //mandatory para multi apps
        this.osAutomaticVersioning = util.ConvertToBoolean(tl.getInput('outsystemsAutomaticVersioning', true));

        let resultsDirectory: string = tl.getVariable('Build.StagingDirectory');
        if (!resultsDirectory) {
            // 'System.DefaultWorkingDirectory' is available during build and release
            resultsDirectory = tl.getVariable('System.DefaultWorkingDirectory');
        }

        this.saveResultsTo = path.join(resultsDirectory, 'outsystemsResults');

        this.strictSSL = ('true' !== tl.getEndpointDataParameter(this.osServerEndpoint, 'acceptUntrustedCerts', true));
    }
}

async function doWork() {

    tl.setResourcePath(path.join(__dirname, 'task.json'));

    const taskOptions: TaskOptions = new TaskOptions();
    const lifetime = new ltclt.V1Api(taskOptions.osServerEndpointUrl);
    const ltTokenApi = tl.getEndpointAuthorizationParameter(taskOptions.osServerEndpoint, 'apitoken', false);

    lifetime.setApiKey(ltclt.V1ApiApiKeys.os_auth, ltTokenApi);

    const curTask: OsDeploy = new OsDeploy(taskOptions, lifetime);
    await curTask.start();
}

doWork();
