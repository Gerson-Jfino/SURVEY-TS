import { HttpResponse, HttpRequest, Controller, EmailValidator, AddAccount } from './signup-protocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError, ok } from '../../helpers/http-helper'

export class SignupController implements Controller {
	private readonly emailValidator: EmailValidator
	private readonly addAccount: AddAccount
	constructor (emailValidator: EmailValidator, addAccount) {
		this.emailValidator = emailValidator
		this.addAccount = addAccount
	}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const requiredFields = ['name', 'email', 'password', 'confirmPassword']
			for (const field of requiredFields) {
				if (!httpRequest.body[field]) {
					return badRequest(new MissingParamError(field))
				}
			}
			const { name, email, password, confirmPassword} = httpRequest.body
			if (password !== confirmPassword) {
				return badRequest(new InvalidParamError('confirmPassword'))
			}
			const isValid = this.emailValidator.isValid(email)
			if (!isValid) {
				return badRequest(new InvalidParamError('email'))
			}			
			const account = await this.addAccount.add({
				name,
				email,
				password
			})
			return ok(account)
		} catch (error) {
			return serverError()
		}
  }
}
