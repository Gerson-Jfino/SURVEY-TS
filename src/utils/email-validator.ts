import { EmailValidator} from '../presantation/protocols/email-validator'
export class EmailValidatorAdapter implements EmailValidator {
	isValid(email: string): boolean {
			return false
	}
}