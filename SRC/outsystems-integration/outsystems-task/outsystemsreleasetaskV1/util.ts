
import stream = require('stream');

import tl = require('vsts-task-lib/task');
import Q = require('q');

var request = require('request');

import task = require('./ostask');
import TaskOptions = task.TaskOptions;

import url = require('url');

// Outsystems Deploy Plans Exec Commands
export const osDeployPlanCommands = { "Start": "start", "Continue": "continue", "Abort": "abort"}; 
export const osDeploymentStatus= { "Running": "running", "Saved": "saved", "NeedsUserIntervention": "needs_user_intervention", "Aborted": "aborted", "Aborting": "aborting", "FinishedSuccessfully": "finished_successful", "FinishedWithWarnings": "finished_with_warnings", "FinishedWithErrors": "finished_with_errors"}; 

export function getFullErrorMessage(httpResponse, message: string): String {
    var fullMessage = message +
        '\nHttpResponse.statusCode=' + httpResponse.statusCode +
        '\nHttpResponse.statusMessage=' + httpResponse.statusMessage +
        '\nHttpResponse=\n' + JSON.stringify(httpResponse);
    return fullMessage;
}

export function failReturnCode(httpResponse, message: string): void {
    var fullMessage = message +
        '\nHttpResponse.statusCode=' + httpResponse.statusCode +
        '\nHttpResponse.statusMessage=' + httpResponse.statusMessage +
        '\nHttpResponse=\n' + JSON.stringify(httpResponse);
    fail(fullMessage);
}

export function handleConnectionResetError(err): void {
    if (err.code == 'ECONNRESET') {
        tl.debug(err);
    } else {
        fail(err);
    }
}

export function fail(message: string): void {
    throw new FailTaskError(message);
}

export class FailTaskError extends Error {
}

export function addUrlSegment(baseUrl: string, segment: string): string {
    var resultUrl = null;
    if (baseUrl.endsWith('/') && segment.startsWith('/')) {
        resultUrl = baseUrl + segment.slice(1);
    } else if (baseUrl.endsWith('/') || segment.startsWith('/')) {
        resultUrl = baseUrl + segment;
    } else {
        resultUrl = baseUrl + '/' + segment;
    }
    return resultUrl;
}


export function getUrlAuthority(myUrl: string): string {
    let parsed: url.Url = url.parse(myUrl);

    let result = '';
    if (parsed.auth) {
        result += parsed.auth;
    } else {
        if (parsed.protocol && parsed.host) {
            result = `${parsed.protocol}//${parsed.host}`;
        }
    }

    return result;

}


export class StringWritable extends stream.Writable {

    value: string = "";

    constructor(options) {
        super(options);
    }

    _write(data: any, encoding: string, callback: Function): void {
        tl.debug(data);
        this.value += data;
        if (callback) {
            callback();
        }
    }

    toString(): string {
        return this.value;
    }
};

export function convertToBoolean(input: string): boolean | undefined {
    try {
        return JSON.parse(input);
    }
    catch (e) {
        return undefined;
    }
}


//https://www.visualstudio.com/docs/build/define/variables
var allTeamBuildVariables: string[] = [
    //control variables
    'Build.Clean',
    'Build.SyncSources',
    'System.Debug',
    //predefined variables
    'Agent.BuildDirectory',
    'Agent.HomeDirectory',
    'Agent.Id',
    'Agent.MachineName',
    'Agent.Name',
    'Agent.WorkFolder',
    'Build.ArtifactStagingDirectory',
    'Build.BuildId',
    'Build.BuildNumber',
    'Build.BuildUri',
    'Build.BinariesDirectory',
    'Build.DefinitionName',
    'Build.DefinitionVersion',
    'Build.QueuedBy',
    'Build.QueuedById',
    'Build.Repository.Clean',
    'Build.Repository.LocalPath',
    'Build.Repository.Name',
    'Build.Repository.Provider',
    'Build.Repository.Tfvc.Workspace',
    'Build.Repository.Uri',
    'Build.RequestedFor',
    'Build.RequestedForId',
    'Build.SourceBranch',
    'Build.SourceBranchName',
    'Build.SourcesDirectory',
    'Build.SourceVersion',
    'Build.StagingDirectory',
    'Build.Repository.Git.SubmoduleCheckout',
    'Build.SourceTfvcShelveset',
    'Common.TestResultsDirectory',
    //'System.AccessToken', -- holding this one back, Outsystems has it's own access mechamisms to TFS/Teams
    'System.CollectionId',
    'System.DefaultWorkingDirectory',
    'System.DefinitionId',
    'System.TeamFoundationCollectionUri',
    'System.TeamProject',
    'System.TeamProjectId',
    'TF_BUILD'
];

//https://www.visualstudio.com/en-us/docs/build/concepts/definitions/release/variables
var allTeamReleaseVariables: string[] = [
    //system variables
    'System.TeamFoundationServerUri',
    'System.TeamFoundationCollectionUri',
    'System.CollectionId',
    'System.TeamProject',
    'System.TeamProjectId',
    'System.ArtifactsDirectory',
    'System.DefaultWorkingDirectory',
    'System.WorkFolder',
    'System.Debug',
    'Release.DefinitionName',
    'Release.DefinitionId',
    'Release.ReleaseName',
    'Release.ReleaseId',
    'Release.ReleaseUri',
    'Release.ReleaseDescription',
    'Release.RequestedFor',
    'Release.RequestedForId',
    'Release.EnvironmentName',
    'Release.EnvironmentId',
    'Release.EnvironmentUri',
    'Release.DefinitionEnvironmentId',
    'Release.AttemptNumber',
    'Release.Deployment.RequestedFor',
    'Release.Deployment.RequestedForId',
    //Release environment variables
    'Release.Environments.{Environment name}.Status',
    //Agent variables
    'Agent.Name',
    'Agent.MachineName',
    'Agent.Version',
    'Agent.JobName',
    'Agent.HomeDirectory',
    'Agent.ReleaseDirectory',
    'Agent.RootDirectory',
    'Agent.WorkFolder',
    //Artifact variables
    'Release.Artifacts.{Artifact alias}.DefinitionId',
    'Release.Artifacts.{Artifact alias}.DefinitionName',
    'Release.Artifacts.{Artifact alias}.BuildNumber',
    'Release.Artifacts.{Artifact alias}.BuildId',
    'Release.Artifacts.{Artifact alias}.BuildURI',
    'Release.Artifacts.{Artifact alias}.SourceBranch',
    'Release.Artifacts.{Artifact alias}.SourceBranchName',
    'Release.Artifacts.{Artifact alias}.SourceVersion',
    'Release.Artifacts.{Artifact alias}.Repository.Provider',
    'Release.Artifacts.{Artifact alias}.RequestedForID',
    'Release.Artifacts.{Artifact alias}.RequestedFor',
    'Release.Artifacts.{Artifact alias}.Type',
    //Primary artifact variables
    'Build.DefinitionId',
    'Build.DefinitionName',
    'Build.BuildNumber',
    'Build.BuildID',
    'Build.BuildURI',
    'Build.SourceBranchV',
    'Build.SourceBranchName',
    'Build.SourceVersion',
    'Build.Repository.Provider',
    'Build.RequestedForID',
    'Build.RequestedFor',
    'Build.Type'
];
