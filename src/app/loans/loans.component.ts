import { Component, OnInit } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { ConfirmPopupModule } from 'primeng/confirmpopup'
import { LoansService } from './services/loans.service'
import { TableModule } from 'primeng/table'
import { DatePipe, NgIf } from '@angular/common'
import { DialogModule } from 'primeng/dialog'
import { FormComponent } from './form/form.component'

@Component({
	selector: 'app-loans',
	standalone: true,
	imports: [
		TableModule,
		DatePipe,
		DialogModule,
		ButtonModule,
		FormComponent,
		ConfirmPopupModule,
		// ToastModule,
		NgIf
	],
	templateUrl: './loans.component.html',
	styleUrl: './loans.component.css'
})
export class LoansComponent implements OnInit {
	//
	loans: any
	visible: boolean = false
	constructor(private _loanService: LoansService) {}

	ngOnInit(): void {
		this.loadLoans()
	}

	loadLoans(): void {
		this._loanService.getAll().subscribe({
			next: response => (this.loans = response),
			error: error => console.log('Error getting users', error)
		})
	}

	toggleDialog() {
		this.visible = !this.visible
	}
}
