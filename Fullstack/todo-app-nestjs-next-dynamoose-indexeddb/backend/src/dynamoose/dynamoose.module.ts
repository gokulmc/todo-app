import { Module, OnModuleInit } from '@nestjs/common';
import * as dynamoose from 'dynamoose';
import { DynamoDB } from '@aws-sdk/client-dynamodb';

@Module({})
export class DynamooseModule implements OnModuleInit {
  onModuleInit() {
    const ddb = new DynamoDB({
      region: process.env.AWS_REGION ?? 'us-east-1',
      endpoint: process.env.DYNAMODB_ENDPOINT ?? 'http://localhost:8000',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? 'local',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? 'local',
      },
    });
    dynamoose.aws.ddb.set(ddb);
  }
}
