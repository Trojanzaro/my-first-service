"use strict";
const { tagEvent } = require("./serverless_sdk");

var AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-central-1' });

module.exports.getUser = async event => {
  tagEvent("custom-tag", "hello world", { custom: { tag: "data" } });

  console.log(event);

  var responseStatus = 200;
  var responseHeaders = {
    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
    "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
  };
  var responseBody = {};

  var params = {
    TableName: 'my-first-service-dev',
    Key: {
      id: event.pathParameters['userId']
    },
    Item: {
        id: event.pathParameters['userId']
    },
};

  await docClient.get(params, (err, data) => {
    if (err) {
      responseStatus = err.statusCode;
      responseBody =  {
        errorCode: err.statusCode,
        errorType: err.errorType,
        errorMessage: err.errorMessage
      };
    } else if (data.Item === undefined) {
      responseStatus = 404;
      responseBody =  {
        errorCode: 404,
        errorType: 'Not found',
        errorMessage: 'Error! Entry: ' + event.pathParameters['userId'] + ' Not found'
      };
    } else {
      responseBody = data.Item;
    }
  }).promise();

  return {
    statusCode: responseStatus,
    headers: responseHeaders,
    body: JSON.stringify(responseBody, null, 2)
  };

  // event = {
  //   "resource": "/hello",
  //   "path": "/hello",
  //   "httpMethod": "GET",
  //   "headers": {
  //     "Accept": "*/*",
  //     "Accept-Encoding": "gzip, deflate, br",
  //     "Cache-Control": "no-cache",
  //     "CloudFront-Forwarded-Proto": "https",
  //     "CloudFront-Is-Desktop-Viewer": "true",
  //     "CloudFront-Is-Mobile-Viewer": "false",
  //     "CloudFront-Is-SmartTV-Viewer": "false",
  //     "CloudFront-Is-Tablet-Viewer": "false",
  //     "CloudFront-Viewer-Country": "GR",
  //     "Host": "vudo262w03.execute-api.eu-central-1.amazonaws.com",
  //     "Postman-Token": "9ef0dbc6-0c0f-4ae2-b92f-4fb7f4cff5a6",
  //     "User-Agent": "PostmanRuntime/7.24.0",
  //     "Via": "1.1 5d5650d27c767174762251d7b9000c4a.cloudfront.net (CloudFront)",
  //     "X-Amz-Cf-Id": "eGmIVrz6njcvv3dUTC5LRWU3JRcVHeJVm9zJVhC_LwI4AuyQnQo-mA==",
  //     "X-Amzn-Trace-Id": "Root=1-5e8de015-05bf10b8020dcfc853fe5b1e",
  //     "X-Forwarded-For": "188.117.225.179, 130.176.39.145",
  //     "X-Forwarded-Port": "443",
  //     "X-Forwarded-Proto": "https"
  //   },
  //   "multiValueHeaders": {
  //     "Accept": [
  //       "*/*"
  //     ],
  //     "Accept-Encoding": [
  //       "gzip, deflate, br"
  //     ],
  //     "Cache-Control": [
  //       "no-cache"
  //     ],
  //     "CloudFront-Forwarded-Proto": [
  //       "https"
  //     ],
  //     "CloudFront-Is-Desktop-Viewer": [
  //       "true"
  //     ],
  //     "CloudFront-Is-Mobile-Viewer": [
  //       "false"
  //     ],
  //     "CloudFront-Is-SmartTV-Viewer": [
  //       "false"
  //     ],
  //     "CloudFront-Is-Tablet-Viewer": [
  //       "false"
  //     ],
  //     "CloudFront-Viewer-Country": [
  //       "GR"
  //     ],
  //     "Host": [
  //       "vudo262w03.execute-api.eu-central-1.amazonaws.com"
  //     ],
  //     "Postman-Token": [
  //       "9ef0dbc6-0c0f-4ae2-b92f-4fb7f4cff5a6"
  //     ],
  //     "User-Agent": [
  //       "PostmanRuntime/7.24.0"
  //     ],
  //     "Via": [
  //       "1.1 5d5650d27c767174762251d7b9000c4a.cloudfront.net (CloudFront)"
  //     ],
  //     "X-Amz-Cf-Id": [
  //       "eGmIVrz6njcvv3dUTC5LRWU3JRcVHeJVm9zJVhC_LwI4AuyQnQo-mA=="
  //     ],
  //     "X-Amzn-Trace-Id": [
  //       "Root=1-5e8de015-05bf10b8020dcfc853fe5b1e"
  //     ],
  //     "X-Forwarded-For": [
  //       "188.117.225.179, 130.176.39.145"
  //     ],
  //     "X-Forwarded-Port": [
  //       "443"
  //     ],
  //     "X-Forwarded-Proto": [
  //       "https"
  //     ]
  //   },
  //   "queryStringParameters": {
  //     "id": "123456789"
  //   },
  //   "multiValueQueryStringParameters": {
  //     "id": [
  //       "123456789"
  //     ]
  //   },
  //   "pathParameters": null,
  //   "stageVariables": null,
  //   "requestContext": {
  //     "resourceId": "kizguo",
  //     "resourcePath": "/hello",
  //     "httpMethod": "GET",
  //     "extendedRequestId": "Kq_zVHzWliAFowQ=",
  //     "requestTime": "08/Apr/2020:14:30:45 +0000",
  //     "path": "/dev/hello",
  //     "accountId": "783206811116",
  //     "protocol": "HTTP/1.1",
  //     "stage": "dev",
  //     "domainPrefix": "vudo262w03",
  //     "requestTimeEpoch": 1586356245248,
  //     "requestId": "7f3e9408-713a-4b56-a582-cb65f63848a0",
  //     "identity": {
  //       "cognitoIdentityPoolId": null,
  //       "accountId": null,
  //       "cognitoIdentityId": null,
  //       "caller": null,
  //       "sourceIp": "188.117.225.179",
  //       "principalOrgId": null,
  //       "accessKey": null,
  //       "cognitoAuthenticationType": null,
  //       "cognitoAuthenticationProvider": null,
  //       "userArn": null,
  //       "userAgent": "PostmanRuntime/7.24.0",
  //       "user": null
  //     },
  //     "domainName": "vudo262w03.execute-api.eu-central-1.amazonaws.com",
  //     "apiId": "vudo262w03"
  //   },
  //   "body": null,
  //   "isBase64Encoded": false
  // }
};
