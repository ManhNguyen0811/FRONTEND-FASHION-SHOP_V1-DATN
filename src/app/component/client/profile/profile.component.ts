import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NavigationService } from '../../../services/Navigation/navigation.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterOutlet, CommonModule
    , RouterLink, RouterLinkActive],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements AfterViewInit  {
  isLoading = false;
  currentActiveElement: HTMLElement | null = null;

  constructor(private router: Router, private cdr: ChangeDetectorRef, private navigationService: NavigationService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
        this.cdr.detectChanges();
      } else if (event instanceof NavigationEnd) {
        setTimeout(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }, 200);
      }
    });
  }
  ngAfterViewInit(): void {
    this.addFirstElement()
  }
  addFirstElement() {
    const firstElement = document.querySelector('.list-group-item') as HTMLElement;
    if (firstElement) {
      firstElement.classList.add('active-link');
      this.currentActiveElement = firstElement;
    }
  }
  
  navigateTo(route: string) {
    this.navigationService.navigateTo(route);
  }


  setActiveClass(event: MouseEvent, router: string) {
    console.log(event.target)
    const clickedElement = event.target as HTMLElement;

    if (this.currentActiveElement) {
      this.currentActiveElement.classList.remove('active-link');
    }

    clickedElement.classList.add('active-link');
    this.currentActiveElement = clickedElement;
    this.navigateTo(router);
  }
}
