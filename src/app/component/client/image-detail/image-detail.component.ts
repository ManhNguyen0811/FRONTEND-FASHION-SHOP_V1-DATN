import { Component } from '@angular/core';
import {HeaderComponent} from '../header/header.component';
import {NavBottomComponent} from '../nav-bottom/nav-bottom.component';
import {FooterComponent} from '../footer/footer.component';

@Component({
  selector: 'app-image-detail',
  standalone: true,
  imports: [
    HeaderComponent,
    NavBottomComponent,
    FooterComponent
  ],
  templateUrl: './image-detail.component.html',
  styleUrl: './image-detail.component.scss'
})
export class ImageDetailComponent {

}
