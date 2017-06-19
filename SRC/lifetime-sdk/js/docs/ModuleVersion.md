# LifetimeSdk.ModuleVersion

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**key** | **String** | Module version unique identifier. | [optional] [default to &#39;&#39;]
**moduleKey** | **String** | Module unique identifier. | [optional] [default to &#39;&#39;]
**createdOn** | **Date** | Date and time of the module version creation. | [optional] 
**createdBy** | **String** | Name of the user that created the version. | [optional] [default to &#39;&#39;]
**createdByUsername** | **String** | Username of the user that created the version. | [optional] [default to &#39;&#39;]
**generalHash** | **String** | Non-unique hash of the module version. Can be used to validate if two module versions have semantic differences. | [optional] [default to &#39;&#39;]
**directUpgradeFromHash** | **String** | If this module version is the result of a direct upgrade of another version, then this field contains the key of that version | [optional] [default to &#39;&#39;]
**publicElements** | [**[ModuleElement]**](ModuleElement.md) | List of module elements exposed by module version. | [optional] 
**consumedElements** | [**[ModuleElement]**](ModuleElement.md) | List of module elements consumed by module version. | [optional] 


