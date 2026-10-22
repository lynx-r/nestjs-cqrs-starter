import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { NodeEnv } from './env.types.js';

export class EnvSchema {
  @IsString()
  SWAGGER_DOCS_PATH: string;

  @IsString()
  SWAGGER_PATH: string;

  @IsString()
  CORS_ORIGIN: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  SERVER_PORT: number;

  @IsString()
  DATABASE_CONNECTION_URL: string;

  @IsString()
  SERVER_ADDRESS: string;

  @IsString()
  JSON_LIMIT: string;

  @IsString()
  DATABASE_NAME: string;

  @IsString()
  DATABASE_USERNAME: string;

  @IsString()
  DATABASE_PASSWORD: string;

  @IsString()
  DATABASE_PORT: string;

  @IsString()
  DATABASE_HOST: string;

  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv;

  @IsOptional()
  @IsString()
  ACTIVE_PROFILE_NAME?: string;

  @IsOptional()
  @IsString()
  ACTIVE_PROFILE_DESCRIPTION?: string;

  @IsOptional()
  @IsString()
  ACTIVE_PROFILE_LINKS?: string;

  @IsOptional()
  @IsString()
  ACTIVE_PROFILE_SKILLS?: string;

  @IsOptional()
  @IsString()
  ACTIVE_PROFILE_EXPERIENCE?: string;

  @IsOptional()
  @IsString()
  ACTIVE_PROFILE_PROJECTS?: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  THROTTLE_TTL_MS: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  THROTTLE_LIMIT: number;
}
