import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsPastDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsPastDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return new Date(value) <= new Date();
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} no puede ser una fecha futura.`;
        },
      },
    });
  };
}
