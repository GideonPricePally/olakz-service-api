import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

@ValidatorConstraint({ name: 'Username', async: false })
export class Username implements ValidatorConstraintInterface {
  private errorMessage = 'email is not valid.';
  validate(username: string) {
    if (/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(username)) {
      return true;
    } else if (/^\+\d{1,3}\d{7,14}$/g.test(username)) {
      if (username.startsWith('+234') && username.length !== 14) {
        this.errorMessage = 'mobile number is not valid';
        return false;
      }
      this.errorMessage = 'mobile number is not valid';
      const phoneNumber = parsePhoneNumberFromString(username);
      return phoneNumber?.isValid() || false;
    } else return false;
  }

  defaultMessage() {
    return this.errorMessage;
  }
}
