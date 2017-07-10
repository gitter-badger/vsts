import * as tl from 'vsts-task-lib/task';
import * as semver from 'semver';

// Outsystems Deploy Plans Exec Commands
export const osDeployPlanCommands = { 'Start': 'start', 'Continue': 'continue', 'Abort': 'abort' };
export const osDeploymentStatus = {
    'Running': 'running',
    'Saved': 'saved',
    'NeedsUserIntervention': 'needs_user_intervention',
    'Aborted': 'aborted',
    'Aborting': 'aborting',
    'FinishedSuccessfully': 'finished_successful',
    'FinishedWithWarnings': 'finished_with_warnings',
    'FinishedWithErrors': 'finished_with_errors'
};

const LOG_PREFIX = '[OUTSYSTEMS]';

export function Log(...args: Array<string>) {
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

// Semantic Versioning http://semver.org/
export function GetNextSemVersion(curVersion: string): string {
    try {
        const releaseType = { Major: 'major', Minor: 'minor', Patch: 'patch' };
        const MAXVERSIONPART: number = 1000;
        let updatePart: string;

        if (!semver.valid(curVersion)) {
            curVersion = `${curVersion}.0`;
        }

        const osMajor = semver.major(curVersion);
        const osMinor = semver.minor(curVersion);
        const osPatch = semver.patch(curVersion);

        updatePart = releaseType.Patch;
        if ((osPatch + 1) >= MAXVERSIONPART) { updatePart = releaseType.Minor; }
        if ((osPatch + 1) >= MAXVERSIONPART && (osMinor + 1) >= MAXVERSIONPART) { updatePart = releaseType.Major; }

        //Version Increment
        const newOsVersion = semver.inc(curVersion, updatePart as semver.ReleaseType);

        //Version Validation
        if (semver.valid(newOsVersion)) {
            return newOsVersion;
        } else { return undefined; }

    } catch (e) {
        return undefined;
    }
}
