import { HttpResponse, HttpRequest } from '../protocols/Http'
export class SignupController {
  handle (httpRequest: HttpRequest): HttpResponse {
		const {name, email} = httpRequest.body
		if (!name) {
			return {
				status: 400,
				body: new Error('Missing param: name')
			}
		}
		if (!email) {
			return {
				status: 400,
				body: new Error('Missing param: email')
			}
		}
		return {
			status: 200,
			body: 'Ok'
		}
  }
}
