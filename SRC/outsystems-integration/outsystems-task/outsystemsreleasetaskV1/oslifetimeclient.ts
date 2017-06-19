import ltclt = require('./oslifetime.sdk');

console.log("Starting");

let x =  new ltclt.OAuth()
x.accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJsaWZldGltZSIsInN1YiI6IllUWTFPVGs1T0RFdE5XWmtOUzAwWW1aa0xXSmhPR1F0TnpNd01EQmxaRFF5TXpsaCIsImF1ZCI6ImxpZmV0aW1lIiwiaWF0IjoiMTQ5NzIyMzc5OSIsImppdCI6InlNZkhaZnVMOHkifQ==.dmMX09hcZh3Hqa3oHFpFoZ9AZU2VjK35XArCgCCPaZ0=";
let lifetime = new ltclt.V1Api("https://os10lt.northeurope.cloudapp.azure.com/lifetimeapi/rest/v1");


lifetime.applicationsList()
    .then((res) => {
        // let appsList = new Array<ltclt.Application>();
        // appsList = Array<ltclt.Application>res.body;

        let newApp : ltclt.Application = new ltclt.Application();
        //let appsList: Array<ltclt.Application> = new Array<ltclt.Application>();
        let appsList: ltclt.Application[];
        //appsList.push(newApp);
        appsList = [newApp];

        console.log(newApp.constructor.name); // Application

        let apparray : Array<ltclt.Application> = res.body; 
        newApp = apparray[0];
        console.log(newApp.constructor.name); // Object?
        appsList.push(apparray[0]);
        //appsList = <Array<ltclt.Application>>res.body;
        
        
        console.log(appsList);
    })
    .catch((err) => {
        if (err.body) {
            console.error(`[ERROR] [${err.body.StatusCode}] ${err.body.Errors}`);
        }
        else {
            console.error(`[ERROR] ${err.message}`);
        }
    })
    .finally(() => {
        console.log('Done! ');
    });

lifetime.environmentsList()
    .then((res) => {
        // let envList = new Array<ltclt.Environment>();
        // envList = Array<ltclt.Environment>res.body;

        let envList = <ltclt.Environment[]>res.body;
        console.log(envList);
    })
    .catch((err) => {
        if (err.body) {
            console.error(`[ERROR] [${err.body.StatusCode}] ${err.body.Errors}`);
        }
        else {
            console.error(`[ERROR] ${err.message}`);
        }
    })
    .finally(() => {
        console.log('Done! ');
    });

// let y = new ltclt.NotesSourceEnvironmentKeyTargetEnvironmentKeyApplicationVersionKeysRecord();
// y.applicationVersionKeys = ['01c0893d-8b74-45ff-8ebe-5aa6c4387d88'];
// y.notes = 'My 1st Deploy';
// y.sourceEnvironmentKey = "6edd0422-74c7-4fe9-bd2a-b3eb1ae30cba";
// y.targetEnvironmentKey = "6eac907e-f9ad-48c6-994d-7acda431aa3c";

// lifetime.deploymentsCreate(y)
//     .then((res) => {

//         let deployKey: string = res.body;
//          console.log(deployKey);

//     })
//     .catch((err) => {
//         if (err.body) {
//             console.error(`[ERROR] [${err.body.StatusCode}] ${err.body.Errors}`);
//         }
//         else {
//             console.error(`[ERROR] ${err.message}`);
//         }
//     })
//     .finally(() => {
//         console.log('Done! ');
//     });


var depKey = "450d6f3e-f0fa-4e5b-9c67-b89d6b52b81f";
//var depCommand = "start" // "Continue", "abort"
// lifetime.deploymentsExecuteCommand(depKey,depCommand)
//  .then((res) => {

//         let deployCommandMessage: string = res.body.Errors[0];
//         let deployStatusCode = res.body.StatusCode;

//     })
//     .catch((err) => {
//         if (err.body) {
//             console.error(`[ERROR] [${err.body.StatusCode}] ${err.body.Errors}`);
//         }
//         else {
//             console.error(`[ERROR] ${err.message}`);
//         }
//     })
//     .finally(() => {
//         console.log('Done! ');
//     });

lifetime.deploymentsGetStatus(depKey)
 .then((res) => {

        let deploylog: Array<any> = res.body.DeploymentLog;
        let deployStatus : string = res.body.DeploymentStatus;

        let fullLog : string = deploylog.map( (_log) => {
            return _log.Message;
        }).join("\r\n");
    
    })
    .catch((err) => {
        if (err.body) {
            console.error(`[ERROR] [${err.body.StatusCode}] ${err.body.Errors}`);
        }
        else {
            console.error(`[ERROR] ${err.message}`);
        }
    })
    .finally(() => {
        console.log('Done! ');
    });