import { Injectable } from '@angular/core'

import { AuthConfig, OAuthService } from 'angular-oauth2-oidc'
import { AuthService } from './auth.service'

export const authCodeFlowConfig: AuthConfig = {
	// Url of the Identity Provider
	issuer: 'https://accounts.google.com',

	// URL of the SPA to redirect the user to after login, example redirectUri: window.location.origin + '/index.html',
	redirectUri: window.location.origin + '/auth/login',

	// The SPA's id. The SPA is registerd with this id at the auth-server
	// clientId: 'server.code',
	clientId:
		'735098307777-k5fhs6dbisrjodab575536gos65cv0ql.apps.googleusercontent.com',

	// Important: Request offline_access to get a refresh token
	// The api scope is a usecase specific one
	scope: 'openid profile email',
	strictDiscoveryDocumentValidation: false
}

@Injectable({
	providedIn: 'root'
})
export class OauthServiceService {
	constructor(
		private readonly _oauthService: OAuthService,
		private readonly _authService: AuthService
	) {
		this._oauthService.configure(authCodeFlowConfig)

		this.initializeAuth()
	}

	private async initializeAuth(): Promise<void> {
		await this.loadDiscoveryDocument()

		if (this._oauthService.hasValidAccessToken()) {
			await this.loadUserProfile()
		}
	}

	private async loadDiscoveryDocument(): Promise<void> {
		try {
			await this._oauthService.loadDiscoveryDocumentAndTryLogin()
		} catch (error) {
			console.error('Error loading discovery document or trying login:', error)
		}
	}

	private async loadUserProfile(): Promise<void> {
		try {
			const user = await this._oauthService.loadUserProfile()

			const token = await this._oauthService.getAccessToken()
			const idToken = await this._oauthService.getIdToken()

			this._authService.login(null, null, true, idToken)
			this.logout()
		} catch (error) {
			console.error('Error loading user profile:', error)
		}
	}

	async login(): Promise<void> {
		await this.loadDiscoveryDocument()

		if (!this._oauthService.hasValidAccessToken()) {
			this._oauthService.initLoginFlow()
		}
	}

	logout() {
		this._oauthService.logOut()
		this._oauthService.revokeTokenAndLogout()
	}
}
