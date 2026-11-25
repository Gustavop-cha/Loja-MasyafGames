import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Usuario } from './api';

const CHAVE_USUARIO = 'masyaf-usuario';

/** Guarda o usuário logado (retornado por POST /api/auth/login) no navegador. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  usuario = signal<Usuario | null>(this.carregar());
  logado = computed(() => this.usuario() !== null);
  admin = computed(() => this.usuario()?.admin === true);

  private carregar(): Usuario | null {
    if (!this.isBrowser) return null;
    const salvo = localStorage.getItem(CHAVE_USUARIO);
    return salvo ? JSON.parse(salvo) : null;
  }

  entrar(usuario: Usuario) {
    if (this.isBrowser) localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));
    this.usuario.set(usuario);
  }

  sair() {
    if (this.isBrowser) localStorage.removeItem(CHAVE_USUARIO);
    this.usuario.set(null);
  }
}
