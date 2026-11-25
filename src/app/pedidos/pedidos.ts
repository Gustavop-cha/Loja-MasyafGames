import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, Pedido } from '../core/api';
import { AuthService } from '../core/auth';

/** Histórico de pedidos do usuário logado: GET /api/pedidos/usuario/{id} e DELETE /api/pedidos/{id}. */
@Component({
  selector: 'app-pedidos',
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css'
})
export class Pedidos implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  auth = inject(AuthService);

  pedidos: Pedido[] = [];
  carregando = true;
  erro = '';

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    const usuario = this.auth.usuario();
    if (!usuario) { this.carregando = false; return; }
    this.carregando = true;
    this.api.historico(usuario.id).subscribe({
      next: lista => { this.pedidos = lista; this.carregando = false; this.cdr.markForCheck(); },
      error: () => { this.erro = 'Não foi possível carregar seus pedidos.'; this.carregando = false; this.cdr.markForCheck(); }
    });
  }

  cancelar(pedido: Pedido) {
    if (!confirm(`Cancelar o pedido #${pedido.id}?`)) return;
    this.api.cancelarPedido(pedido.id).subscribe({
      next: () => { this.pedidos = this.pedidos.filter(p => p.id !== pedido.id); this.cdr.markForCheck(); },
      error: erro => alert(erro.error?.message ?? 'Não foi possível cancelar o pedido.')
    });
  }
}
