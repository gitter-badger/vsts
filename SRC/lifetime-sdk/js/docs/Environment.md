# LifetimeSdk.Environment

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**key** | **String** | Unique identifier of the environment. | [optional] [default to &#39;&#39;]
**name** | **String** | Name of the environment. | [optional] [default to &#39;&#39;]
**oSVersion** | **String** | Platform Server version. [X.X.X.X] | [optional] [default to &#39;&#39;]
**order** | **Number** | The order of the environment as registered in Lifetime. | [optional] 
**hostName** | **String** | Hostname of the environment as registered. | [optional] [default to &#39;&#39;]
**useHTTPS** | **Boolean** | Indicates if connections to the environment are made using HTTPS. | [optional] 
**environmentType** | **String** | Indicates the type of the environment. [Development | Test | Production] | [optional] [default to &#39;&#39;]
**numberOfFrontEnds** | **Number** | Number of front-end servers in the environment. | [optional] 
**applicationServerType** | **String** | Stack of the application server. [.NET | JAVA] | [optional] [default to &#39;&#39;]
**applicationServer** | **String** | Application server in use. [IIS | JBoss | WebLogic] | [optional] [default to &#39;&#39;]
**databaseProvider** | **String** | Type of database provider. [SqlServer | Oracle] | [optional] [default to &#39;&#39;]
**isCloudEnvironment** | **Boolean** | Indicates if the environment is running on a cloud service. | [optional] 


