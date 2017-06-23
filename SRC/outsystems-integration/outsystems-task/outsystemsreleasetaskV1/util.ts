import tl = require('vsts-task-lib/task');
import Q = require('q');
import request = require('request');
import url = require('url');

// Outsystems Deploy Plans Exec Commands
export const osDeployPlanCommands = { "Start": "start", "Continue": "continue", "Abort": "abort"}; 
export const osDeploymentStatus= { "Running": "running", "Saved": "saved", "NeedsUserIntervention": "needs_user_intervention", "Aborted": "aborted", "Aborting": "aborting", "FinishedSuccessfully": "finished_successful", "FinishedWithWarnings": "finished_with_warnings", "FinishedWithErrors": "finished_with_errors"}; 


export function convertToBoolean(input: string): boolean | undefined {
    try {
        return JSON.parse(input);
    }
    catch (e) {
        return undefined;
    }
}
