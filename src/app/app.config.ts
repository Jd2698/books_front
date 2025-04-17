import {
	APP_INITIALIZER,
	ApplicationConfig,
	provideZoneChangeDetection
} from '@angular/core'
import { provideRouter } from '@angular/router'

import { routes } from './app.routes'
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { provideAnimations } from '@angular/platform-browser/animations'
import { tokenInterceptor, authInterceptor } from './core/interceptors'
import { AuthService } from './core/services'
import { lastValueFrom } from 'rxjs'

export function initApp(authService: AuthService) {
	return () => lastValueFrom(authService.checkAuth())
}

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideHttpClient(),
		provideAnimations(),
		provideHttpClient(withInterceptors([authInterceptor, tokenInterceptor])),
		{
			provide: APP_INITIALIZER,
			useFactory: initApp,
			deps: [AuthService],
			multi: true
		}
	]
}
