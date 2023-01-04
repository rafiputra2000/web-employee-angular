import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoginResponse } from 'src/app/shared/interface/login.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  showPassword: boolean = false;
  ngOnInit(): void {}

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', Validators.required),
  });

  // validation
  isFormValid(loginField: string): boolean {
    const control: AbstractControl = this.loginForm.get(
      loginField
    ) as AbstractControl;
    return control && control.invalid && (control.dirty || control.touched);
  }

  onSubmit(): void {
    const payload = this.loginForm.value;
    this.authService.login(payload).subscribe({
      next: (token: LoginResponse | null) => {
        if (token) this.router.navigateByUrl('view');
        else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Email atau Password salah',
          });
        }
      },
    });
  }
  onShowPassword(): void {
    this.showPassword = !this.showPassword;
  }
}
