# LifetimeSdk.V1Api

All URIs are relative to *https://localhost/lifetimeapi/rest/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**applicationsGet**](V1Api.md#applicationsGet) | **GET** /applications/{ApplicationKey}/ | 
[**applicationsList**](V1Api.md#applicationsList) | **GET** /applications/ | 
[**applicationsVersionsGet**](V1Api.md#applicationsVersionsGet) | **GET** /applications/{ApplicationKey}/versions/{VersionKey}/ | 
[**applicationsVersionsList**](V1Api.md#applicationsVersionsList) | **GET** /applications/{ApplicationKey}/versions/ | 
[**deploymentsCreate**](V1Api.md#deploymentsCreate) | **POST** /deployments/ | 
[**deploymentsDelete**](V1Api.md#deploymentsDelete) | **DELETE** /deployments/{DeploymentKey}/ | 
[**deploymentsExecuteCommand**](V1Api.md#deploymentsExecuteCommand) | **POST** /deployments/{DeploymentKey}/{Command}/ | 
[**deploymentsGet**](V1Api.md#deploymentsGet) | **GET** /deployments/{DeploymentKey}/ | 
[**deploymentsGetStatus**](V1Api.md#deploymentsGetStatus) | **GET** /deployments/{DeploymentKey}/status/ | 
[**deploymentsList**](V1Api.md#deploymentsList) | **GET** /deployments/ | 
[**deploymentsUpdate**](V1Api.md#deploymentsUpdate) | **PUT** /deployments/{DeploymentKey}/ | 
[**downloads**](V1Api.md#downloads) | **GET** /downloads/{DownloadKey}/ | 
[**environmentsApplicationsVersionsCreate**](V1Api.md#environmentsApplicationsVersionsCreate) | **POST** /environments/{EnvironmentKey}/applications/{ApplicationKey}/versions/ | 
[**environmentsDownloadRunningApp**](V1Api.md#environmentsDownloadRunningApp) | **GET** /environments/{EnvironmentKey}/applications/{ApplicationKey}/content/ | 
[**environmentsGet**](V1Api.md#environmentsGet) | **GET** /environments/{EnvironmentKey}/ | 
[**environmentsGetRunningApp**](V1Api.md#environmentsGetRunningApp) | **GET** /environments/{EnvironmentKey}/applications/{ApplicationKey}/ | 
[**environmentsGetRunningApps**](V1Api.md#environmentsGetRunningApps) | **GET** /environments/{EnvironmentKey}/applications/ | 
[**environmentsList**](V1Api.md#environmentsList) | **GET** /environments/ | 
[**moduleVersionGet**](V1Api.md#moduleVersionGet) | **GET** /modules/{ModuleKey}/versions/{ModuleVersionKey}/ | 
[**moduleVersionsList**](V1Api.md#moduleVersionsList) | **GET** /modules/{ModuleKey}/versions/ | 
[**modulesGet**](V1Api.md#modulesGet) | **GET** /modules/{ModuleKey}/ | 
[**modulesList**](V1Api.md#modulesList) | **GET** /modules/ | 


<a name="applicationsGet"></a>
# **applicationsGet**
> Application applicationsGet(applicationKey, opts)



Returns the details of a given application.

### Example
```javascript
var LifetimeSdk = require('lifetime-sdk');

var apiInstance = new LifetimeSdk.V1Api();

var applicationKey = "applicationKey_example"; // String | The key of the desired application.

var opts = { 
  'includeModules': true, // Boolean | When set to true, the modules details are also retrieved. The default value is false.
  'includeEnvStatus': true // Boolean | When set to true, the application status per environment is also returned. The default value is false.
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.applicationsGet(applicationKey, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **applicationKey** | **String**| The key of the desired application. | 
 **includeModules** | **Boolean**| When set to true, the modules details are also retrieved. The default value is false. | [optional] 
 **includeEnvStatus** | **Boolean**| When set to true, the application status per environment is also returned. The default value is false. | [optional] 

### Return type

[**Application**](Application.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="applicationsList"></a>
# **applicationsList**
> [Application] applicationsList(opts)



Returns a list of applications that exist in the infrastructure.

### Example
```javascript
var LifetimeSdk = require('lifetime-sdk');

var apiInstance = new LifetimeSdk.V1Api();

var opts = { 
  'includeModules': true, // Boolean | When set to true, the modules are also returned. The default value is false.
  'includeEnvStatus': true // Boolean | When set to true, the application status per environment is also returned. The default value is false.
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.applicationsList(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **includeModules** | **Boolean**| When set to true, the modules are also returned. The default value is false. | [optional] 
 **includeEnvStatus** | **Boolean**| When set to true, the application status per environment is also returned. The default value is false. | [optional] 

### Return type

[**[Application]**](Application.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="applicationsVersionsGet"></a>
# **applicationsVersionsGet**
> ApplicationVersion applicationsVersionsGet(applicationKey, versionKey, includeModules)



Returns the details of a given version of the specified application.

### Example
```javascript
var LifetimeSdk = require('lifetime-sdk');

var apiInstance = new LifetimeSdk.V1Api();

var applicationKey = "applicationKey_example"; // String | The key of the application whose version is being requested.

var versionKey = "versionKey_example"; // String | The key of the desired application version.

var includeModules = true; // Boolean | When set to true, the modules details are also retrieved. The default value is false.


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.applicationsVersionsGet(applicationKey, versionKey, includeModules, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **applicationKey** | **String**| The key of the application whose version is being requested. | 
 **versionKey** | **String**| The key of the desired application version. | 
 **includeModules** | **Boolean**| When set to true, the modules details are also retrieved. The default value is false. | 

### Return type

[**ApplicationVersion**](ApplicationVersion.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="applicationsVersionsList"></a>
# **applicationsVersionsList**
> [ApplicationVersion] applicationsVersionsList(applicationKey, opts)



Returns a list of versions of a given application.

### Example
```javascript
var LifetimeSdk = require('lifetime-sdk');

var apiInstance = new LifetimeSdk.V1Api();

var applicationKey = "applicationKey_example"; // String | The key of the desired application.

var opts = { 
  'maximumVersionsToReturn': 56 // Number | The maximum number of versions to return. The default value is 5.
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.applicationsVersionsList(applicationKey, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **applicationKey** | **String**| The key of the desired application. | 
 **maximumVersionsToReturn** | **Number**| The maximum number of versions to return. The default value is 5. | [optional] 

### Return type

[**[ApplicationVersion]**](ApplicationVersion.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="deploymentsCreate"></a>
# **deploymentsCreate**
> &#39;String&#39; deploymentsCreate(deploymentData)



Creates a deployment to a target environment. An optional list of applications to include in the deployment can be specified. The input is a subset of deployment object.

### Example
```javascript
var LifetimeSdk = require('lifetime-sdk');

var apiInstance = new LifetimeSdk.V1Api();

var deploymentData = new LifetimeSdk.NotesSourceEnvironmentKeyTargetEnvironmentKeyApplicationVersionKeysRecord(); // NotesSourceEnvironmentKeyTargetEnvironmentKeyApplicationVersionKeysRecord | A Deployment record.


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.deploymentsCreate(deploymentData, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deploymentData** | [**NotesSourceEnvironmentKeyTargetEnvironmentKeyApplicationVersionKeysRecord**](NotesSourceEnvironmentKeyTargetEnvironmentKeyApplicationVersionKeysRecord.md)| A Deployment record. | 

### Return type

**&#39;String&#39;**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: text/plain

<a name="deploymentsDelete"></a>
# **deploymentsDelete**
> deploymentsDelete(deploymentKey)



Discards a deployment, if possible. Only deployments whose state is “saved” can be deleted.

### Example
```javascript
var LifetimeSdk = require('lifetime-sdk');

var apiInstance = new LifetimeSdk.V1Api();

var deploymentKey = "deploymentKey_example"; // String | The key of the deployment to delete.


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.deploymentsDelete(deploymentKey, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deploymentKey** | **String**| The key of the deployment to delete. | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="deploymentsExecuteCommand"></a>
# **deploymentsExecuteCommand**
> deploymentsExecuteCommand(deploymentKey, command)



Executes the given command in a specified deployment. The allowed commands are “start”, “continue” and “abort”.

### Example
```javascript
var LifetimeSdk = require('lifetime-sdk');

var apiInstance = new LifetimeSdk.V1Api();

var deploymentKey = "deploymentKey_example"; // String | The key of the deployment where the command will be executed.

var command = "command_example"; // String | The command to execute. One of “start”, “continue” or “abort”. 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.deploymentsExecuteCommand(deploymentKey, command, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deploymentKey** | **String**| The key of the deployment where the command will be executed. | 
 **command** | **String**| The command to execute. One of “start”, “continue” or “abort”.  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="deploymentsGet"></a>
# **deploymentsGet**
> DeploymentApplicationConflictsRecord deploymentsGet(deploymentKey)



Returns the details of a given deployment. The returned information contains the included applications and the possible conflicts that can arise from the deployment of the current applications.

### Example
```javascript
var LifetimeSdk = require('lifetime-sdk');

var apiInstance = new LifetimeSdk.V1Api();

var deploymentKey = "deploymentKey_example"; // String | The key of the desired deployment.


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.deploymentsGet(deploymentKey, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deploymentKey** | **String**| The key of the desired deployment. | 

### Return type

[**DeploymentApplicationConflictsRecord**](DeploymentApplicationConflictsRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="deploymentsGetStatus"></a>
# **deploymentsGetStatus**
> DeploymentStatusDeploymentLogRecord deploymentsGetStatus(deploymentKey)



Returns the details of a given deployment execution, including the deployment status and messages.

### Example
```javascript
var LifetimeSdk = require('lifetime-sdk');

var apiInstance = new LifetimeSdk.V1Api();

var deploymentKey = "deploymentKey_example"; // String | The key of the deployment whose status is being requested.


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.deploymentsGetStatus(deploymentKey, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deploymentKey** | **String**| The key of the deployment whose status is being requested. | 

### Return type

[**DeploymentStatusDeploymentLogRecord**](DeploymentStatusDeploymentLogRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="deploymentsList"></a>
# **deploymentsList**
> [Deployment] deploymentsList(opts)



Returns a list of deployments ordered by creation date, from newest to oldest.

### Example
```javascript
var LifetimeSdk = require('lifetime-sdk');

var apiInstance = new LifetimeSdk.V1Api();

var opts = { 
  'minDate': new Date("2013-10-20"), // Date | The minimum creation date of the deployments to return. The default value is 1 week before the current date.
  'maxDate': new Date("2013-10-20") // Date | The maximum creation date of the deployments to return. The default value is the current date.
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.deploymentsList(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **minDate** | **Date**| The minimum creation date of the deployments to return. The default value is 1 week before the current date. | [optional] 
 **maxDate** | **Date**| The maximum creation date of the deployments to return. The default value is the current date. | [optional] 

### Return type

[**[Deployment]**](Deployment.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="deploymentsUpdate"></a>
# **deploymentsUpdate**
> Deployment deploymentsUpdate(deploymentKey, deploymentData)



Updates a given deployment. An optional list of applications to include in the deployment can be specified. The input is a subset of deployment object.

### Example
```javascript
var LifetimeSdk = require('lifetime-sdk');

var apiInstance = new LifetimeSdk.V1Api();

var deploymentKey = "deploymentKey_example"; // String | The key of the deployment to update.

var deploymentData = new LifetimeSdk.NotesSourceEnvironmentKeyTargetEnvironmentKeyApplicationVersionKeysRecord(); // NotesSourceEnvironmentKeyTargetEnvironmentKeyApplicationVersionKeysRecord | The deployment information to update.


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.deploymentsUpdate(deploymentKey, deploymentData, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deploymentKey** | **String**| The key of the deployment to update. | 
 **deploymentData** | [**NotesSourceEnvironmentKeyTargetEnvironmentKeyApplicationVersionKeysRecord**](NotesSourceEnvironmentKeyTargetEnvironmentKeyApplicationVersionKeysRecord.md)| The deployment information to update. | 

### Return type

[**Deployment**](Deployment.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="downloads"></a>
# **downloads**
> &#39;String&#39; downloads(downloadKey)



@hide This is a method use only to actually download the files is not really an API method.

### Example
```javascript
var LifetimeSdk = require('lifetime-sdk');

var apiInstance = new LifetimeSdk.V1Api();

var downloadKey = "downloadKey_example"; // String | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.downloads(downloadKey, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **downloadKey** | **String**|  | 

### Return type

**&#39;String&#39;**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/octet-stream

<a name="environmentsApplicationsVersionsCreate"></a>
# **environmentsApplicationsVersionsCreate**
> ApplicationVersionKeyRecord environmentsApplicationsVersionsCreate(environmentKey, applicationKey, applicationVersionCreate)



Creates a new version of the application based on the current running application.

### Example
```javascript
var LifetimeSdk = require('lifetime-sdk');

var apiInstance = new LifetimeSdk.V1Api();

var environmentKey = "environmentKey_example"; // String | The key of the environment from which to get the application.

var applicationKey = "applicationKey_example"; // String | The key of the application for which to generate a new version.

var applicationVersionCreate = new LifetimeSdk.ApplicationVersionCreate(); // ApplicationVersionCreate | A structure holding the new version name for the application and for its native applications, if applicable.


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.environmentsApplicationsVersionsCreate(environmentKey, applicationKey, applicationVersionCreate, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **environmentKey** | **String**| The key of the environment from which to get the application. | 
 **applicationKey** | **String**| The key of the application for which to generate a new version. | 
 **applicationVersionCreate** | [**ApplicationVersionCreate**](ApplicationVersionCreate.md)| A structure holding the new version name for the application and for its native applications, if applicable. | 

### Return type

[**ApplicationVersionKeyRecord**](ApplicationVersionKeyRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="environmentsDownloadRunningApp"></a>
# **environmentsDownloadRunningApp**
> DownloadLink environmentsDownloadRunningApp(environmentKey, applicationKey, opts)



Returns a link where the binary file for a given application can be downloaded. The link will expire in 60 minutes.

### Example
```javascript
var LifetimeSdk = require('lifetime-sdk');

var apiInstance = new LifetimeSdk.V1Api();

var environmentKey = "environmentKey_example"; // String | The key of the environment from which to get the application binary file link.

var applicationKey = "applicationKey_example"; // String | The key of the application for which to get the binary file link.

var opts = { 
  'type': "" // String | The type of binary file to return, when applicable. One of “oap”, “apk” or “ipa”.
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.environmentsDownloadRunningApp(environmentKey, applicationKey, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **environmentKey** | **String**| The key of the environment from which to get the application binary file link. | 
 **applicationKey** | **String**| The key of the application for which to get the binary file link. | 
 **type** | **String**| The type of binary file to return, when applicable. One of “oap”, “apk” or “ipa”. | [optional] [default to ]

### Return type

[**DownloadLink**](DownloadLink.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="environmentsGet"></a>
# **environmentsGet**
> Environment environmentsGet(environmentKey)



Returns the details of a given environment.

### Example
```javascript
var LifetimeSdk = require('lifetime-sdk');

var apiInstance = new LifetimeSdk.V1Api();

var environmentKey = "environmentKey_example"; // String | The key of the desired environment.


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.environmentsGet(environmentKey, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **environmentKey** | **String**| The key of the desired environment. | 

### Return type

[**Environment**](Environment.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="environmentsGetRunningApp"></a>
# **environmentsGetRunningApp**
> Application environmentsGetRunningApp(environmentKey, applicationKey, opts)



Returns information about the running version of the specified application in a given environment.

### Example
```javascript
var LifetimeSdk = require('lifetime-sdk');

var apiInstance = new LifetimeSdk.V1Api();

var environmentKey = "environmentKey_example"; // String | The key of the environment from which to get the running application details.

var applicationKey = "applicationKey_example"; // String | The key of the application whose details are being requested.

var opts = { 
  'includeEnvStatus': true, // Boolean | When set to true, the applications’ status information in the environment is included in the result. The default value is false.
  'includeModules': true // Boolean | When set to true, the modules details are also retrieved. The default value is false.
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.environmentsGetRunningApp(environmentKey, applicationKey, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **environmentKey** | **String**| The key of the environment from which to get the running application details. | 
 **applicationKey** | **String**| The key of the application whose details are being requested. | 
 **includeEnvStatus** | **Boolean**| When set to true, the applications’ status information in the environment is included in the result. The default value is false. | [optional] 
 **includeModules** | **Boolean**| When set to true, the modules details are also retrieved. The default value is false. | [optional] 

### Return type

[**Application**](Application.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="environmentsGetRunningApps"></a>
# **environmentsGetRunningApps**
> [Application] environmentsGetRunningApps(environmentKey, opts)



Returns information about the running versions of all applications in a given environment.

### Example
```javascript
var LifetimeSdk = require('lifetime-sdk');

var apiInstance = new LifetimeSdk.V1Api();

var environmentKey = "environmentKey_example"; // String | The key of the environment whose list of running applications is being requested.

var opts = { 
  'includeModules': true, // Boolean | When set to true, the modules details are also retrieved. The default value is false.
  'includeEnvStatus': true // Boolean | When set to true, the applications’ status information in the environment is included in the result. The default value is false.
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.environmentsGetRunningApps(environmentKey, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **environmentKey** | **String**| The key of the environment whose list of running applications is being requested. | 
 **includeModules** | **Boolean**| When set to true, the modules details are also retrieved. The default value is false. | [optional] 
 **includeEnvStatus** | **Boolean**| When set to true, the applications’ status information in the environment is included in the result. The default value is false. | [optional] 

### Return type

[**[Application]**](Application.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="environmentsList"></a>
# **environmentsList**
> [Environment] environmentsList()



Lists all the environments in the infrastructure.

### Example
```javascript
var LifetimeSdk = require('lifetime-sdk');

var apiInstance = new LifetimeSdk.V1Api();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.environmentsList(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[Environment]**](Environment.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="moduleVersionGet"></a>
# **moduleVersionGet**
> ModuleVersion moduleVersionGet(moduleKey, moduleVersionKey, opts)



Returns the details of a given module version.

### Example
```javascript
var LifetimeSdk = require('lifetime-sdk');

var apiInstance = new LifetimeSdk.V1Api();

var moduleKey = "moduleKey_example"; // String | The module from where to retrieve the versions from.

var moduleVersionKey = "moduleVersionKey_example"; // String | Key of the module version to return.

var opts = { 
  'includePublicElements': true, // Boolean | Boolean to indicate if public elements should be returned. Default is false.
  'includeConsumedElements': true // Boolean | Boolean to indicate if consumed elements should be returned. Default is false.
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.moduleVersionGet(moduleKey, moduleVersionKey, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **moduleKey** | **String**| The module from where to retrieve the versions from. | 
 **moduleVersionKey** | **String**| Key of the module version to return. | 
 **includePublicElements** | **Boolean**| Boolean to indicate if public elements should be returned. Default is false. | [optional] 
 **includeConsumedElements** | **Boolean**| Boolean to indicate if consumed elements should be returned. Default is false. | [optional] 

### Return type

[**ModuleVersion**](ModuleVersion.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="moduleVersionsList"></a>
# **moduleVersionsList**
> [ModuleVersion] moduleVersionsList(moduleKey, opts)



Returns a list of versions of a given module.

### Example
```javascript
var LifetimeSdk = require('lifetime-sdk');

var apiInstance = new LifetimeSdk.V1Api();

var moduleKey = "moduleKey_example"; // String | The module from where to retrieve the versions from.

var opts = { 
  'includePublicElements': true, // Boolean | Boolean to indicate if public elements should be returned. Default is false.
  'includeConsumedElements': true, // Boolean | Boolean to indicate if consumed elements should be returned. Default is false.
  'maximumVersionsToReturn': 56 // Number | Maximum number of versions to return. Default is 5.
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.moduleVersionsList(moduleKey, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **moduleKey** | **String**| The module from where to retrieve the versions from. | 
 **includePublicElements** | **Boolean**| Boolean to indicate if public elements should be returned. Default is false. | [optional] 
 **includeConsumedElements** | **Boolean**| Boolean to indicate if consumed elements should be returned. Default is false. | [optional] 
 **maximumVersionsToReturn** | **Number**| Maximum number of versions to return. Default is 5. | [optional] 

### Return type

[**[ModuleVersion]**](ModuleVersion.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="modulesGet"></a>
# **modulesGet**
> Module modulesGet(moduleKey, opts)



Returns the details of a given module.

### Example
```javascript
var LifetimeSdk = require('lifetime-sdk');

var apiInstance = new LifetimeSdk.V1Api();

var moduleKey = "moduleKey_example"; // String | Key of the module to list the details from.

var opts = { 
  'includeEnvStatus': true // Boolean | When set to true, the module status per environment is also returned. The default value is false.
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.modulesGet(moduleKey, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **moduleKey** | **String**| Key of the module to list the details from. | 
 **includeEnvStatus** | **Boolean**| When set to true, the module status per environment is also returned. The default value is false. | [optional] 

### Return type

[**Module**](Module.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="modulesList"></a>
# **modulesList**
> [Module] modulesList(opts)



Returns a list of modules that exist in the infrastructure.

### Example
```javascript
var LifetimeSdk = require('lifetime-sdk');

var apiInstance = new LifetimeSdk.V1Api();

var opts = { 
  'includeEnvStatus': true // Boolean | When set to true, the module status per environment is also returned. The default value is false.
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.modulesList(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **includeEnvStatus** | **Boolean**| When set to true, the module status per environment is also returned. The default value is false. | [optional] 

### Return type

[**[Module]**](Module.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

