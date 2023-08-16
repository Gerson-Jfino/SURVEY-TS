import { HttpResponse, HttpRequest } from '../protocols/Http'
import { MissingParamError } from '../errors/missing-param-error' 
import { badRequest } from '../helpers/http-helper'
export class SignupController {
  handle (httpRequest: HttpRequest): HttpResponse {
		const {name, email} = httpRequest.body
		if (!name) {
			return badRequest(new MissingParamError('name'))
		}
		if (!email) {
			return badRequest(new MissingParamError('email'))
		}
		return {
			status: 200,
			body: 'Ok'
		}
  }
}
