import { PasswordMatchValidationDirective } from './password-match-validation.directive';

describe('CustomValidationDirective', () => {
  it('should create an instance', () => {
    const directive = new PasswordMatchValidationDirective();
    expect(directive).toBeTruthy();
  });
});
