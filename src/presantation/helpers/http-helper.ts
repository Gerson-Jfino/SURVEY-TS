import { ServerError } from '../errors/server-error'
import { HttpResponse } from '../protocols/Http'
export const badRequest = (error: Error): HttpResponse => ({
	status: 400,
	body: error
})

export const serverError = (): HttpResponse => ({
	status: 500,
	body: new ServerError()
})
