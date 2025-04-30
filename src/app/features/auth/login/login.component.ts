import { Component, inject } from '@angular/core'
import { AuthService } from '../../../core/services/auth.service'
import {
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators
} from '@angular/forms'
import { OauthServiceService } from '../../../core/services/oauth-service.service'

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [ReactiveFormsModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css'
})
export class LoginComponent {
	private _authService = inject(AuthService)
	formGroup: FormGroup

	constructor(
		private formBuilder: FormBuilder,
		private readonly _oauth: OauthServiceService
	) {
		this.formGroup = formBuilder.group({
			email: ['', [Validators.required, Validators.minLength(3)]],
			password: ['', [Validators.required, Validators.minLength(3)]]
		})
	}

	loginWithGoogle() {
		this._oauth.login()
	}

	onSubmit() {
		const { email, password } = this.formGroup.value
		this._authService.login(email, password, false, null)
	}
}
