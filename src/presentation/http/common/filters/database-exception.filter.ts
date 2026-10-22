// import { DB_CONSTRAINT_MESSAGES } from '@app/common/constants/database-errors.constants';
// import {
//   ArgumentsHost,
//   Catch,
//   ExceptionFilter,
//   HttpStatus,
// } from '@nestjs/common';
// import { Response } from 'express';
// import { QueryFailedError } from 'typeorm';

// @Catch(QueryFailedError)
// export class DatabaseExceptionFilter implements ExceptionFilter {
//   catch(exception: QueryFailedError, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();

//     // Код 23505 — это уникальное ограничение в Postgres
//     if (
//       'code' in exception &&
//       'constraint' in exception &&
//       exception.code === '23505'
//     ) {
//       const constraint = exception.constraint as string;
//       const message =
//         DB_CONSTRAINT_MESSAGES[constraint] ||
//         'Запись с такими данными уже существует';

//       return response.status(HttpStatus.CONFLICT).json({
//         statusCode: HttpStatus.CONFLICT,
//         message: message,
//         error: 'Conflict',
//       });
//     }

//     const message = 'Ошибка базы данных';
//     const status = HttpStatus.INTERNAL_SERVER_ERROR;
//     console.error(exception);

//     response.status(status).json({
//       statusCode: status,
//       message: message,
//       error: 'Conflict',
//     });
//   }
// }
