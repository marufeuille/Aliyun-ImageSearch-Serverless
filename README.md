# Aliyun-ImageSearch-Serverless
## About
This is a demo Application for ImageSearch in Aliyun.
This app is so called **Serverless**.
Using FunctionCompute, OSS and ImageSearch.
**No ECS** is used!!

## Pre-Requirements
- Prepare ImageSearch Instance
- Prepare fcli command
- Prepare ossutil command

## Installation
### Deploy Proxy
Proxy do get User Request from frontend and Pass to ImageSearch Instance.

#### Create Config
Create Config file into Proxy/code/config/default.js
sample is available at Proxt/code/config/sample.js

#### Deploy
use fcli command, like bellow.

```
fcli service create --service-name YOUR_SERVICE_NAME
fcli function create --service-name YOUR_SERVICE_NAME --function-name YOUR_FUNCTION_NAME --runtime nodejs8 --handler index.handler --code-dir ./Proxy/code
fcli trigger create --service-name YOUR_SERVICE_NAME --function-name YOUR_FUNCTION_NAME --trigger-name YOUR_TRIGGER_NAME --type timer --config ./Proxy/trigger/http.yml
```

### Deploy Frontend
Frontend is made by React(Material UI)
You want to use this, you need to do is compiling and put to oss.

#### Create Config
You need to create Frontend/src/config.js
Sample is available at Frontend/src/config.sample.js

#### Build
type command bellow

```
yarn build
```

#### deploy
type command bellow

```
ossutil cp -r build/* oss://YOUR_OSS_BUCKET_NAME
```

that's all!!
