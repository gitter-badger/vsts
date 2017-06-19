# LifetimeSdk.AppStatusInEnv

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**environmentKey** | **String** | Environment unique identifier. | [optional] [default to &#39;&#39;]
**baseApplicationVersionKey** | **String** | Base application version unique identifier. If app is not modified in environment, this is the application version deployed. | [optional] [default to &#39;&#39;]
**isModified** | **Boolean** | True if the application has been changed since the last tag, false otherwise. | [optional] 
**isModifiedReason** | **String** | Indicates the application status. | [optional] [default to &#39;&#39;]
**isModifiedMessage** | **String** | Indicates the application status. | [optional] [default to &#39;&#39;]
**consistencyStatus** | **String** | Indicates the application consistency status. | [optional] [default to &#39;&#39;]
**consistencyStatusMessages** | **String** | Messages regarding the consistency status of the application. | [optional] [default to &#39;&#39;]
**mobileAppsStatus** | [**[MobileAppStatusInEnv]**](MobileAppStatusInEnv.md) | Status of mobile apps in environment. | [optional] 
**moduleStatusInEnvs** | [**[ModuleStatusInEnv]**](ModuleStatusInEnv.md) | Status of modules in environment. | [optional] 


