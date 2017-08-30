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

### Quick steps to get started ###

![](/static/images/Screen1.png)

To make the OutSystems Relese Task available, you must:
- Configure a service end-point in VSTS/TFS for accessing the OutSystems platform;
- Use the OutSystems Release Task in your release configuration.

Please refer to the following information:
- [Walkthrough to setup the VSTS extension](https://github.com/Microsoft/vsts-tasks/tree/master/Tasks)
- [OutSystems Lifetime API to understand deployment in OutSystems](https://success.outsystems.com/Documentation/10/Reference/OutSystems_APIs/LifeTime_Deployment_API)

### Requirements

- From TFS 2015 Update 2
- From OutSystems Platform 10.0.408.0

### Learn more ###

The source to this extension is available [here](https://github.com/Microsoft/vsts-tasks/tree/master/Tasks). Feel free to take, fork or extend.