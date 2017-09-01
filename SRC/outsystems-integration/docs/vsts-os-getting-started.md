
Please visit our blog post announcing the features of the extension: <https://www.outsystems.com/blog/enterprise-grade-devOps-with-outsystems.html>

## OutSystems VSTS Extension ##

The OutSystems VSTS Extension is an OutSystems Integration that allows any enterprise to create and maintain their DevOps cycle.
This extension focuses on:
- An OutSystems Release Task, allowing tagging and/or deploying OutSystems Apps;
- Getting the best from VSTS/TFS and OutSystems LifeTime, for release management purposes:
  - Automatic versioning of apps;
  - Complete trackability for every release;
  - Release definition cloning for multiple environments;
  - Schedule automatic releases and/or request on demand;
  - An approval system for release executions.

## Advantages and added value

 - Ability to have a single DevOps infrastructure in an heteogenous development stack. To coordinate releases for both non-Outsystems applications and Outsystems applications. 
 - Coordinate releases that include non-Outsystems stack and Outsystems applications. For example, have Continuous Delivery for Outsystems front-end applications and internal enterprises backends, developed is heterogeneuous technologies (Classic ASP websites, WCF services, Java REST APIs, Python websites or NodeJS REST APIs)
 - Inherit Team Services/Team Foundation Server features and integration capabilities with you Outsystems platform (on public clouds, private clouds ou on-premises). 
 - Strong traceability between Team Services/Team Foundation Server and Outsystems platform.
 
### Requirements

- From TFS 2015 Update 2
- From OutSystems Platform 10.0.408.0

## Outsystems Platform

The [OutSystems Platform](https://www.outsystems.com) is a high-productivity platform as a service (PaaS) intended for developing and delivering enterprise web and mobile applications, which run in the cloud, on-premises or in hybrid environments. 

OutSystems Platform has grown out of experience with providing on-premises and private cloud solutions and targets professional developers. Its ease of use is consistent, even with increasing scale and complexity, but (although accessible to a business analyst) it generally requires the participation of a skilled OutSystems programmer. In addition to its basic high-productivity capabilities (allowing development of business apps at the visual modelling and business logic level), positive aspects include its provision of a rich developer experience, without limits, and with support for change management and re-factoring; its capabilities for delivering a good end-user experience; and the fact that it leaves control in the hands of the organisation employing it (its support for on premises and hybrid cloud, as well as public cloud, deployments is an example).

### Outsystems Release Task

The 'Outsystems Release Task' is the release task that allows anyone to determine a release process to be run inside the Outsystems platform - through **Outystems Lifetime**.

This task will allow you to tag and deploy Outsystems applications between any provisioned Outsystems environment. It allows specific versions to be deployed and/or follow the automatic versioning from Outsystems platform.

Provides complete deployment plan execution details, gathered directly from Outsystems platform. 

### Quick steps to get started ###

![](/images/doc-vsts-install.png)

To make the OutSystems Release Task available, you must:
- Install the **'Outsystems Integration'** in your Team Services subscription or your Team Foundation Server deployment.
- Configure a service end-point in VSTS/TFS for accessing the OutSystems platform;
- Use the 'OutSystems Release Task' in your Team Services/Team Foundation Server release definitions.

![](/images/doc-vsts-ostask.png)

Please refer to the following documentation:
- [Outsystems Release Task](vsts-os-release-task.md)
- [Outsystems Service endpoint in Team Services/Team Foundation Server](vsts-os-service-endpoint.md)
- [OutSystems Lifetime API to understand deployment in OutSystems](https://success.outsystems.com/Documentation/10/Reference/OutSystems_APIs/LifeTime_Deployment_API)

# Further info

The source to this extension is available [here](https://github.com/OutSystems/vsts). For contribution purporses check the [Wiki](https://github.com/OutSystems/vsts/wiki) : report issues, feedback, request features, coding guidelines guidance.

More information will appear here, for the meantime visit our [announcement](https://www.outsystems.com/blog/enterprise-grade-devOps-with-outsystems.html).
