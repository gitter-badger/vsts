Add the VSTS/TFS variables for this environment to the Chef environment

## Settings

| Setting | Required | Default Value | Description |
| --- | --- | --- | --- | 
| Display name | yes | Add variables to Chef environment (Chef) | Set the display name for this task | 
| Chef Server endpoint | yes | | Select a valid Chef Server endpoint to use for this task |
| Chef environment | no | | Enter the name of the Chef environment in your organization to apply the variables to |
| Chef environment namespace | no | `vsts_environment_variables` | Enter the name of the namespace to apply the variables to within your Chef environment |

## Information

This task runs in an Agent phase within the Release process, and takes all the variables configured for this environment and makes them available to the specified Chef environment.

Example:

Using the default settings for the task, a variable called `connection_string` created in a VSTS environment, will be available within a Chef recipe as ```node['vsts_environment_variables']['connection_string']```