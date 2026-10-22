import { ModuleNames } from '#/app/constants.js';
import { DomainErrorDescriptor } from './domain-error.interface.js';

export class DomainException extends Error {
  public readonly statusCode: number;
  public readonly developerMessage?: string;
  public readonly code: number;
  public readonly module: ModuleNames;

  constructor(public readonly error: DomainErrorDescriptor) {
    super(error.message);
    this.statusCode = error.statusCode;
    this.developerMessage = error.developerMessage;
    this.code = error.code;
    this.module = error.module;

    Object.setPrototypeOf(this, DomainException.prototype);
  }
}
