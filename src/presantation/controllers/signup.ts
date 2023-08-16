import { HttpResponse, HttpRequest } from '../protocols/Http'
import { MissingParamError } from '../errors/missing-param-error' 
import { badRequest } from '../helpers/http-helper'
export class SignupController {
  handle (httpRequest: HttpRequest): HttpResponse {
		const requiredFields = ['name', 'email']
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
