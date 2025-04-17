import { HttpInterceptorFn, HttpRequest } from '@angular/common/http'

export const tokenInterceptor: HttpInterceptorFn = (
	req: HttpRequest<any>,
	next
) => {
	const newRequest = req.clone({
		withCredentials: true
	})

	return next(newRequest)
}
