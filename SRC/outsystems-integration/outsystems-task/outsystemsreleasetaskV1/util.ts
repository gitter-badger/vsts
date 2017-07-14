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

export function OrderAppVersions(appList: Array<any>): any {
    return appList.sort((a, b) => {
        const v1 = a;
        const v2 = b;

        //v1.Version = '1.1.02';
        if (!semver.valid(v1.Version)) { v1.Version = CleanOSVersion(v1.Version); }
        if (!semver.valid(v2.Version)) { v2.Version = CleanOSVersion(v2.Version);  }

        try {
            if (semver.gt(a.Version, b.Version)) { return -1; }
            if (semver.eq(a.Version, b.Version)) { return 0; }
            if (semver.lt(a.Version, b.Version)) { return 1; }

        } catch (err) {
            return -1;
        }
    });
}

function CleanOSVersion(ver: string): string{
    let cleanVersion: string;

    const parts = ver.split('.');
    parts.forEach((item, index, arr) => {
        let tmp = item.replace(/^0+/, '');
        if (tmp === '') { tmp = '0'; }
        arr[index] = tmp;
    });
    cleanVersion = parts.join('.');

    if (!semver.valid(cleanVersion)) {
        cleanVersion = `${cleanVersion}.0`;
    }

    // if (parts[0]) {
    //     parts[0] = parts[0].replace(/^0+/, '');
    //     if (parts[0] === '') { parts[0] = '0'; }
    //     cleanVersion = `${parts[0]}`;
    // }
    // if (parts[1]) {
    //     parts[1] = parts[1].replace(/^0+/, '');
    //     if (parts[1] === '') { parts[1] = '0'; }
    //     cleanVersion = cleanVersion + `.${parts[1]}`;
    // }
    // if (parts[2]) {
    //     parts[2] = parts[2].replace(/^0+/, '');
    //     if (parts[0] === '') { parts[0] = '0'; }
    //     cleanVersion = cleanVersion + `.${parts[2]}`;
    // } else { cleanVersion = `${cleanVersion}.0`; }

    // cleanVersion = `${parts[0]}.${parts[1]}.${parts[2]}`;
    // ver.replace('.0', '.');

    // cleanVersion = ver.replace('.0', '.');

    //console.log(("str1,str2,str3,str4".match(new RegExp("str", "g")) || []).length);

    // console.log((cleanVersion.match('.') || []).length);
    // if ((cleanVersion.match(/./) || []).length < 2) {
    //     cleanVersion = `${cleanVersion}.0`;
    // }

    return cleanVersion;
}
