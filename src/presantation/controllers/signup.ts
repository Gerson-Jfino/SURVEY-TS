import { HttpResponse, HttpRequest } from '../protocols/Http'
import { MissingParamError } from '../errors/missing-param-error' 
import { badRequest } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
export class SignupController implements Controller {
  handle (httpRequest: HttpRequest): HttpResponse {
		const requiredFields = ['name', 'email', 'password', 'confirmPassword']
		for (const field of requiredFields) {
			if (!httpRequest.body[field]) {
				return badRequest(new MissingParamError(field))
			}
		}
		return {
			status: 200,
			body: 'Ok'
		}
  }
}
