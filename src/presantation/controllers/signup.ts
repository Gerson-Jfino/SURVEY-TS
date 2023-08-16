import { HttpResponse, HttpRequest } from '../protocols/Http'
import { MissingParamError } from '../errors/missing-param-error' 
export class SignupController {
  handle (httpRequest: HttpRequest): HttpResponse {
		const {name, email} = httpRequest.body
		if (!name) {
			return {
				status: 400,
				body: new MissingParamError('name')
			}
		}
		if (!email) {
			return {
				status: 400,
				body: new MissingParamError('email')
			}
		}
		return {
			status: 200,
			body: 'Ok'
		}
  }
}
