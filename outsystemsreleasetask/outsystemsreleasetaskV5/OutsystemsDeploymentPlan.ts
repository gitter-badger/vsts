
import tl = require('vsts-task-lib/task');
import fs = require('fs');
import path = require('path');
import shell = require('shelljs');

// node js modules
import task = require('./ostask');
import TaskOptions = task.TaskOptions;

import util = require('./util');
import ltclt = require('./oslifetime.sdk');

export class OutsystemsDeploymentPlan {
    taskOptions: TaskOptions;

    constructor(taskOptions: TaskOptions) {
        this.taskOptions = taskOptions;
    }
}