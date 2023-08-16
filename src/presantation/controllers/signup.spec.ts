import { SignupController } from './signup'
import { MissingParamError } from '../errors/missing-param-error' 
describe('Signup Controller', () => {
  test('should return 400 if no name provided', () => {
    const sut = new SignupController()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password', 
        confirmPassword: 'any_password' 
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.status).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })
  test('should return 400 if no email is provided', () => {
    const sut = new SignupController()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password', 
        confirmPassword: 'any_password' 
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.status).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
})