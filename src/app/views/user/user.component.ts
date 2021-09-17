import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';


@Component({
  templateUrl: 'user.component.html'
})
export class UserComponent implements OnInit {
  userForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    hobbies: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {

  }
  ngOnInit(): void {

  }
  onSubmit() {
    if (this.userForm.valid) {
      this.authService.createUser(this.userForm.value);
    }
  }
}
