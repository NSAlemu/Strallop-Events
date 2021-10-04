import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn} from '@angular/forms';

@Directive({
  selector: '[appPasswordMatchValidation]',
  providers: [{provide: NG_VALIDATORS, useExisting: PasswordMatchValidationDirective, multi: true}]
})
export class PasswordMatchValidationDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return this.passwordMatchValidator(control);
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    return password && confirmPassword && password.value !== confirmPassword.value ? {passwordDontMatch: true} : null;
  };
}
