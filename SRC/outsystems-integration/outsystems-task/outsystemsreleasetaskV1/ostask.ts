import * as tl from 'vsts-task-lib/task';
import * as path from 'path';
import * as url from 'url';
import * as AsyncPolling from 'async-polling';

// node js modules
import * as ltclt from './oslifetime.sdk';
import * as task from './index';
import TaskOptions = task.TaskOptions;

import * as util from './util';

export class OsDeploy {
    public taskOptions: TaskOptions;
    public lifetime: ltclt.V1Api;

    public log: Array<ltclt.DeploymentMessage> = [];
    public status: string;

    public applicationIDs: string;
    public applicationName: string;
    public changeLog: string;
    public notes: string;
    public envSource: string;
    public envTarget: string;

    public appLastVersion: string;
    public appVersionToDeploy: string;
    public appVersionToDeployId: string;

    constructor(taskOptions: TaskOptions, lifeTime: ltclt.V1Api) {
        this.lifetime = lifeTime;
        this.taskOptions = taskOptions;
    }

    private APPVERSIONSTAGINGPUBLISHINGINTERVAL: number = 5000;
    private MAXAPPVERSIONTORETURN: number = 120;
    private PROGRESSINTERVALMILLIS: number = 2000;

    public async start(): Promise<any> {
        try {
            if (this.taskOptions.osTagAndDeploy) {
                //OSTAGANDDEPLOY
                if (this.taskOptions.osAutomaticVersioning) {
                    this.appLastVersion = await this.GetLatestAppVersion(this.taskOptions.osApplication);
                } else {
                    this.appLastVersion = this.taskOptions.osAppVersion;
                }
                const newModuleVersion: any = await this.GetModifiedModuleVersion(this.taskOptions.osApplication);
                if (newModuleVersion && newModuleVersion.moduleVersion) {
                    this.applicationName = newModuleVersion.name;
                    this.appVersionToDeployId = await this.CreateApplicationsVersion(
                        [newModuleVersion.moduleVersion],
                        this.taskOptions.osApplication,
                        this.taskOptions.osAutomaticVersioning,
                        this.appLastVersion,
                        this.taskOptions.osChangeLog,
                        this.taskOptions.osSource);

                    // Application Version taskes time to be published in staging.
                    // Else DeploymentCreate throws 'Failed to include application version
                    // in staging because it was never published in source environment '%s''.
                    await this.sleep();
                } else {
                    const message = tl.loc('OSFailureAppNotModified', this.applicationName);
                    //tl.setResult(tl.TaskResult.Failed, message);
                    throw new Error(message);
                }

            } else {
                // ! OSTAGANDDEPLOY
                this.applicationName = await this.GetApplication(this.taskOptions.osApplication);

                const appVersionKeyAndVersion = await this.GetAppVersionAndKey(this.taskOptions.osApplication, this.taskOptions.osAutomaticVersioning, this.taskOptions.osAppVersion);
                this.appVersionToDeployId = appVersionKeyAndVersion.key;
                this.appVersionToDeploy = appVersionKeyAndVersion.version;
            }

            const newDeployPlanKey: string = await this.CreateDeployPlan([this.appVersionToDeployId], this.taskOptions.osNotes, this.taskOptions.osSource, this.taskOptions.osTarget);
            await this.ExecuteDeployPan(newDeployPlanKey);
            const stat = await this.MonitorProgress(newDeployPlanKey);

            //TODO: AutomaticVersioning

        } catch (err) {
            let taskMessage: string;

            if (err.body) {
                taskMessage = ` [${err.body.StatusCode}] ${err.body.Errors}`;
            }
            if (err.message) {
                taskMessage = ` ${err.message}`;
            }

            tl.debug(JSON.stringify(err));
            //let message = tl.loc('OSAppVersionAlreadyExists',somthing);
            //tl.error(taskMessage);
            tl.setResult(tl.TaskResult.Failed, taskMessage);
        }
    }

    private async GetApplication(osApplication: string): Promise<string> {
        const res: any = await this.lifetime.applicationsGet(osApplication, true, true);
        const curApp: ltclt.Application = res.body;

        return curApp.Name;
    }

    private async GetModifiedModuleVersion(osApplication: string): Promise<any> {
        const res: any = await this.lifetime.applicationsGet(osApplication, true, true);

        const newApp: ltclt.Application = res.body;

        const lastModified: ltclt.AppStatusInEnv = newApp.AppStatusInEnvs.find(item => { return item.IsModified === true; });
        let newModuleVersionKey: string;
        if (lastModified) {
            newModuleVersionKey = lastModified.ModuleStatusInEnvs[0].ModuleVersionKey;
            tl.debug(`newModuleVersionKey = ${newModuleVersionKey}`);
        }
        return { name: newApp.Name, moduleVersion: newModuleVersionKey };
    }

    private async GetLatestAppVersion(osApplication: string): Promise<string> {
        const res: any = await this.lifetime.applicationsVersionsList(osApplication, this.MAXAPPVERSIONTORETURN);

        const appVersionList: Array<ltclt.ApplicationVersion> = res.body;
        // OS App Versions are returned ordered incorrectly. Does not follow semantic version.
        // Custome ordering, based in semver
        const orderedAppVersionList = util.OrderAppVersions(appVersionList);
        return orderedAppVersionList[0].Version;
    }

    private async GetAppVersionAndKey(osApplication: string, osAutomaticVersioning: boolean, osAppVersion: string): Promise<any> {
        const res: any = await this.lifetime.applicationsVersionsList(osApplication, this.MAXAPPVERSIONTORETURN);

        const appVersionList: Array<ltclt.ApplicationVersion> = res.body;
        const osApplicationName: string = res.body;

        let existingAppVersion: ltclt.ApplicationVersion;
        if (osAutomaticVersioning) {
            // OS App Versions are returned ordered.
            existingAppVersion = appVersionList[0];
        } else {
            existingAppVersion = appVersionList.find(item => { return item.Version === osAppVersion; });
        }

        if (!existingAppVersion) {
            const message = tl.loc('OSFailureAppVersionNotFound', osAppVersion, this.applicationName);
            throw new Error(message);
        }
        return { key: existingAppVersion.Key, version: existingAppVersion.Version };
    }

    private async CreateApplicationsVersion(moduleVersions: Array<string>, osApplication: string, osAutomaticVersioning: boolean, osAppLastVersion: string, osChangeLog: string, osEnvSource: string): Promise<string> {

        const newAppVersion: ltclt.ApplicationVersionCreate = new ltclt.ApplicationVersionCreate();
        newAppVersion.changeLog = osChangeLog;
        newAppVersion.mobileVersions = new Array<ltclt.MobileVersion>();
        newAppVersion.moduleVersionKeys = moduleVersions; //[newModuleVersionKey];

        this.appVersionToDeploy = newAppVersion.version = osAutomaticVersioning ? util.GetNextSemVersion(osAppLastVersion) : osAppLastVersion;
        tl.debug(`New App Version :` + JSON.stringify(newAppVersion));

        //Base Environment where to TAG version
        const res = await this.lifetime.environmentsApplicationsVersionsCreate(osEnvSource, osApplication, newAppVersion);

        const newAppVersionKey: string = res.body.ApplicationVersionKey;
        util.Log(`Created new Outsystem Application Version: ${newAppVersionKey}`);
        return newAppVersionKey;
    }

    private async CreateDeployPlan(appVersionKeys: Array<string>, osNotes: string, osEnvSource: string, osEnvTarget: string): Promise<string> {
        const deployPlan: ltclt.NotesSourceEnvironmentKeyTargetEnvironmentKeyApplicationVersionKeysRecord = new ltclt.NotesSourceEnvironmentKeyTargetEnvironmentKeyApplicationVersionKeysRecord();
        let newDeployPlanKey;

        deployPlan.applicationVersionKeys = appVersionKeys;
        tl.debug(`ApplicationVersionKeys= ${deployPlan.applicationVersionKeys}`);

        if (osNotes == null) {
            const deployPlanTimestamp = new Date();
            osNotes = osNotes || this.GetDefaultDeployNotes();
        }
        deployPlan.notes = osNotes;
        tl.debug(`Deployment Plan Note set to '${osNotes}'.`);

        deployPlan.sourceEnvironmentKey = osEnvSource;
        deployPlan.targetEnvironmentKey = osEnvTarget;
        tl.debug(`Deployment Plan :` + JSON.stringify(deployPlan));

        //New Deployment Plan
        const res = await this.lifetime.deploymentsCreate(deployPlan);
        newDeployPlanKey = res.body;
        util.Log(`Created Outsystems Deployment Plan: ${newDeployPlanKey}`);

        return newDeployPlanKey;
    }

    private async ExecuteDeployPan(deployPlan: string) {

        const res = await this.lifetime.deploymentsExecuteCommand(deployPlan, util.osDeployPlanCommands.Start);

        const deployCommandMessage: string = res.body.Errors[0];
        const deployStatusCode = res.body.StatusCode;

        tl.debug(`deployCommandMessage = ${deployCommandMessage}`);

        //return this.MonitorProgress(deployPlan);
    }

    private MonitorProgress(deployPlan: string) {

        let message;

        const polling = AsyncPolling((end) => {

            this.lifetime.deploymentsGetStatus(deployPlan)
                .then((res) => {
                    //const deployStatus: string = res.body.DeploymentStatus;
                    this.status = res.body.DeploymentStatus;
                    const curDeploylog : Array<ltclt.DeploymentMessage> = res.body.DeploymentLog;

                    // if (res.body.Errors) {
                    //     end(res.body.Errors);
                    // }

                    const deltaLog = curDeploylog.slice(this.log.length, curDeploylog.length);
                    this.log = curDeploylog;

                    deltaLog.forEach((deployEntry: ltclt.DeploymentMessage) => {
                        util.Log(deployEntry.Message);
                    });

                    end(null, res);

                });
        }, this.PROGRESSINTERVALMILLIS);

        polling.on('error', (error) => {
            message = tl.loc('OSUnabletoMonitorProgress', this.status);
            tl.debug(message);
            polling.stop();
        });

        polling.on('result', (result) => {
            switch (this.status) {
                case util.osDeploymentStatus.Running:
                case util.osDeploymentStatus.Aborting:
                    //RUNNING
                    break;
                case util.osDeploymentStatus.FinishedSuccessfully:
                case util.osDeploymentStatus.FinishedWithWarnings:
                case util.osDeploymentStatus.NeedsUserIntervention:
                    //SUCCESS
                    message = tl.loc('OSSuccessfulDeployment', this.status);
                    util.Log(message);
                    tl.setResult(tl.TaskResult.Succeeded, message);
                    polling.stop();
                    break;
                case util.osDeploymentStatus.FinishedWithErrors:
                case util.osDeploymentStatus.Aborted:
                    //ERROR
                    message = tl.loc('OSFailedDeployment', this.status);
                    tl.error(message);
                    tl.setResult(tl.TaskResult.Failed, message);
                    polling.stop();
                    break;
                default:
                    //We should never get to this situation.
                    //Status set to deployStatus == util.osDeploymentStatus.Saved
                    // or a Lifetime API change
                    //Abort deployment task and report issue
                    message = tl.loc('OSUnabletoMonitorProgress', this.status);
                    tl.debug(message);
                    polling.stop();
            }

        });

        polling.run();

    }

    private sleep() {
        return new Promise(resolve => setTimeout(resolve, this.APPVERSIONSTAGINGPUBLISHINGINTERVAL));
    }

    private GetDefaultDeployNotes(): string {
        const deployPlanTimestamp = new Date();
        const dayOfMonth = deployPlanTimestamp.getDate();
        const month = deployPlanTimestamp.getMonth() + 1;
        const year = deployPlanTimestamp.getFullYear();
        const hours = deployPlanTimestamp.getHours();
        const minutes = deployPlanTimestamp.getMinutes();

        return `${dayOfMonth}-${month}-${year}-${hours}-${minutes}`;
    }
}
