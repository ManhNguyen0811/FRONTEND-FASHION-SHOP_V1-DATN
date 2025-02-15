import {Component, OnInit} from '@angular/core';
import {TokenService} from '../../../services/token/token.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [

  ],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit {
    userId: number = 0;

    constructor(private tokenService: TokenService) {

    }

  ngOnInit(): void {
      this.userId = this.tokenService.getUserId();
      console.log(this.userId);
  }
}
