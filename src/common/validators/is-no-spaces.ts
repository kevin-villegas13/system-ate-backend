import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsNoSpaces(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsNoSpaces',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return typeof value === 'string' && value === value.trim();
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} no debe tener espacios al inicio ni al final.`;
        },
      },
    });
  };
}
