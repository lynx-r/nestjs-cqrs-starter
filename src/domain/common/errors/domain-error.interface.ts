import { ModuleNames } from '#/app/constants.js';

export interface DomainErrorDescriptor {
  message: string;
  statusCode: number;
  developerMessage?: string;
  code: number;
  module: ModuleNames;
}
