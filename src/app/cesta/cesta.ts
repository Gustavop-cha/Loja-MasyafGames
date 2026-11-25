import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CestaService } from './cesta-service';
import { ApiService } from '../core/api';
import { AuthService } from '../core/auth';

@Component({
  selector: 'app-cesta',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './cesta.html',
  styleUrl: './cesta.css'
})
export class Cesta {
  cesta = inject(CestaService);
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);
  enviando = false;

  finalizar() {
    if (this.cesta.itens().length === 0 || this.enviando) return;
    const usuario = this.auth.usuario();
    if (!usuario) {
      alert('Entre na sua conta para finalizar o pedido.');
      this.router.navigate(['/login']);
      return;
    }
    const itens = this.cesta.itens().map(item => ({ jogoId: item.produto.id, quantidade: item.qtd }));
    this.enviando = true;
    this.api.criarPedido(usuario.id, itens).subscribe({
      next: pedido => {
        this.enviando = false;
        alert(`Pedido #${pedido.id} finalizado com sucesso! Total: R$ ${pedido.total.toFixed(2)}`);
        this.cesta.limpar();
        this.router.navigate(['/pedidos']);
      },
      error: erro => {
        this.enviando = false;
        alert(erro.error?.message ?? 'Não foi possível finalizar o pedido.');
      }
    });
  }
}
