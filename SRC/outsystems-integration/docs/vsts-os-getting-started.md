
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

### Requirements

- From TFS 2015 Update 2
- From OutSystems Platform 10.0.408.0

## Outsystems Platform

You can use these tasks with your own [private Chef Server](http://downloads.chef.io), a [hosted Chef Server](https://www.chef.io) or a [Chef Automate server installed from the Azure Marketplace](https://blog.chef.io/2017/05/01/chef-automate-in-the-azure-marketplace/).  Note: If you use your own Chef Server you will most likely need to disable SSL Verification in the Chef Server endpoint.

### Outsystems Release Task

All Build phase tasks can run on hosted VSTS agents (such as the Hosted Linux Preview) or your own private Agent.

To get started with the Chef Release tasks, the simplest way is to use the Hosted Linux Preview agent, otherwise you'll need to install both the [VSTS Agent](https://www.visualstudio.com/en-us/docs/build/actions/agents/v2-linux) and the [Chef Development Kit](https://downloads.chef.io/chefdk) on a private agent.

### Quick steps to get started ###

![](/static/images/Screen1.png)

To make the OutSystems Relese Task available, you must:
- Configure a service end-point in VSTS/TFS for accessing the OutSystems platform;
- Use the OutSystems Release Task in your release configuration.

Please refer to the following documentation:
- [Outsystems Release Task](vsts-os-release-task.md)
- [Outsystems Service endpoint in Team Services/Team Foundation Server](vsts-os-service-endpoint.md)
- [OutSystems Lifetime API to understand deployment in OutSystems](https://success.outsystems.com/Documentation/10/Reference/OutSystems_APIs/LifeTime_Deployment_API)

# Further info

The source to this extension is available [here](https://github.com/Microsoft/vsts-tasks/tree/master/Tasks). For contribution purporses check the [Wiki](/wiki) : report issues, feedback, request features, coding guidelines guidance.

More information will appear here, for the meantime visit our [announcement](https://www.outsystems.com/blog/enterprise-grade-devOps-with-outsystems.html).
