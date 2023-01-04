import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(private readonly router: Router) {}

  ngOnInit(): void {}

  logout() {
    sessionStorage.clear();
    this.router.navigateByUrl('login');
  }
}
