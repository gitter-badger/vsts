Last updated: 31th Aug 2017 

Please visit our blog post announcing the features of the extension: <https://blog.chef.io/2017/05/10/integrate-chef-into-your-build-and-release-pipelines-with-microsoft-visual-studio-team-services/>

## Prerequisites

### Chef Server

You can use these tasks with your own [private Chef Server](http://downloads.chef.io), a [hosted Chef Server](https://www.chef.io) or a [Chef Automate server installed from the Azure Marketplace](https://blog.chef.io/2017/05/01/chef-automate-in-the-azure-marketplace/).  Note: If you use your own Chef Server you will most likely need to disable SSL Verification in the Chef Server endpoint.

### Build phase tasks

All Build phase tasks can run on hosted VSTS agents (such as the Hosted Linux Preview) or your own private Agent.

### Release phase tasks

Release phase tasks are designed for either a private VSTS agent, a hosted agent (such as the Hosted Linux Preview) or an agent running inside a Deployment Group (in preview).

To get started with the Chef Release tasks, the simplest way is to use the Hosted Linux Preview agent, otherwise you'll need to install both the [VSTS Agent](https://www.visualstudio.com/en-us/docs/build/actions/agents/v2-linux) and the [Chef Development Kit](https://downloads.chef.io/chefdk) on a private agent.

# Further info

More information will appear here, for the meantime visit our [announcement](https://blog.chef.io/2017/05/10/integrate-chef-into-your-build-and-release-pipelines-with-microsoft-visual-studio-team-services/)