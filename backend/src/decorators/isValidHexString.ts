import { registerDecorator, ValidationOptions } from 'class-validator';

export const IsValidHexString = (validationOptions?: ValidationOptions) => {
  return function (object, propertyName: string) {
    registerDecorator({
      name: 'isValidHexString',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} must be a valid hex string`,
        ...validationOptions,
      },
      validator: {
        validate(value) {
          const hexadecimal = /^(0x|0X)?[a-fA-F0-9]+$/;
          return typeof value === 'string' && hexadecimal.test(value);
        },
      },
    });
  };
};
