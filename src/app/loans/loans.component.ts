import { Component, inject, OnInit } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { ConfirmPopupModule } from 'primeng/confirmpopup'
import { LoansService } from './services/loans.service'
import { TableModule } from 'primeng/table'
import { DatePipe, NgIf } from '@angular/common'
import { DialogModule } from 'primeng/dialog'
import { FormComponent } from './form/form.component'
import { ConfirmationService, MessageService } from 'primeng/api'
import { ToastModule } from 'primeng/toast'
import { Iloan } from './model/loan.model'

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
		ToastModule,
		NgIf
	],
	templateUrl: './loans.component.html',
	styleUrl: './loans.component.css'
})
export class LoansComponent implements OnInit {
	//
	loans!: Iloan[]
	visible: boolean = false
	loanSelected?: Iloan

	private _loanService = inject(LoansService)
	private _confirmationService = inject(ConfirmationService)
	private _messageService = inject(MessageService)

	ngOnInit(): void {
		this.loadLoans()
	}

	loadLoans(): void {
		this._loanService.getAll().subscribe({
			next: response => (this.loans = response),
			error: error => console.log('Error getting users', error)
		})
	}

	setLoanSelected(loan: Iloan) {
		this.toggleDialog()
		this.loanSelected = loan
	}

	toggleDialog() {
		this.loanSelected = undefined
		this.visible = !this.visible
	}

	confirmDelete(event: Event, loanId: number) {
		this._confirmationService.confirm({
			target: event.target as EventTarget,
			message: 'Do you want to delete this record?',
			icon: 'pi pi-info-circle',
			acceptButtonStyleClass: 'py-1 px-2 bg-red-700 text-white',
			rejectButtonStyleClass: 'py-1 px-2',
			accept: () => {
				this.deleteLoan(loanId)
			}
		})
	}

	showToast(data: {
		severity: string
		summary: string
		details: string
		life: number
	}) {
		this._messageService.add({
			severity: data.severity,
			summary: data.summary,
			detail: data.details,
			life: data.life
		})
	}

	deleteLoan(id: number) {
		this._loanService.delete(id).subscribe({
			next: response => {
				this.showToast({
					severity: 'success',
					summary: 'Loan removed',
					details: 'The loan has been removed.',
					life: 4000
				})
				this.loadLoans()
			},
			error: error => console.log('Error deleting user', error)
		})
	}
}
