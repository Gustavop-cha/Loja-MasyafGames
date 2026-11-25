import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produto } from '../cesta/cesta-service';

export interface Usuario { id: number; nome: string; email: string; admin: boolean; token?: string; }
export interface Cadastro { nome:string; email:string; senha:string; cpf:string; telefone:string; cep:string; rua:string; numero:string; bairro:string; cidade:string; estado:string; }
export interface ItemPedidoRequest { jogoId:number; quantidade:number; }
export interface ItemPedido { id:number; jogo:Produto; quantidade:number; precoUnitario:number; }
export interface Pedido { id:number; usuarioId:number; data:string; total:number; itens:ItemPedido[]; }
export type JogoForm = Omit<Produto, 'id'>;

/** Endereço base da API REST (Spring Boot). */
export const API = 'http://localhost:8080/api';

/**
 * Único ponto de comunicação do Angular com o backend.
 * Cada método corresponde a um endpoint RESTful.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  // ===== Jogos (catálogo) =====
  /** GET /api/jogos */
  listarJogos(): Observable<Produto[]> { return this.http.get<Produto[]>(`${API}/jogos`); }
  /** GET /api/jogos?nome= */
  buscarJogos(nome: string): Observable<Produto[]> { return this.http.get<Produto[]>(`${API}/jogos`, { params: { nome } }); }
  /** GET /api/jogos?plataforma= */
  jogosPorPlataforma(plataforma: string): Observable<Produto[]> { return this.http.get<Produto[]>(`${API}/jogos`, { params: { plataforma } }); }
  /** GET /api/jogos/{id} */
  buscarJogo(id: number): Observable<Produto> { return this.http.get<Produto>(`${API}/jogos/${id}`); }
  /** POST /api/jogos */
  criarJogo(jogo: JogoForm): Observable<Produto> { return this.http.post<Produto>(`${API}/jogos`, jogo); }
  /** PUT /api/jogos/{id} */
  atualizarJogo(id: number, jogo: JogoForm): Observable<Produto> { return this.http.put<Produto>(`${API}/jogos/${id}`, jogo); }
  /** DELETE /api/jogos/{id} */
  excluirJogo(id: number): Observable<void> { return this.http.delete<void>(`${API}/jogos/${id}`); }

  // ===== Usuários =====
  /** POST /api/usuarios/cadastro */
  cadastrar(dados: Cadastro): Observable<Usuario> { return this.http.post<Usuario>(`${API}/usuarios/cadastro`, dados); }
  /** POST /api/auth/login */
  login(email: string, senha: string): Observable<Usuario> { return this.http.post<Usuario>(`${API}/auth/login`, { email, senha }); }
  /** POST /api/auth/esqueci-senha — gera o código de recuperação */
  esqueciSenha(email: string): Observable<void> { return this.http.post<void>(`${API}/auth/esqueci-senha`, { email }); }
  /** POST /api/auth/redefinir-senha */
  redefinirSenha(email: string, codigo: string, novaSenha: string): Observable<void> { return this.http.post<void>(`${API}/auth/redefinir-senha`, { email, codigo, novaSenha }); }
  /** GET /api/usuarios/{id} */
  buscarUsuario(id: number): Observable<Usuario> { return this.http.get<Usuario>(`${API}/usuarios/${id}`); }

  // ===== Pedidos =====
  /** POST /api/pedidos */
  criarPedido(usuarioId:number, itens:ItemPedidoRequest[]): Observable<Pedido> { return this.http.post<Pedido>(`${API}/pedidos`, { usuarioId, itens }); }
  /** GET /api/pedidos/usuario/{usuarioId} */
  historico(usuarioId:number): Observable<Pedido[]> { return this.http.get<Pedido[]>(`${API}/pedidos/usuario/${usuarioId}`); }
  /** GET /api/pedidos/{id} */
  buscarPedido(id:number): Observable<Pedido> { return this.http.get<Pedido>(`${API}/pedidos/${id}`); }
  /** DELETE /api/pedidos/{id} */
  cancelarPedido(id:number): Observable<void> { return this.http.delete<void>(`${API}/pedidos/${id}`); }
}
