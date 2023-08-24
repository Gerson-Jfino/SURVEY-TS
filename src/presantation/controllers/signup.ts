import { HttpResponse, HttpRequest } from '../protocols/Http'
import { MissingParamError, InvalidParamError } from '../errors'
import { badRequest, serverError } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'

export class SignupController implements Controller {
	private readonly emailValidator: EmailValidator
	constructor (emailValidator: EmailValidator) {
		this.emailValidator = emailValidator
	}
  handle (httpRequest: HttpRequest): HttpResponse {
		try {
			const requiredFields = ['name', 'email', 'password', 'confirmPassword']
			for (const field of requiredFields) {
				if (!httpRequest.body[field]) {
					return badRequest(new MissingParamError(field))
				}
			}
			const isValid = this.emailValidator.isValid(httpRequest.body.email)
			if (!isValid) {
				return badRequest(new InvalidParamError('email'))
			}
			return {
				status: 200,
				body: 'Ok'
			}
		} catch (error) {
			return serverError()
		}
  }
}
