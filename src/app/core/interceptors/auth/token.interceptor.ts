import { HttpInterceptorFn, HttpRequest } from '@angular/common/http'

export const tokenInterceptor: HttpInterceptorFn = (
	req: HttpRequest<any>,
	next
) => {
	const skipUrl = [
		'https://accounts.google.com/.well-known/openid-configuration',
		'https://www.googleapis.com/oauth2/v3/certs',
		'https://openidconnect.googleapis.com/v1/userinfo'
	]

	if (skipUrl.some(url => url.includes(req.url))) {
		return next(req)
	}

	const newRequest = req.clone({
		withCredentials: true
	})

	return next(newRequest)
}
