import { type AllConfigType } from '@/config/config.type';
import { type INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

function setupSwagger(app: INestApplication) {
  const configService = app.get(ConfigService<AllConfigType>);
  const appName = configService.getOrThrow('app.name', { infer: true });

  const config = new DocumentBuilder()
    .setTitle(appName)
    .setDescription('olakz Partners API')
    .setVersion('1.0')
    .setContact('olakz', 'https://olakz.com', 'engineering@olakz.com')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'Api-Key', in: 'header' }, 'Api-Key')
    .addServer(configService.getOrThrow('app.url', { infer: true }), 'Development')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document, {
    customSiteTitle: appName,
  });
}

export default setupSwagger;
