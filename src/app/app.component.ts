import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastModule],
  template: `
    <p-toast position="top-right"></p-toast>

    <div class="farol-shell">

      <!-- Cabeçalho -->
      <div class="farol-header">
        <img src="assets/farol-logo.png" alt="Farol PJe" />
        <div>
          <div class="farol-header-title">Farol PJe</div>
          <div class="farol-header-sub">Automação inteligente para o PJe</div>
        </div>
      </div>

      <!-- Navegação -->
      <nav class="farol-nav">
        <a routerLink="/automacoes" routerLinkActive="active">
          <i class="pi pi-bolt"></i>
          Automações
        </a>
        <a routerLink="/configuracoes" routerLinkActive="active">
          <i class="pi pi-cog"></i>
          Configurações
        </a>
      </nav>

      <!-- Conteúdo -->
      <div class="farol-content">
        <router-outlet></router-outlet>
      </div>

      <!-- Rodapé -->
      <div class="farol-footer">
        <div class="farol-avatar">{{ user().initials }}</div>
        <div>
          <div class="farol-user-name">{{ user().nome }}</div>
          <div class="farol-user-role">
            {{ user().perfil === 'servidor' ? 'Servidor' : 'Advogado(a)' }} · {{ user().tribunal }}
          </div>
        </div>
        <button class="logout-btn" title="Sair">
          <i class="pi pi-sign-out"></i>
        </button>
      </div>
    </div>
  `
})
export class AppComponent {
  user;
  constructor(private userService: UserService) {
    this.user = this.userService.user;
  }
}
