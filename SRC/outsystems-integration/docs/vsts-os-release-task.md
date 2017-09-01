Add the VSTS/TFS variables for the Outsystems **Release Task environment**.

## Settings


| Setting | Required | Default Value | Description |
| --- | --- | --- | --- | 
| Display name | yes | 'Deploy Outsystems App:' | Set the display name for this task | 
| Outsystems Connection | yes | - | Select a valid Outsystems endpoint to use for this task. |
| Application(s) | yes | - | Select one or more Outsystems applications to deploy. |
| Tag and Deploy | yes | true | Should the task tag a version in the source environment, prior to deployment? |
| Change Log | yes | - | Change log of the version to be created and tagged. This field is only used and required if 'Tag and Deploy' is checked. |
| Automatic Versioning | yes | true | Follow Outsystems application automatic versioning. Version format is supported as [Major].[Minor] (.[Revision]). |
| Application Version | yes | - | Outsystems Application Version. Supported format is [Major].[Minor] (.[Revision]). Consider taking advantage of VSTS variables like $(Release.ReleaseName) that you can define in General tab. Example: 0.0.$(rev:rr) . |
| Deploy Notes | no | - | Outsystems Deployment Plan Notes. If no Deploy Notes are defined, a defult note will be generated in the format: 'DD-MM-yyyy-hh-mm'. |
| Source Environment | yes | - | Select the Outsystems source environment for this deployment. |
| Target Environment | yes | - | Select the Outsystems target environment for this deployment. |

### Information

This task runs in an Agent phase within the Release process. It's goal is to allow you to determine a release process to be run inside the Outsystems platform - through **Outystems Lifetime**.

The Application Lifecycle Management (ALM) is the continuous process of managing applications throughout their entire lifecycle: from development to maintenance. Outsystems LifeTime is the unified console with visibility of all environments in your infrastructure. It manages the deployment of applications, IT users, and security across all environments.

## Walkthrough

Let's use an example to understand how this task can be used/configured. Nevertheless, there are other scenarios to take advandage of this task, and you and your organization should easily find a strategy on how to configure it.

In this scenario the Outsystems Platform has three environments configured: **Development**, **Test** and **Production**.

With the Outsystems Service Studio, changes have been done to two particular applications – **X01 Darts** (web) and **X0M Darts** (Mobile).

 ![](/images/doc-os-lifetime.png)

In Team Services or Team Foundation Server, you can now create a new Release Definition Plan. Here, you can start by either using a template available that may suite one of your apps, or start with an **empty process**. Let's go with the empty process.

Name your first environment, and also the Release Definition. In this case we're **creating the 'Test' environment**, as this will be the first Outsystems environment we're interested in deploying to. Outsystems 'Development' environment is not created as the deployments are done transparentely from the Outsystems Service Studio.

![](/images/doc-vsts-ostask-createrelease-01-envTest.png)

Rename the release definition, appropriately:

![](/images/doc-vsts-ostask-createrelease-02-renameRelease.png)

Next, we’ll dive into the first environment and define tasks the engine will execute. 
Add a new task to this agent phase. Find the 'Outsystems Release Task' in the task list, and press the 'Add' button.

![](/images/doc-vsts-ostask-createrelease-03-AddTask.png)

Now it’s time to configure our release task. Here we’ll specify information about the release process we want Outsystems Lifetime to execute. Configure the task with a reference to your Outsystems platform. This is done by picking a pre-configured service endpoint in the field **'Outsystems Connection'**. If you haven't configured yet, you can press the 'New' button and follow the [Outsystems Service Endpoint documentation](vsts-os-service-endpoint.md).

![](/images/doc-vsts-ostask-createrelease-04-AddServiceEndpoint.png)

Next, we'll pick the Outsystems applications we want to release in this definition. In our example, we're picking **X01 Darts** and **X0M Darts**:

![](/images/doc-vsts-ostask-createrelease-05-SelectApps.png)

We'll select the the **'Tag and Deploy'** option, as we want to tag any new version. We'll use **'Automatic Versioning'** as this will follow Outsystems versioning format.

It's important to also specify the **'Change Log'** and **'Deploy Notes'**, as this information will be available in the Outsystems Platform, and usefull for traceability purposes. The 'Change Log' will be tied to the tagged version of the application and the 'Deploy notes' will describe the release done inside the Outsystems Lifetime.

![](/images/doc-vsts-ostask-createrelease-06-ChangelogNotes.png)

The **'Source'** and **'Target'** environments are Outsystems environments, defined in the platform. The task will release the application available in the 'source' environment to the 'target' environment. In this example we want to deploy the application available in the 'Development' environment to the 'Test' environment:

![](/images/doc-vsts-ostask-createrelease-07-Environments.png)

We're done for this specific environment in the release definition. Now, you can either add new Outsystems tasks to deploy additional Outsystems apps, or you can configure deployment of non-Outsystems apps with all the release tasks necessary to meet your goals. Remember: you can **clone tasks and environments** and this will make your life much easier.

Next, Our goal is to create the **‘Production’** environment that will deploy apps between the ‘Test’ Outsystems environment and the ‘Production’ Environment. Because it’s also possible to clone environments, we’ll do exactly that: Cloning our ‘Test’ environment and renaming it as ‘Production’ will do it. 

![](/images/doc-vsts-ostask-createrelease-08-AddProductionEnvironment.png)

Let's edit the 'Outsystems Release Task' in the (cloned) 'Production' enviroment. Change the source and target environments. Here we want to deploy the application available in the 'Test' environment to the 'Production' environment.

Finally, one important concept to consider. When releasing apps from Outsystems ‘Test’ and ‘Production’ environments **we’re not interested in tagging the applications**. The desired behavior is to release any new version from ‘Development’ and ‘Test’ environments tagging it. However, when releasing from ‘Test’ to ‘Production’ we want the exact same version to be released. The way to configure this, is *unchecking* the **‘Tag and Deploy’** option. This configuration will always release the latest version from the source to the target environments. 

![](/images/doc-vsts-ostask-createrelease-09-ProductionConfigTask.png)

Now you can create a release and run it. We can see complete details of the execution, even the deployment log from Outsystems Lifetime, is retrieved and presented. This way, you can have full logging in VSTS and check recent or past outcomes without the need to jump into Outsystems Lifetime.

![](/images/doc-vsts-ostask-createrelease-10-running.png)

Let’s go through what we’ve accomplished:
 - We’ve created a Release Definition to deploy two applications (X01 Darts and X0M Darts) through all the Outsystems Environments: ‘Development’ -> ‘Test’ -> ‘Production’;
 - We configured two VSTS environments ‘Test’ and ‘Production’. It doesn’t make sense to have a ‘Development’ environment in VSTS, as the deployment is automatic from Outsystems Service Studio.
 - In each VSTS environments, we used two Outsystems Release tasks, one for each application;
 - The only difference in configuration was the ‘Tag and Deploy’ option in the ‘Production’ VSTS environment, as we don’t need to tag applications.
 - We were able to use VSTS variables to provide information to Outsystems Platforms. We specified the ‘Change Log’ as the VSTS release description through the variable $(Release.ReleaseDescription).