import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import * as config from 'config';

const swaggerSetup = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('Task Management App')
    .setDescription('Task Management API Description')
    .setVersion('1.0')
    .addTag('task')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
}

const bootstrap = async () => {
  const serverConfig = config.get('server');
  const logger = new Logger('bootstrap');
  const app: INestApplication = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  } else {
    app.enableCors({ origin: serverConfig.origin });
    logger.log(`Accepting requests from origin ${serverConfig.origin}.`)
  }

  swaggerSetup(app);

  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}

bootstrap();
