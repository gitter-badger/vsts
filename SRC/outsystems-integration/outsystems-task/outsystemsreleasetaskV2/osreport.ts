import * as tl from 'vsts-task-lib/task';
import * as path from 'path';
import * as url from 'url';
import * as semver from 'semver';

// node js modules
import * as ltclt from './oslifetime.sdk';
import * as vstask from './index';
import * as ostask from './ostask';
import * as util from './util';
import TaskOptions = vstask.TaskOptions;

export class OsReport {
    public taskOptions: TaskOptions;
    public lifetime: ltclt.V1Api;

    public reportDate: string;

    constructor(taskOptions: TaskOptions, lifeTime: ltclt.V1Api) {
        this.lifetime = lifeTime;
        this.taskOptions = taskOptions;
    }

    public async writeFinalMarkdown() {
        try {
            console.log('not implemented yet');
        } catch (err) {
            console.log('Error: ', err.message);
        }
    }

    public async generateReport() {
        try {
            console.log('not implemented yet');
        } catch (err) {
            console.log('Error: ', err.message);
        }
    }

    public async generateMarkdownContent() {
        try {
            console.log('not implemented yet');
        } catch (err) {
            console.log('Error: ', err.message);
        }
    }
}