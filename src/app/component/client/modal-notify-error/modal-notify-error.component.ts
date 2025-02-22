import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-notify-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-notify-error.component.html',
  styleUrl: './modal-notify-error.component.scss'
})
export class ModalNotifyErrorComponent  implements OnInit{
  isModalOpen : boolean = true
  ngOnInit(): void {
    document.body.classList.add('modal-open');
    setTimeout(() => {
      this.isModalOpen = false;
      document.body.classList.remove('modal-open'); // Cho phép cuộn khi modal đóng
    }, 1500);
  }
 

  openModal() {
    this.isModalOpen = true;
  }
}
