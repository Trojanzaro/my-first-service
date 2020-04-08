"use strict";
const { tagEvent } = require("./serverless_sdk");

var AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-central-1' });

module.exports.hello = async event => {
  tagEvent("custom-tag", "hello world", { custom: { tag: "data" } });

  var responseStatus = 200;
  var responseHeaders = {
    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
    "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
  };
  var responseBody = {
    message: "Succesful Deploy",
    data: null,
    input: event
  };

  var params = {
    TableName: 'my-first-service-dev',
    Key: {
      id: "S"
    },
    Item: {
        "id": '123456789'
    },
};

  await docClient.get(params, (err, data) => {
    if (err) throw err;
    if (data.Item === undefined) {
      responseStatus = 404;
      responseBody.data = 'Error! Entry Not found';
    } else {
      responseBody.data = data.Item;
    }
  }).promise();

  return {
    statusCode: responseStatus,
    headers: responseHeaders,
    body: JSON.stringify(responseBody, null, 2)
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
