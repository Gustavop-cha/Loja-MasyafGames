import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, JogoForm } from '../core/api';
import { Produto } from '../cesta/cesta-service';
import { ProdutoService } from '../produto/produto-service';

const PLATAFORMAS = ['PS3', 'PS4', 'Xbox360', 'XboxOne', 'Nintendo'];

/** Administração do catálogo: POST, PUT e DELETE em /api/jogos. */
@Component({
  selector: 'app-admin',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {
  private api = inject(ApiService);
  private produtoService = inject(ProdutoService);
  private cdr = inject(ChangeDetectorRef);

  plataformas = PLATAFORMAS;
  jogos: Produto[] = [];
  filtro = '';
  editandoId: number | null = null;
  form: JogoForm = this.vazio();
  salvando = false;

  ngOnInit() {
    this.carregar();
  }

  get jogosFiltrados(): Produto[] {
    const t = this.filtro.trim().toLowerCase();
    return t ? this.jogos.filter(j => j.nome.toLowerCase().includes(t) || j.plataforma.toLowerCase().includes(t)) : this.jogos;
  }

  carregar() {
    this.produtoService.recarregar().subscribe({
      next: lista => { this.jogos = [...lista].sort((a, b) => a.id - b.id); this.cdr.markForCheck(); },
      error: () => alert('Não foi possível carregar o catálogo.')
    });
  }

  editar(jogo: Produto) {
    this.editandoId = jogo.id;
    const { id, ...dados } = jogo;
    this.form = { ...dados };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicao() {
    this.editandoId = null;
    this.form = this.vazio();
  }

  salvar() {
    this.salvando = true;
    const req = this.editandoId === null
      ? this.api.criarJogo(this.form)
      : this.api.atualizarJogo(this.editandoId, this.form);
    req.subscribe({
      next: jogo => {
        this.salvando = false;
        alert(this.editandoId === null ? `Jogo "${jogo.nome}" criado (ID ${jogo.id}).` : `Jogo "${jogo.nome}" atualizado.`);
        this.cancelarEdicao();
        this.carregar();
      },
      error: erro => {
        this.salvando = false;
        alert(erro.error?.message ?? 'Não foi possível salvar o jogo.');
        this.cdr.markForCheck();
      }
    });
  }

  excluir(jogo: Produto) {
    if (!confirm(`Excluir "${jogo.nome}"?`)) return;
    this.api.excluirJogo(jogo.id).subscribe({
      next: () => this.carregar(),
      error: erro => alert(erro.error?.message ?? 'Não foi possível excluir o jogo.')
    });
  }

  private vazio(): JogoForm {
    return { nome: '', preco: 0, imagem: '', descricao: '', plataforma: 'PS4' };
  }
}
