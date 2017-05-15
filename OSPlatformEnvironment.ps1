Get-Module -ListAvailable -Name AzureRm.Resources | Select Version
#Login-AzureRmAccount
#Get-AzureRmSubscription
#Set-AzureRmContext -SubscriptionName "JDADX Internal"


function Stop-AzureVMs
{
    
	param(

  	[string]$ResourceGroupName,

  	[string]$Action

 	)
	
	#The name of the Automation Credential Asset this runbook will use to authenticate to Azure.
    #$CredentialAssetName = 'DefaultAzureCredential'

    #Get the credential with the above name from the Automation Asset store
    #$Cred = Get-AutomationPSCredential -Name $CredentialAssetName
    #if(!$Cred) {
    #    Throw "Could not find an Automation Credential Asset named '${CredentialAssetName}'. Make sure you have created one in this Automation Account."
    #}

    #Connect to your Azure Account
    #$Account = Add-AzureAccount -Credential $Cred
    #if(!$Account) {
    #    Throw "Could not authenticate to Azure using the credential asset '${CredentialAssetName}'. Make sure the user name and password are correct."
    #}
    Set-AzureSubscription -SubscriptionName "JDADX Internal"
	
    #TODO (optional): pick the right subscription to use. Without this line, the default subscription for your Azure Account will be used.
    #Select-AzureSubscription -SubscriptionName "TODO: your Azure subscription name here"
	
		Select-AzureSubscription -SubscriptionName 'JDADX Internal'

        $VMs = Get-AzureRmVM -ResourceGroupName "$ResourceGroupName"
		
    #Get all the VMs you have in your Azure subscription
    # $VMs = Get-AzureVM # | select Name, ResourceGroupName, Status, State

    #Print out up to 10 of those VMs
     if(!$VMs) {
        Write-Output "No VMs were found in your subscription."

     } else {

		Foreach ($VM in $VMs) {
        if($Action -eq "start")
        {
		    Start-AzureRmVM -ResourceGroupName "$ResourceGroupName" -Name $VM.Name -Force -ErrorAction SilentlyContinue
            Write-Output "VM $VM started."
		}
        else
        {
		    Stop-AzureRmVM -ResourceGroupName "$ResourceGroupName" -Name $VM.Name -Force -ErrorAction SilentlyContinue
            Write-Output "VM $VM stopped."
        }
     }
}

Stop-AzureVMs -ResourceGroupName 'OutSystems' -Action 'stop'