import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TreeService } from 'src/app/services/tree.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginPageComponent implements OnInit {
  email: string;
  password: string;
  isError: boolean = false;
  errorMessage: string;

  constructor(
    private authSvc: AuthService,
    public router: Router,
    private treeSvc: TreeService
  ) {}

  ngOnInit(): void {}

  onSubmit = async () => {
    this.isError = false;
    try {
      await this.authSvc.loginUser(this.email, this.password);
      this.treeSvc.onLogin(this.email);
      window.localStorage.setItem('email', this.email);
      this.router.navigateByUrl('list');
    } catch (error) {
      this.isError = true;
      this.errorMessage = error;
    }
  };

  createAccount = async (): Promise<void> => {
    this.isError = false;
    try {
      await this.authSvc.signupUser(this.email, this.password);
      this.treeSvc.setUserDoc(this.email);
      this.treeSvc.onLogin(this.email);
      this.router.navigateByUrl('list');
    } catch (error) {
      this.isError = true;
      this.errorMessage = error;
    }
  };

  resetPassword = (): void => {
    this.isError = false;
    if (!this.email) {
      this.isError = true;
      this.errorMessage =
        'You need to enter a valid email to reset your password';
    }
    this.authSvc.resetPassword(this.email);
  };
}
