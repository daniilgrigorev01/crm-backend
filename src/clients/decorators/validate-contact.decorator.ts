import {
  isEmail,
  isMobilePhone,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function ValidateContact(validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string): void => {
    registerDecorator({
      name: 'ValidateContact',
      target: object.constructor,
      propertyName,
      constraints: ['type'],
      options: validationOptions,
      validator: {
        validate(value: string, arguments_: ValidationArguments): boolean {
          const [relatedPropertyName] = arguments_.constraints;
          const relatedValue: string = (arguments_.object as any)[
            relatedPropertyName
          ];
          switch (relatedValue) {
            case 'PHONE': {
              return isMobilePhone(value, 'ru-RU', { strictMode: true });
            }
            case 'EMAIL': {
              return isEmail(value);
            }
            case 'TELEGRAM': {
              const regex: RegExp = /^https:\/\/t\.me\/\w{5,32}/;
              return regex.test(value);
            }
            case 'VK': {
              const validLength: RegExp = /^https:\/\/vk\.com\/.{5,32}/;
              const doesNotStartWithThreeDigits: RegExp =
                /^https:\/\/vk\.com\/(?!\d{3,}).*/;
              const doesNotBeginOrEndWithUnderscore: RegExp =
                /^https:\/\/vk\.com\/(?!_).+(?<!_)$/;
              const doesNotContainMultipleUnderscore: RegExp =
                /^https:\/\/vk\.com\/((?!__).)+/;
              const lessThanFourCharactersAfterTheLetter: RegExp =
                /(^https:\/\/vk\.com\/)((?!.*\.[a-z]\w{1,3}$).)+/;
              const onlyAllowedCharacters: RegExp =
                /(^https:\/\/vk\.com\/)([\d_a-z]+$)/;

              return (
                validLength.test(value) &&
                doesNotStartWithThreeDigits.test(value) &&
                doesNotBeginOrEndWithUnderscore.test(value) &&
                doesNotContainMultipleUnderscore.test(value) &&
                lessThanFourCharactersAfterTheLetter.test(value) &&
                onlyAllowedCharacters.test(value)
              );
            }
            default: {
              return true;
            }
          }
        },
      },
    });
  };
}
