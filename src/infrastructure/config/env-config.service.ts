import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig, NodeEnv } from './env.types.js';

@Injectable()
export class EnvConfigService {
  constructor(private readonly configService: ConfigService) {}

  get nodeEnv(): NodeEnv {
    return this.configService.get<NodeEnv>('NODE_ENV', NodeEnv.Development);
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === NodeEnv.Development;
  }

  get isProduction(): boolean {
    return this.nodeEnv === NodeEnv.Production;
  }

  get isTest(): boolean {
    return this.nodeEnv === NodeEnv.Test;
  }

  get serverPort(): number {
    return Number(this.configService.get<number>('SERVER_PORT', 3000));
  }

  get swaggerDocsPath(): string {
    return this.configService.get<string>('SWAGGER_DOCS_PATH', 'docs');
  }

  get swaggerPath(): string {
    return this.configService.get<string>('SWAGGER_PATH', '/swagger');
  }

  get corsOrigin(): string[] {
    const raw: string = this.configService.getOrThrow('CORS_ORIGIN');
    return raw
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);
  }

  get corsCredentials(): boolean {
    return this.configService.get('CORS_CREDENTIALS', true);
  }

  get serverAddress(): string {
    return this.configService.get<string>('SERVER_ADDRESS') as string;
  }

  get jsonLimit(): string {
    return this.configService.get('JSON_LIMIT', '20mb');
  }

  get database(): DatabaseConfig {
    return {
      connectionUrl: this.configService.get<string>(
        'DATABASE_CONNECTION_URL',
      ) as string,
      name: this.configService.get<string>('DATABASE_NAME') as string,
      username: this.configService.get<string>('DATABASE_USERNAME') as string,
      password: this.configService.get<string>('DATABASE_PASSWORD') as string,
      port: this.configService.get<string>('DATABASE_PORT') as string,
      host: this.configService.get<string>('DATABASE_HOST') as string,
    };
  }

  get throttleTtlMs(): number {
    return Number(this.configService.get<number>('THROTTLE_TTL_MS', 60_000));
  }

  get throttleLimit(): number {
    return Number(this.configService.get<number>('THROTTLE_LIMIT', 10));
  }
}
