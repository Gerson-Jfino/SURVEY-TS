import { HttpResponse, HttpRequest, Controller, EmailValidator, AddAccount } from './signup-protocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'

export class SignupController implements Controller {
	private readonly emailValidator: EmailValidator
	private readonly addAccount: AddAccount
	constructor (emailValidator: EmailValidator, addAccount) {
		this.emailValidator = emailValidator
		this.addAccount = addAccount
	}
  handle (httpRequest: HttpRequest): HttpResponse {
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
			this.addAccount.add({
				name,
				email,
				password
			})
			return {
				status: 200,
				body: 'Ok'
			}
		} catch (error) {
			return serverError()
		}
  }
}
