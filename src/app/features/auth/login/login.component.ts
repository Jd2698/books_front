import { Component, inject } from '@angular/core'
import { AuthService } from '../../../core/services/auth.service'
import {
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators
} from '@angular/forms'

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

	constructor(private formBuilder: FormBuilder) {
		this.formGroup = formBuilder.group({
			email: ['', [Validators.required, Validators.minLength(3)]],
			password: ['', [Validators.required, Validators.minLength(3)]]
		})
	}

	onSubmit() {
		const { email, password } = this.formGroup.value
		this._authService.login(email, password)
	}
}
