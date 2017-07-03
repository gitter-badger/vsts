import tl = require('vsts-task-lib/task');
import Q = require('q');
import request = require('request');
import url = require('url');

// Outsystems Deploy Plans Exec Commands
export const osDeployPlanCommands = { 'Start': 'start', 'Continue': 'continue', 'Abort': 'abort'};
export const osDeploymentStatus = {
    'Running': 'running',
    'Saved': 'saved',
    'NeedsUserIntervention': 'needs_user_intervention',
    'Aborted': 'aborted',
    'Aborting': 'aborting',
    'FinishedSuccessfully': 'finished_successful',
    'FinishedWithWarnings': 'finished_with_warnings',
    'FinishedWithErrors': 'finished_with_errors'};

const LOG_PREFIX = '[OUTSYSTEMS]';

export function log(...args: Array<string>) {
    const fArgs = Array.prototype.slice.call(args);
    fArgs.unshift(LOG_PREFIX + ': ');
    console.log.apply(console, fArgs);
}

export function ConvertToBoolean(input: string): boolean | undefined {
    try {
        return JSON.parse(input);
    } catch (e) {
        return undefined;
    }
}
