import { HttpResponse } from '../protocols/Http'
export const badRequest = (error: Error): HttpResponse => ({
	status: 400,
	body: error
})