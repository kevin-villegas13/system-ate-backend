import { HttpStatus } from '@nestjs/common';
import { CustomHttpException } from './bad-request.exception';

// BadRequest (400)
export class BadRequest extends CustomHttpException {
  constructor(message: string = 'Petición incorrecta') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

// Unauthorized (401)
export class Unauthorized extends CustomHttpException {
  constructor(message: string = 'No autorizado (sin autenticación)') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

// Forbidden (403)
export class Forbidden extends CustomHttpException {
  constructor(message: string = 'Prohibido (sin permisos)') {
    super(message, HttpStatus.FORBIDDEN);
  }
}

// NotFound (404)
export class NotFound extends CustomHttpException {
  constructor(message: string = 'Recurso no encontrado') {
    super(message, HttpStatus.NOT_FOUND);
  }
}

// Conflict (409)
export class Conflict extends CustomHttpException {
  constructor(message: string = 'Conflicto (duplicados, estado inválido)') {
    super(message, HttpStatus.CONFLICT);
  }
}

// Gone (410)
export class Gone extends CustomHttpException {
  constructor(message: string = 'Recurso ya no está disponible') {
    super(message, HttpStatus.GONE);
  }
}

// InternalServerError (500)
export class InternalServerError extends CustomHttpException {
  constructor(message: string = 'Error interno del servidor') {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

// NotImplemented (501)
export class NotImplemented extends CustomHttpException {
  constructor(message: string = 'No implementado') {
    super(message, HttpStatus.NOT_IMPLEMENTED);
  }
}

// ServiceUnavailable (503)
export class ServiceUnavailable extends CustomHttpException {
  constructor(message: string = 'Servicio no disponible') {
    super(message, HttpStatus.SERVICE_UNAVAILABLE);
  }
}
