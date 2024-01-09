import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: ['fatal', 'error', 'warn', 'debug'],
  });
  const config = new DocumentBuilder()
    .setTitle('Social Network')
    .setDescription(
      'Social networks have transformed the way we communicate, advertise and lead our lives during the past 2 decades. Many of us have one or multiple profiles on one or several networks, and we use them on a daily basis to communicate and share information.',
    )
    .setVersion('1.0')
    .addTag('social')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.use(helmet());
  await app.listen(3000);
  console.log('Server started at port 3000...');
}

bootstrap();
