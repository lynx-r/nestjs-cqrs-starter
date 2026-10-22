import { Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnvConfigService } from './env-config.service.js';
import { EnvSchema } from './env.schema.js';

export const validateEnv = (config: Record<string, unknown>): EnvSchema => {
  const logger = new Logger(EnvConfigService.name);

  const validatedConfig = plainToInstance(EnvSchema, config, {
    enableImplicitConversion: true,
  });
  const validationErrors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (validationErrors.length > 0) {
    validationErrors.forEach((err) => {
      if (err.constraints) {
        const errorMessage = Object.values(err.constraints);
        errorMessage.forEach((error) => logger.error(error));
      } else {
        logger.error(`Validation error in property: ${err.property}`);
      }
    });

    process.exit(1);
  }
  return validatedConfig;
};
