import 'source-map-support/register'

import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getAllTodos } from '../../businessLogic/todos';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  // console.log('🌸', event);
  const items = await getAllTodos(event);
  const response = {
    statusCode: 200,
    headers: {
        "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ items })
  };

  return response;
}
