import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsValidGeneralName(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsValidGeneralName',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message:
          'Solo se permiten letras, números, espacios y guiones bajos en el nombre.',
        ...validationOptions,
      },
      validator: {
        validate(value: string) {
          return typeof value === 'string' && /^[A-Za-z0-9_ ]+$/.test(value);
        },
      },
    });
  };
}
