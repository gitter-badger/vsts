:: Javascript
:: java -jar ./swagger-codegen-cli.jar generate -i https://os10lt.northeurope.cloudapp.azure.com/lifetimeapi/rest/v1/swagger.json -c codegen.config.json -Dio.swagger.parser.util.RemoteUrl.trustAll=true -l javascript -o js
java -jar ./swagger-codegen-cli.jar generate -i swagger.json -c codegen.config.json -l javascript -o ../js

:: typescript-node
:: java -jar ./swagger-codegen-cli.jar generate -i https://os10lt.northeurope.cloudapp.azure.com/lifetimeapi/rest/v1/swagger.json -c codegen.config.json -Dio.swagger.parser.util.RemoteUrl.trustAll=true -l typescript-node -o ../typescript
java -jar ./swagger-codegen-cli.jar generate -i swagger.json -c codegen.config.json -l typescript-node -o ../typescript

::Documentation
java -jar ./swagger-codegen-cli.jar generate -i swagger.json -c codegen.config.json -l dynamic-html -o ../dhtml
java -jar ./swagger-codegen-cli.jar generate -i swagger.json -c codegen.config.json -l html -o ../html

:: Help
java -jar ./swagger-codegen-cli.jar config-help -l javascript


:: -Djsse.enableSNIExtension=false
:: -Dio.swagger.parser.util.RemoteUrl.trustAll=true

::java -jar ./swagger-codegen-cli.jar generate -a Authorization:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJsaWZldGltZSIsInN1YiI6IllUWTFPVGs1T0RFdE5XWmtOUzAwWW1aa0xXSmhPR1F0TnpNd01EQmxaRFF5TXpsaCIsImF1ZCI6ImxpZmV0aW1lIiwiaWF0IjoiMTQ5NzIyMzc5OSIsImppdCI6InlNZkhaZnVMOHkifQ==.dmMX09hcZh3Hqa3oHFpFoZ9AZU2VjK35XArCgCCPaZ0= -i swagger.json -c codegen.config.json -l typescript-node -o ../typescriptJDA


:: dt.ts generator
:: npm install -g dts-generator
:: dts-generator --name api --project . --out oslifetime.sdk.d.ts