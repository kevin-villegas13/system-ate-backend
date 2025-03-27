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
            typeof value === 'string' &&
            /^(?:[A-Za-z0-9.-]+|[A-Za-z]{1}[0-9]{3}[A-Za-z]{1}[0-9]{7})$/.test(
              value,
            )
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} debe ser válido: puede contener letras, números, puntos y guiones, o seguir el formato de letras, números y guiones.`;
        },
      },
    });
  };
}
