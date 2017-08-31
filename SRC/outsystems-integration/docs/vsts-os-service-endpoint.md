
## VSTS/TFS Service Endpoint
You will typically need to connect to external and remote services to execute tasks for a build or deployment. With Outsystems platform, you will connect your Team Services or on-prem Team Foundation Server through service endpoints.
You can define endpoints in Team Services or Team Foundation Server that are available for use in all your tasks.

An endpoint called ***'Outsystems Platform'*** is bundled with this extension. This allows multiple Outsystems deployments to be configured and reused across Releases and/or tasks as required. Endpoints are a per-project configuration and can be accessed in via Project Settings > Services.

## **Outsystems Platform** service endpoint

Defines and secures a connection to a provisioned Outsystems platform using a pre-configured service account through strict SSL connection.

Before creating the service endpoint, the Outsystems Platform must be configured, to allow remote usage of the REST Deployment API. This can be done creating a service account:

### Creating a service account

To create a service account in LifeTime, do the following:
1. In the LifeTime management console of your infrastructure, open the **User Management** tab and select the **Service Accounts** sub-menu.

 ![](/images/os-CreateServiceAccount.png)

2. Select **New Service Account**. Fill in the service account username and description, select the desired role, and click the **Create** button.

 After creating the service account, you will be provided with the authentication token that you will have to include in each REST API method call to authenticate the request.

>
> **As a security measure, the authentication token will be shown only once.** If you lose the token, you will have to generate a new one, and the previous token will no longer be valid. 
>

### Configuring the Service endpoint

In Team Services our Team Foundation Server, Service endpoints can be created through the following UI:

 ![](/images/vsts-ServiceEndpointsManagement.png)

1. Press the **New Service Endpoint** button and find the 'Outsystems Platform'. 

 ![](/images/doc-vsts-ostask-createServiceEndpoint-01-start.png)

2. The 'Add new Outsystems Platform Connection' dialog will appear. Here we provide information about our OutSystems platform:

 ![](/images/doc-vsts-ostask-createServiceEndpoint-02-Dialog.png)

| Field | Description |
| -- | -- |
| **Name** | A name for service endpoint (ex: myOutsystems). |
| **URL** | Your Outsystems LifeTime Deployment API endpoint |
| **StrictSSL** | Restricts communication between Visual Studio Team Services and your Outsystems platform to always use encrupted channels (SSL). Recommended. |
| **ApiToken** | Your Outsystems service account authentication token. | 

3. Once filled the the information, you can verify connectivity to you Outsystems Platform. This will try a REST call to the configured URL, and verify answer.

 ![](/images/doc-vsts-ostask-createServiceEndpoint-03-DialogConfirmed.png)

Finally, once confirmed the endpoint creation, you'll return to the Team Services Service Endpoint management page. Any future change to the service endpoint should be done here:
 ![](/images/doc-vsts-ostask-createServiceEndpoint-04-End.png)

Here is a simple demo, on how to create the 'Outsystems Platform' service endpoint:

 ![](/images/demo.ServiceEndpoint.gif)

For more detailed information, we recommend to oficial Outsystems and Microsoft documentation:

 - [OutSystems REST Deployment API](https://success.outsystems.com/Documentation/10/Reference/OutSystems_APIs/LifeTime_Deployment_API)
 - [Outsystems REST API Authentication documentation](https://success.outsystems.com/Documentation/10/Reference/OutSystems_APIs/REST_API_Authentication)
 - [Service endpoints – Overview](https://blogs.msdn.microsoft.com/sriramb/2016/09/14/service-endpoints-overview/)


