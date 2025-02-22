import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-model-notify-succsess',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './model-notify-succsess.component.html',
  styleUrl: './model-notify-succsess.component.scss'
})
export class ModelNotifySuccsessComponent implements OnInit {
 isModalOpen : boolean = true



  ngOnInit(): void {
    document.body.classList.add('modal-open');
    setTimeout(() => {
      this.isModalOpen = false;
      document.body.classList.remove('modal-open');  
    }, 1500);
  }
 

  openModal() {
    this.isModalOpen = true;
  }

   
}
