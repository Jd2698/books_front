import { Component, OnInit } from '@angular/core'
import {
	RouterOutlet
} from '@angular/router'
import { initFlowbite } from 'flowbite';
import { NavBarComponent } from './features/nav-bar/nav-bar.component';
import { FooterComponent } from "./shared/footer/footer.component";

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, NavBarComponent, FooterComponent],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
	constructor() { }
	
	ngOnInit(): void {
		initFlowbite()
	}
}
