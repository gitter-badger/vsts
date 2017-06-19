# LifetimeSdk.MobileAppStatusInEnv

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**environmentKey** | **String** | Environment unique identifier. | [optional] [default to &#39;&#39;]
**nativePlatform** | **String** | Name of native platform. [Android | iOS] | [optional] [default to &#39;&#39;]
**versionNumber** | **String** | The version number, like for example 1.5.4, of the native build. It is used to be able to map the version to the version in the Andoid or iOS store. | [optional] [default to &#39;&#39;]
**hasBinaryAvailable** | **Boolean** | True if the binary of the application is available for the current configuration. | [optional] 
**isConfigured** | **Boolean** | True if the application is configured. | [optional] 
**isConfigurationChanged** | **Boolean** | True if the configuration of the Mobile Application has changed in the environment. | [optional] 
**isModified** | **Boolean** | True if the Native Hash of the Mobile Application does not match the one in the AppVersionNativeBuild baseline. | [optional] 


