import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE
const todosBucket = process.env.IMAGES_S3_BUCKET
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { parseUserId } from '../../auth/utils'
// import { createLogger } from '../../utils/logger'
// const logger = createLogger('auth')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  console.log(newTodo);

  // TODO: Implement creating a new TODO item
  const itemId = uuid.v4() // generate random id for TODO item

  // store user ID in a DynamoDB table (store user when they create a new item by calling getUserId func)
  // 1. first get JWT token in event handler
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  // 2. store a user ID we need to extract it from a JWT toekn using parseUserId func
  const userId = parseUserId(jwtToken)

  // logger.info('User was authorized', {
  //   // Additional information stored with a log statement
  //   key: '🌸 value 🌸'
  // })

  // 3. store it to the DynamobDB table
  const newItem = {
    todoId: itemId,
    userId,
    done: false,
    attachmentUrl: `https://${todosBucket}.s3.amazonaws.com/${itemId}`,
    ...newTodo
  }

  await docClient.put({
    TableName: todosTable,
    Item: newItem
  }).promise()

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newItem
    })
  }
}
