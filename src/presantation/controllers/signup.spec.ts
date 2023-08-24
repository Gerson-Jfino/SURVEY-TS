import { SignupController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../errors'
import { EmailValidator } from '../protocols'

interface SutTypes {
	sut: SignupController,
	emailValidatorStub: EmailValidator
}
const makeSut = (): SutTypes => {
	class EmailValidatorStub implements EmailValidator {
		isValid (email: string): boolean {
			return true
		}
	}
	const emailValidatorStub = new EmailValidatorStub()
	const sut =  new SignupController(emailValidatorStub)
	return {
		sut,
		emailValidatorStub
	}
}
describe('Signup Controller', () => {
  test('should return 400 if no name provided', () => {
    const { sut } = makeSut()
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
    const { sut } = makeSut()
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
  test('should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
				email: 'any_email@mail.com',
        confirmPassword: 'any_password' 
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.status).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })
  test('should return 400 if no password confirmation is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
				email: 'any_email@mail.com',
        password: 'any_password' 
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.status).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('confirmPassword'))
  })
  test('should return 400 if an invalid is provided', () => {
    const { sut, emailValidatorStub } = makeSut()
		jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'any_name',
				email: 'invalid_email@mail.com',
        password: 'any_password',
				confirmPassword: 'any_password'  
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.status).toBe(400)
		expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
  test('should call emailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
		const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'any_name',
				email: 'any_email@mail.com',
        password: 'any_password',
				confirmPassword: 'any_password'  
      }
    }
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })
	test('should return 500 if emailValidator throws', () => {
    class EmailValidatorStub implements EmailValidator {
			isValid (email: string): boolean {
				throw new Error()
			}
		}
		const emailValidatorStub = new EmailValidatorStub()
		const sut =  new SignupController(emailValidatorStub)
    const httpRequest = {
      body: {
        name: 'any_name',
				email: 'any_email@mail.com',
        password: 'any_password',
				confirmPassword: 'any_password'  
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.status).toBe(500)
		expect(httpResponse.body).toEqual(new ServerError())
  })
})