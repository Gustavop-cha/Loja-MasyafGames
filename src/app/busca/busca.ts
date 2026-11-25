import { Component, inject, signal } from '@angular/core'; import { ActivatedRoute, RouterLink } from '@angular/router'; import { CurrencyPipe } from '@angular/common'; import { CestaService, Produto } from '../cesta/cesta-service'; import { ProdutoService } from '../produto/produto-service';
@Component({selector:'app-busca',imports:[RouterLink,CurrencyPipe],templateUrl:'./busca.html',styleUrl:'./busca.css'})
export class Busca { private route=inject(ActivatedRoute); private produtoService=inject(ProdutoService); cesta=inject(CestaService);
 // Signals: sem zone.js, a tela só atualiza sozinha quando um signal muda
 termo=signal(''); produtos=signal<Produto[]>([]);
 constructor(){this.route.queryParamMap.subscribe(params=>{this.termo.set(params.get('q')??'');this.produtoService.buscarPorNome(this.termo()).subscribe({next:p=>this.produtos.set(p),error:()=>this.produtos.set([])});});}
 comprar(p:Produto){this.cesta.adicionar(p);}
}
