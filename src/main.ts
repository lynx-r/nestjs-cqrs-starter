import 'reflect-metadata';

import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json } from 'express';
import { AppModule } from './app.module.js';
import { EnvConfigService } from './infrastructure/config/env-config.service.js';
import { NodeEnv } from './infrastructure/config/env.types.js';
import { CoreExceptionFilter } from './presentation/http/common/filters/core-exception.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    //  {
    // instrument: ObserveInstrument,
    // }
  );
  const configService = app.get(EnvConfigService);

  setupLogger(app, configService);
  setupGlobalConfig(app, configService);
  setupSwagger(app, configService);
  setupCors(app, configService);

  /**
   * Trust the first proxy hop.
   *
   * @remarks
   * Useful when running behind a reverse proxy (e.g., Nginx) so that
   * `req.ip` and related fields can be resolved correctly.
   */
  // app.set('trust proxy', 1);

  await app.listen(configService.serverPort, configService.serverAddress);
}

/**
 * Applies global validation pipeline and exception filter.
 *
 * @param app - NestJS application instance.
 * @param configService - Configuration provider.
 *
 * @remarks
 * - `transform: true` converts input payloads to DTO instances/types.
 * - `whitelist: true` removes unknown properties not present on the DTO.
 * - `forbidNonWhitelisted: true` rejects unknown properties with a 400.
 */
function setupGlobalConfig(
  app: INestApplication,
  configService: EnvConfigService,
) {
  app.use(json({ limit: configService.jsonLimit }));

  // app.use((req: any, res: any, next: any) => {
  //   if (req.method === 'POST') {
  //     // Если это GraphQL, пишем переменные, если REST — весь body
  //     const bodyToLog = req.body?.variables ? req.body.variables : req.body;
  //     console.log(
  //       '--- Входящие данные POST ---',
  //       JSON.stringify(bodyToLog, null, 2),
  //     );
  //   }
  //   next();
  // });

  app.useGlobalFilters(new CoreExceptionFilter(configService));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Удаляет поля, которых нет в DTO
      forbidNonWhitelisted: true, // Выдает ошибку, если есть лишние поля
      transform: true, // Автоматически преобразует типы (например, строку в число)
      stopAtFirstError: true,
      enableDebugMessages: true,
    }),
  );

  app.setGlobalPrefix('api', { exclude: ['health/*path'] });

  // 2. Включаем версионность через URI
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
    }),
  );
}

/**
 * Configures NestJS logger levels based on the runtime environment.
 *
 * @param app - NestJS application instance.
 * @param configService - Configuration provider.
 *
 * @remarks
 * - Development: enables detailed logs.
 * - Other environments: restricts output to warnings/errors.
 */
function setupLogger(app: INestApplication, configService: EnvConfigService) {
  app.useLogger(
    configService.nodeEnv === NodeEnv.Development
      ? ['log', 'debug', 'error', 'verbose', 'warn']
      : ['error', 'warn'],
  );
}

/**
 * Configures Swagger (OpenAPI) for the application.
 *
 * @param app - NestJS application instance.
 * @param configService - Configuration provider.
 *
 * @remarks
 * Exposes:
 * - Swagger UI at `configService.swaggerPath`
 * - Raw OpenAPI JSON at `/{configService.swaggerDocsPath}`
 *
 * @returns The generated OpenAPI document.
 */
function setupSwagger(app: INestApplication, configService: EnvConfigService) {
  if (configService.isProduction) {
    return undefined;
  }

  const config = new DocumentBuilder()
    .setTitle('NestJS Core Clean')
    .setDescription('Clean Architecture NestJS starter with REST and GraphQL')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(configService.swaggerPath, app, document, {
    swaggerOptions: {
      // Включает режим "Try it out" автоматически для всех методов
      tryItOutEnabled: true,
    },
  });

  // app.use(
  //   `/${configService.swaggerDocsPath}`,
  //   (_req: Request, res: ServerResponse) => {
  //     res.setHeader('Content-Type', 'application/json');
  //     res.end(JSON.stringify(document));
  //   },
  // );

  return document;
}

/**
 * Enables Cross-Origin Resource Sharing (CORS).
 *
 * @param app - NestJS application instance.
 * @param configService - Configuration provider.
 */
function setupCors(app: INestApplication, configService: EnvConfigService) {
  const origin = configService.corsOrigin;

  if (origin.length === 1 && origin[0] === '*') {
    app.enableCors();
    return;
  }

  const credentials = configService.corsCredentials;
  app.enableCors({ origin, credentials });
}

await bootstrap();
