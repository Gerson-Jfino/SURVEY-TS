import { SignupController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { EmailValidator, AddAccountModel, AddAccount, AccountModel } from './signup-protocols'
 

const makeEmailValidator = (): EmailValidator => {
	class EmailValidatorStub implements EmailValidator {
		isValid (email: string): boolean {
			return true
		}
	}
	return new EmailValidatorStub()
}
const makeAddAccount = (): AddAccount => {
	class AddAccoutStub implements AddAccount {
		add (account: AddAccountModel): AccountModel {
			const fakeAccount =  {
				id: 'valid_id',
				name: 'valid_name',
				email: 'valid_email@mail.com',
				password: 'valid_password'
			}
			return fakeAccount
		}
	}
	return new AddAccoutStub()
}
interface SutTypes {
	sut: SignupController,
	emailValidatorStub: EmailValidator,
	addAccountStub: AddAccount
}
const makeSut = (): SutTypes => {
	const emailValidatorStub = makeEmailValidator()
	const addAccountStub = makeAddAccount()
	const sut =  new SignupController(emailValidatorStub, addAccountStub)
	return {
		sut,
		emailValidatorStub,
		addAccountStub
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
  test('should return 400 if password confirmation fails', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
				email: 'any_email@mail.com',
        password: 'any_password',
				confirmPassword: 'invalid_password' 
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.status).toBe(400)
		expect(httpResponse.body).toEqual(new InvalidParamError('confirmPassword'))
  })
  test('should return 400 if an invalid email is provided', () => {
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
		const { sut, emailValidatorStub } =  makeSut()
		jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
			throw new Error
		})
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
	test('should call AddAccount with correct values', () => {
		const { sut, addAccountStub} = makeSut()
		const addSpy = jest.spyOn(addAccountStub, 'add')
		const httpRequest = {
      body: {
        name: 'any_name',
				email: 'any_email@mail.com',
        password: 'any_password',
				confirmPassword: 'any_password'  
      }
    }
		sut.handle(httpRequest)
		expect(addSpy).toHaveBeenCalledWith({
			name: 'any_name',
			email: 'any_email@mail.com',
      password: 'any_password',
		})
	})
})