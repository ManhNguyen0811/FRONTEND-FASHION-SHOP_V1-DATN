import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [RouterLink,CommonModule,FormsModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() eventClickBtnSave : (item?:any) => void = () =>{};
  @Input() routerLinkStringBtnSave : string = ''
  @Input() routerLinkActiveStringBtnSave : string = ''


  @Input() eventClickBtnAdd : (item?:any) => void = () => {}
  @Input() routerLinkStringBtnAdd : string = ''
  @Input() routerLinkActiveStringBtnAdd : string = ''



}
