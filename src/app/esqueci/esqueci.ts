import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../core/api';

@Component({
  selector: 'app-esqueci',
  imports: [FormsModule, RouterLink],
  templateUrl: './esqueci.html',
  styleUrl: './esqueci.css',
})
export class Esqueci {
  private api = inject(ApiService);
  private router = inject(Router);

  // Signals: o app roda sem zone.js, então a tela só atualiza sozinha quando um signal muda
  /** 1 = informar e-mail; 2 = informar código e nova senha */
  etapa = signal<1 | 2>(1);
  enviando = signal(false);
  erro = signal('');

  email = '';
  codigo = '';
  novaSenha = '';
  confirmaSenha = '';

  senhasIguais(): boolean {
    return this.novaSenha === this.confirmaSenha;
  }

  enviarEmail() {
    this.enviando.set(true);
    this.erro.set('');
    this.api.esqueciSenha(this.email).subscribe({
      next: () => {
        this.enviando.set(false);
        this.etapa.set(2);
      },
      error: () => {
        this.enviando.set(false);
        this.erro.set('Não foi possível enviar o código. Tente novamente.');
      }
    });
  }

  redefinir() {
    this.enviando.set(true);
    this.erro.set('');
    this.api.redefinirSenha(this.email, this.codigo, this.novaSenha).subscribe({
      next: () => {
        this.enviando.set(false);
        alert('Senha alterada com sucesso! Faça login com a nova senha.');
        this.router.navigate(['/login']);
      },
      error: err => {
        this.enviando.set(false);
        this.erro.set(err.status === 400 ? 'Código inválido ou expirado.' : 'Não foi possível alterar a senha.');
      }
    });
  }

  voltar() {
    this.etapa.set(1);
    this.codigo = '';
    this.novaSenha = '';
    this.confirmaSenha = '';
    this.erro.set('');
  }
}
