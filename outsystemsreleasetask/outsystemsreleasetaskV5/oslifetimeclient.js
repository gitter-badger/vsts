"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ltclt = require("./oslifetime.sdk");
console.log("Starting");
let x = new ltclt.OAuth();
x.accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJsaWZldGltZSIsInN1YiI6IllUWTFPVGs1T0RFdE5XWmtOUzAwWW1aa0xXSmhPR1F0TnpNd01EQmxaRFF5TXpsaCIsImF1ZCI6ImxpZmV0aW1lIiwiaWF0IjoiMTQ5NzIyMzc5OSIsImppdCI6InlNZkhaZnVMOHkifQ==.dmMX09hcZh3Hqa3oHFpFoZ9AZU2VjK35XArCgCCPaZ0=";
let lifetime = new ltclt.V1Api("https://os10lt.northeurope.cloudapp.azure.com/lifetimeapi/rest/v1");
lifetime.applicationsList()
    .then((res) => {
    // let appsList = new Array<ltclt.Application>();
    // appsList = Array<ltclt.Application>res.body;
    let appsList = res.body;
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
    let envList = res.body;
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
