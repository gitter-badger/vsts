# LifetimeSdk.Application

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**key** | **String** | Application unique identifier. | [default to &#39;&#39;]
**name** | **String** | Name of the application. | [optional] [default to &#39;&#39;]
**kind** | **String** | Identifies the kind of application. [Mobile|WebResponsive] | [optional] [default to &#39;&#39;]
**team** | **String** | The team that owns the application. | [optional] [default to &#39;&#39;]
**description** | **String** | Description of the application. | [optional] [default to &#39;&#39;]
**uRLPath** | **String** | Relative URL path of the application, starting from the hostname. | [optional] [default to &#39;&#39;]
**iconHash** | **String** | Hash of the application icon. Can be used to detect changes in the application icon. | [optional] [default to &#39;&#39;]
**iconURL** | **String** | The URL for the application icon. | [optional] [default to &#39;&#39;]
**isSystem** | **Boolean** | Indicates if the application is a built-in component of the AgilePlatform (e.g. ServiceCenter, LifeTime, ...). | [optional] 
**appStatusInEnvs** | [**[AppStatusInEnv]**](AppStatusInEnv.md) | Information about the status of the application in each environment it is running. | [optional] 


