import { HttpStatus } from '@nestjs/common';
import { CustomHttpException } from './bad-request.exception';

// BadRequest (400)
export class BadRequest extends CustomHttpException {
  constructor(message: string = 'Petición incorrecta', errorCode?: string) {
    super(message, HttpStatus.BAD_REQUEST, errorCode);
  }
}

// Unauthorized (401)
export class Unauthorized extends CustomHttpException {
  constructor(
    message: string = 'No autorizado (sin autenticación)',
    errorCode?: string,
  ) {
    super(message, HttpStatus.UNAUTHORIZED, errorCode);
  }
}

// Forbidden (403)
export class Forbidden extends CustomHttpException {
  constructor(
    message: string = 'Prohibido (sin permisos)',
    errorCode?: string,
  ) {
    super(message, HttpStatus.FORBIDDEN, errorCode);
  }
}

// NotFound (404)
export class NotFound extends CustomHttpException {
  constructor(message: string = 'Recurso no encontrado', errorCode?: string) {
    super(message, HttpStatus.NOT_FOUND, errorCode);
  }
}

// Conflict (409)
export class Conflict extends CustomHttpException {
  constructor(
    message: string = 'Conflicto (duplicados, estado inválido)',
    errorCode?: string,
  ) {
    super(message, HttpStatus.CONFLICT, errorCode);
  }
}

// Gone (410)
export class Gone extends CustomHttpException {
  constructor(
    message: string = 'Recurso ya no está disponible',
    errorCode?: string,
  ) {
    super(message, HttpStatus.GONE, errorCode);
  }
}

// InternalServerError (500)
export class InternalServerError extends CustomHttpException {
  constructor(
    message: string = 'Error interno del servidor',
    errorCode?: string,
  ) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, errorCode);
  }
}

// NotImplemented (501)
export class NotImplemented extends CustomHttpException {
  constructor(message: string = 'No implementado', errorCode?: string) {
    super(message, HttpStatus.NOT_IMPLEMENTED, errorCode);
  }
}

// ServiceUnavailable (503)
export class ServiceUnavailable extends CustomHttpException {
  constructor(message: string = 'Servicio no disponible', errorCode?: string) {
    super(message, HttpStatus.SERVICE_UNAVAILABLE, errorCode);
  }
}
