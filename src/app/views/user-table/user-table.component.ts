import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';


@Component({
  templateUrl: 'user-table.component.html'
})
export class UserTableComponent implements OnInit {
  users: any[];
  constructor(
    private authService: AuthService
  ) {

  }
  ngOnInit(): void {
    this.authService.getUsers().subscribe((data: any) => {
      this.users = data.users;
    });
  }
}
