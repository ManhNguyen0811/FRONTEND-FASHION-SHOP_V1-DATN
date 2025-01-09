import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-admin',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header-admin.component.html',
  styleUrl: './header-admin.component.scss'
})
export class HeaderAdminComponent {
  @Input() title_header: string = 'Trống ';
  @Input() title_btn : string = 'Add Item';
  @Input() routerLinkString : string = ''
}
