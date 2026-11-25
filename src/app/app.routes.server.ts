import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Todas as rotas são renderizadas no navegador (CSR).
 * As páginas dependem de dados vivos da API (localhost:8080) e do usuário
 * logado (localStorage). Assim o servidor Angular nunca chama o backend:
 * o `ng serve` e o `ng build` funcionam mesmo com o backend desligado.
 */
export const serverRoutes: ServerRoute[] = [
  { path: '**', renderMode: RenderMode.Client }
];
