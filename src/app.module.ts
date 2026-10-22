import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { EnvConfigModule } from './infrastructure/config/env-config.module.js';
import { EnvConfigService } from './infrastructure/config/env-config.service.js';
import { NodeEnv } from './infrastructure/config/env.types.js';
import { PollsModule } from './polls/polls.module.js';
import { GraphqlPresentationModule } from './presentation/graphql/graphql.module.js';

// export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    PollsModule,
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    // ObserveModule.forRoot({
    //   appKey: 'YOUR_APP_KEY',
    //   appSecret: 'YOUR_APP_SECRET',
    //   serviceId: 'nestjs-prisma-rest-graphql-cqrs',
    // }),
    ThrottlerModule.forRootAsync({
      inject: [EnvConfigService],
      useFactory: (env: EnvConfigService) => ({
        skipIf: () => env.nodeEnv === NodeEnv.Test,
        throttlers: [
          {
            name: 'default',
            ttl: env.throttleTtlMs,
            limit: env.throttleLimit,
          },
        ],
      }),
    }),
    EnvConfigModule,
    GraphqlPresentationModule,
    CqrsModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
