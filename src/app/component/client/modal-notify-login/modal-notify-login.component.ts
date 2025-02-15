import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { NavigationService } from '../../../services/Navigation/navigation.service';

@Component({
  selector: 'app-modal-notify-login',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './modal-notify-login.component.html',
  styleUrl: './modal-notify-login.component.scss'
})
export class ModalNotifyLoginComponent implements OnInit{
  constructor(private navigationService : NavigationService){

  }
  currentLang: string = '';
  currentCurrency: string = '';
  async ngOnInit(): Promise<void> {
    this.currentLang = await firstValueFrom(this.navigationService.currentLang$);
    this.currentCurrency = await firstValueFrom(this.navigationService.currentCurrency$);
  }
  @Input() isModalOpen : boolean = false

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
