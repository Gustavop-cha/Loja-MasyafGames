import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CestaService } from '../cesta/cesta-service';
import { AuthService } from '../core/auth';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  router = inject(Router);
  cesta = inject(CestaService);
  auth = inject(AuthService);

  buscar(evento: Event, texto: string) {
    evento.preventDefault();
    this.router.navigate(['/busca'], { queryParams: { q: texto } });
  }

  sair() {
    this.auth.sair();
    this.router.navigate(['/']);
  }
}
