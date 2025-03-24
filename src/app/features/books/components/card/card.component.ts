import { NgIf } from '@angular/common'
import { Component, inject, input } from '@angular/core'
import { IBook } from '../../models/book.model'
import { AuthService } from '../../../../core/services'
import { Router } from '@angular/router'

@Component({
	selector: 'app-card',
	standalone: true,
	imports: [NgIf],
	templateUrl: './card.component.html',
	styleUrl: './card.component.css'
})
export class CardComponent {
	item = input<IBook>()

	_authService = inject(AuthService)
	_router = inject(Router)

	onReserve(book: IBook): void {
		if (!this._authService.isAuthenticatedSignal()) {
			this._router.navigate(['auth/login'])
			return
		}

		console.log('si pasa')
	}
}
