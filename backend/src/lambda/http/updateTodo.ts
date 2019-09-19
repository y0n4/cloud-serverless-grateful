import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE
import * as AWS  from 'aws-sdk'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { parseUserId } from '../../auth/utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const userId = parseUserId(jwtToken);
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  console.log(todoId,  updatedTodo);
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object ✅
  // example for update item is here ⬇️️️
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html
  
  await docClient.update({
    TableName: todosTable,
    Key: { todoId, userId },
    UpdateExpression: 'set #name = :n, dueDate = :dd, done = :d ',
    ExpressionAttributeValues: {
        ':n': updatedTodo.name,
        ':dd': updatedTodo.dueDate,
        ':d': updatedTodo.done
    },
    ExpressionAttributeNames: {
        "#name": "name"
    }
  }).promise();

  return {
    statusCode: 200,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify('')
  };
}
