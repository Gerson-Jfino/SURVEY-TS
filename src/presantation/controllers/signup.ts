export class SignupController {
  handle (httpRequest: any): any {
		const {name, email} = httpRequest.body
		if (!name) {
			return {
				status: 400,
				error: 'Missing param: name'
			}
		}
		if (!email) {
			return {
				status: 400,
				error: 'Missing param: email'
			}
		}
  }
}
