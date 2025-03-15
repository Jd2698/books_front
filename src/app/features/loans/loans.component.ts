import { Component, inject, OnInit } from '@angular/core'
import { LoansService } from './services/loans.service'
import { DatePipe, NgIf } from '@angular/common'
import { FormComponent } from './form/form.component'
import { Iloan } from './model/loan.model'
import { FormsModule } from '@angular/forms'

@Component({
	selector: 'app-loans',
	standalone: true,
	imports: [DatePipe, FormComponent, NgIf, FormsModule],
	templateUrl: './loans.component.html',
	styleUrl: './loans.component.css'
})
export class LoansComponent implements OnInit {
	searchKeyword = ''
	loans!: Iloan[]
	isModalVisible: boolean = false
	selectedLoan?: Iloan

	private _loanService = inject(LoansService)

	ngOnInit(): void {
		this.loadLoans()
	}

	loadLoans(): void {
		this._loanService.getAll().subscribe({
			next: response => (this.loans = response),
			error: error => console.log('Error getting users', error)
		})
	}

	setselectedLoan(loan: Iloan): void {
		this.toggleModalVisibility()
		this.selectedLoan = loan
	}

	toggleModalVisibility(): void {
		this.selectedLoan = undefined
		this.isModalVisible = !this.isModalVisible
	}

	confirmDelete(event: Event, loanId: number): void { }

	deleteLoan(id: number) { }
}
