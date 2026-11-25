import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../core/api';
import { AuthService } from '../core/auth';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  router = inject(Router);
  private api = inject(ApiService);
  private auth = inject(AuthService);

  Email: string = '';
  password: string = '';

  entrar() {
    this.api.login(this.Email, this.password).subscribe({
      next: usuario => {
        this.auth.entrar(usuario);
        alert(`Bem-vindo(a), ${usuario.nome}!`);
        this.router.navigate(['/']);
      },
      error: () => alert('E-mail ou senha incorretos.')
    });
  }
}
