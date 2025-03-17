import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsValidName(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsValidName',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return (
            typeof value === 'string' &&
            /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü'’]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñÜü'’]+)*$/.test(
              value,
            )
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} solo puede contener letras, espacios y caracteres especiales como tildes, diéresis y apóstrofes.`;
        },
      },
    });
  };
}
