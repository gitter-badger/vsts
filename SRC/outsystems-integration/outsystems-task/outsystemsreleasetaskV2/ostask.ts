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

    public applicationIDs: Array<string> = [];
    public applicationName: Array<any> = [];
    public changeLog: string;
    public notes: string;
    public envSource: string;
    public envTarget: string;

    public appLastVersion: Array<string> = new Array<string>();
    //public appVersionToDeploy: string;
    public appVersionsToDeployIds: Array<string> = new Array<string>();

    constructor(taskOptions: TaskOptions, lifeTime: ltclt.V1Api) {
        this.lifetime = lifeTime;
        this.taskOptions = taskOptions;
        this.applicationIDs = this.taskOptions.osApplication.split(',');
    }

    private APPVERSIONSTAGINGPUBLISHINGINTERVAL: number = 5000;
    private MAXAPPVERSIONTORETURN: number = 120;
    private PROGRESSINTERVALMILLIS: number = 2000;

    public async start(): Promise<any> {
        try {
            if (this.taskOptions.osTagAndDeploy) {
                //OSTAGANDDEPLOY
                if (this.taskOptions.osAutomaticVersioning) {
                    for (const app of this.applicationIDs) {
                        const result = await this.GetLatestAppVersion(app);
                        this.appLastVersion.push(result);
                    }
                } else {
                    this.appLastVersion.push(this.taskOptions.osAppVersion);
                }

                const newModuleVersions = new Array<any>();
                for (const app of this.applicationIDs) {
                    const result: any = await this.GetModifiedModuleVersion(app);
                    newModuleVersions.push(result);
                }

                this.applicationName = newModuleVersions.map((mv) => {
                    return mv.name;
                });

                if (newModuleVersions.every((mv) => { return mv.moduleVersion; })) {
                    //if (newModuleVersions[0].moduleVersion) {
                    for (let i = 0; i < this.appLastVersion.length; i++) {
                        //for (const newApp of this.appLastVersion) {
                        const result = await this.CreateApplicationsVersion(
                            [newModuleVersions[i].moduleVersion],
                            //this.taskOptions.osApplication,
                            this.applicationIDs[i],
                            this.taskOptions.osAutomaticVersioning,
                            this.appLastVersion[i],
                            this.taskOptions.osChangeLog,
                            this.taskOptions.osSource);
                        this.appVersionsToDeployIds.push(result);

                    // Application Version taskes time to be published in staging.
                    // Else DeploymentCreate throws 'Failed to include application version
                    // in staging because it was never published in source environment '%s''.
                    await this.sleep();
                        }
                    } else if (this.applicationIDs.length > 1) {
                        const errAppList = newModuleVersions.filter((mv) => {
                            return mv.moduleVersion === undefined;
                        }).map((mv) => {
                            return mv.name;
                        }).join();
                        const message = tl.loc('OSFailureAppsNotModified', errAppList);
                        //tl.setResult(tl.TaskResult.Failed, message);
                        throw new Error(message);
                } else {
                    const message = tl.loc('OSFailureAppNotModified', this.applicationName[0].name);
                    //tl.setResult(tl.TaskResult.Failed, message);
                    throw new Error(message);
                }

            } else {
                // ! OSTAGANDDEPLOY
                //this.applicationName = await this.GetApplication(this.taskOptions.osApplication);
                for (const app of this.applicationIDs) {
                    const result: any = await this.GetApplication(app);
                    this.applicationName.push(result);
                }

                const appVersionsKeyAndVersion: Array<any> = [];
                for (const app of this.applicationIDs) {
                    const result: any = await this.GetAppVersionAndKey(app, this.taskOptions.osAutomaticVersioning, this.taskOptions.osAppVersion);
                    appVersionsKeyAndVersion.push(result);
                }

                this.appVersionsToDeployIds = appVersionsKeyAndVersion.map((apv) => {
                    return apv.key;
                });
                //this.appVersionToDeploy = appVersionKeyAndVersion.version;

                //const appVersionKeyAndVersion = await this.GetAppVersionAndKey(this.taskOptions.osApplication, this.taskOptions.osAutomaticVersioning, this.taskOptions.osAppVersion);
                //this.appVersionsToDeployIds[0] = appVersionKeyAndVersion.key;
                //this.appVersionToDeploy = appVersionKeyAndVersion.version;
            }

            const newDeployPlanKey: string = await this.CreateDeployPlan(this.appVersionsToDeployIds, this.taskOptions.osNotes, this.taskOptions.osSource, this.taskOptions.osTarget);
            await this.ExecuteDeployPan(newDeployPlanKey);
            const stat = await this.MonitorProgress(newDeployPlanKey);

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
            // OS App Versions are returned ordered incorrectly. Does not follow semantic version.
            // Custome ordering, based in semver
            const orderedAppVersionList = util.OrderAppVersions(appVersionList);
            existingAppVersion = orderedAppVersionList[0];
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

        //this.appVersionToDeploy = newAppVersion.version = osAutomaticVersioning ? util.GetNextSemVersion(osAppLastVersion) : osAppLastVersion;
        const appVersionToDeploy = newAppVersion.version = osAutomaticVersioning ? util.GetNextSemVersion(osAppLastVersion) : osAppLastVersion;
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
                    const curDeploylog: Array<ltclt.DeploymentMessage> = res.body.DeploymentLog;

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
