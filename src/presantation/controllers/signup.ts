export class SignupController {
  handle (httpRequest: any): any {
    return {
      status: 400,
			error: 'Missing param: name'
    }
  }
}
