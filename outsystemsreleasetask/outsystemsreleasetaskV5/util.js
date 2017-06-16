"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream = require("stream");
const tl = require("vsts-task-lib/task");
var request = require('request');
const url = require("url");
function getFullErrorMessage(httpResponse, message) {
    var fullMessage = message +
        '\nHttpResponse.statusCode=' + httpResponse.statusCode +
        '\nHttpResponse.statusMessage=' + httpResponse.statusMessage +
        '\nHttpResponse=\n' + JSON.stringify(httpResponse);
    return fullMessage;
}
exports.getFullErrorMessage = getFullErrorMessage;
function failReturnCode(httpResponse, message) {
    var fullMessage = message +
        '\nHttpResponse.statusCode=' + httpResponse.statusCode +
        '\nHttpResponse.statusMessage=' + httpResponse.statusMessage +
        '\nHttpResponse=\n' + JSON.stringify(httpResponse);
    fail(fullMessage);
}
exports.failReturnCode = failReturnCode;
function handleConnectionResetError(err) {
    if (err.code == 'ECONNRESET') {
        tl.debug(err);
    }
    else {
        fail(err);
    }
}
exports.handleConnectionResetError = handleConnectionResetError;
function fail(message) {
    throw new FailTaskError(message);
}
exports.fail = fail;
class FailTaskError extends Error {
}
exports.FailTaskError = FailTaskError;
function addUrlSegment(baseUrl, segment) {
    var resultUrl = null;
    if (baseUrl.endsWith('/') && segment.startsWith('/')) {
        resultUrl = baseUrl + segment.slice(1);
    }
    else if (baseUrl.endsWith('/') || segment.startsWith('/')) {
        resultUrl = baseUrl + segment;
    }
    else {
        resultUrl = baseUrl + '/' + segment;
    }
    return resultUrl;
}
exports.addUrlSegment = addUrlSegment;
function getUrlAuthority(myUrl) {
    let parsed = url.parse(myUrl);
    let result = '';
    if (parsed.auth) {
        result += parsed.auth;
    }
    else {
        if (parsed.protocol && parsed.host) {
            result = `${parsed.protocol}//${parsed.host}`;
        }
    }
    return result;
}
exports.getUrlAuthority = getUrlAuthority;
class StringWritable extends stream.Writable {
    constructor(options) {
        super(options);
        this.value = "";
    }
    _write(data, encoding, callback) {
        tl.debug(data);
        this.value += data;
        if (callback) {
            callback();
        }
    }
    toString() {
        return this.value;
    }
}
exports.StringWritable = StringWritable;
;
//https://www.visualstudio.com/docs/build/define/variables
var allTeamBuildVariables = [
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
