import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  @Input() tableHeaders: string[] = [];  
  @Input() tableData: any[] = [];   
  @Input()  eventClick :(item:any) => void= () =>{};
  @Input() routerLinkString : string ='';
  @Input()  activeRouterLinkString : string = '';
  @Input() changePage: boolean = true;
  @Input() toggleCheckbox: (item: any) => void = () => {};

 
  }
 
