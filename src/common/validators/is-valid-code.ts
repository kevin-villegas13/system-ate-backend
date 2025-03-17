import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsValidCode(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsValidCode',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return (
            typeof value === 'string' && /^[A-Za-z0-9-]{3,12}$/.test(value)
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} debe tener entre 3 y 12 caracteres y solo puede contener letras, números y guiones.`;
        },
      },
    });
  };
}
