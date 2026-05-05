import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UserService, UserPerfil } from '../../services/user.service';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [CommonModule, FormsModule, InputSwitchModule, DropdownModule, DividerModule, ToastModule],
  providers: [MessageService],
  template: `
    <p-toast position="top-right"></p-toast>

    <!-- Perfil -->
    <p class="section-title"><i class="pi pi-user" style="margin-right:4px;"></i>Perfil</p>
    <div class="config-group">
      <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.875rem;">
        <div class="farol-avatar" style="width:44px;height:44px;font-size:1rem;">
          {{ user().initials }}
        </div>
        <div>
          <div style="font-weight:600;font-size:0.875rem;">{{ user().nome }}</div>
          <div style="font-size:0.75rem;color:#6c757d;">{{ user().tribunal }}</div>
        </div>
        <span
          [style.background]="user().perfil === 'servidor' ? 'var(--farol-navy)' : '#6f42c1'"
          style="margin-left:auto;color:#fff;font-size:0.65rem;font-weight:700;padding:3px 10px;border-radius:10px;">
          {{ user().perfil === 'servidor' ? 'Servidor' : 'Advogado(a)' }}
        </span>
      </div>

      <div class="config-row">
        <div>
          <div class="config-label">Perfil de uso</div>
          <div class="config-sub">Altera as automações disponíveis</div>
        </div>
        <p-dropdown
          [(ngModel)]="perfilSelecionado"
          [options]="perfisOptions"
          (onChange)="onPerfilChange($event)"
          [style]="{'width':'130px'}">
        </p-dropdown>
      </div>

      <div class="config-row">
        <div>
          <div class="config-label">Tribunal</div>
          <div class="config-sub">Sistema PJe em uso</div>
        </div>
        <p-dropdown
          [(ngModel)]="tribunalSelecionado"
          [options]="tribunaisOptions"
          [style]="{'width':'130px'}">
        </p-dropdown>
      </div>
    </div>

    <!-- Notificações -->
    <p class="section-title" style="margin-top:0.875rem;"><i class="pi pi-bell" style="margin-right:4px;"></i>Notificações</p>
    <div class="config-group">
      <div class="config-row">
        <div>
          <div class="config-label">Alertas de execução</div>
          <div class="config-sub">Notifica quando uma automação roda</div>
        </div>
        <p-inputSwitch [(ngModel)]="cfg.alertasExecucao"></p-inputSwitch>
      </div>
      <div class="config-row">
        <div>
          <div class="config-label">Alertas de prazo</div>
          <div class="config-sub">Avisa sobre prazos próximos do vencimento</div>
        </div>
        <p-inputSwitch [(ngModel)]="cfg.alertasPrazo"></p-inputSwitch>
      </div>
      <div class="config-row">
        <div>
          <div class="config-label">Resumo diário</div>
          <div class="config-sub">Relatório das automações do dia</div>
        </div>
        <p-inputSwitch [(ngModel)]="cfg.resumoDiario"></p-inputSwitch>
      </div>
    </div>

    <!-- Comportamento -->
    <p class="section-title" style="margin-top:0.875rem;"><i class="pi pi-sliders-h" style="margin-right:4px;"></i>Comportamento</p>
    <div class="config-group">
      <div class="config-row">
        <div>
          <div class="config-label">Execução silenciosa</div>
          <div class="config-sub">Roda automações sem confirmação</div>
        </div>
        <p-inputSwitch [(ngModel)]="cfg.execucaoSilenciosa"></p-inputSwitch>
      </div>
      <div class="config-row">
        <div>
          <div class="config-label">Modo seguro</div>
          <div class="config-sub">Sempre pede confirmação antes de enviar</div>
        </div>
        <p-inputSwitch [(ngModel)]="cfg.modoSeguro"></p-inputSwitch>
      </div>
      <div class="config-row">
        <div>
          <div class="config-label">Iniciar com o PJe</div>
          <div class="config-sub">Abre o painel ao detectar o PJe</div>
        </div>
        <p-inputSwitch [(ngModel)]="cfg.iniciarComPje"></p-inputSwitch>
      </div>
    </div>

    <!-- Atalhos -->
    <p class="section-title" style="margin-top:0.875rem;"><i class="pi pi-desktop" style="margin-right:4px;"></i>Atalhos de Teclado</p>
    <div class="config-group">
      @for (atalho of atalhos; track atalho.acao) {
        <div class="config-row">
          <div class="config-label">{{ atalho.acao }}</div>
          <kbd style="background:#f1f3f5;border:1px solid #dee2e6;border-radius:4px;padding:2px 8px;font-size:0.72rem;font-family:monospace;color:#495057;">
            {{ atalho.tecla }}
          </kbd>
        </div>
      }
    </div>

    <!-- Sobre -->
    <p class="section-title" style="margin-top:0.875rem;"><i class="pi pi-info-circle" style="margin-right:4px;"></i>Sobre</p>
    <div class="config-group" style="font-size:0.75rem;color:#6c757d;line-height:2;">
      <div style="display:flex;justify-content:space-between;"><span>Versão</span><strong style="color:#212529;">1.0.0-beta</strong></div>
      <div style="display:flex;justify-content:space-between;"><span>Compatibilidade</span><strong style="color:#212529;">PJe 2.x / 3.x</strong></div>
      <div style="display:flex;justify-content:space-between;"><span>Desenvolvido por</span><strong style="color:#212529;">TJPB · Inovação</strong></div>
    </div>

    <!-- Salvar -->
    <div style="margin-top:1rem;">
      <button
        style="width:100%;background:var(--farol-navy);color:#fff;border:none;border-radius:8px;padding:0.625rem;font-size:0.8rem;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:0.5rem;"
        (click)="salvar()">
        <i class="pi pi-check"></i> Salvar Configurações
      </button>
    </div>
  `
})
export class ConfiguracoesComponent {
  user;
  perfilSelecionado: UserPerfil;
  tribunalSelecionado: string;

  perfisOptions = [
    { label: 'Servidor',    value: 'servidor' as UserPerfil },
    { label: 'Advogado(a)', value: 'advogado' as UserPerfil }
  ];

  tribunaisOptions = [
    { label: 'TJPB', value: 'TJPB' }, { label: 'TJPE', value: 'TJPE' },
    { label: 'TJRN', value: 'TJRN' }, { label: 'TJCE', value: 'TJCE' },
    { label: 'TJMA', value: 'TJMA' }, { label: 'TRF5', value: 'TRF5' }
  ];

  // Objeto simples — sem signal() — para compatibilidade com [(ngModel)]
  cfg = {
    alertasExecucao:    true,
    alertasPrazo:       true,
    resumoDiario:       false,
    execucaoSilenciosa: false,
    modoSeguro:         true,
    iniciarComPje:      true
  };

  atalhos = [
    { acao: 'Abrir/Fechar painel',       tecla: 'Alt + F' },
    { acao: 'Assinar documento ativo',   tecla: 'Alt + S' },
    { acao: 'Próximo processo',          tecla: 'Alt + →' },
    { acao: 'Executar automação rápida', tecla: 'Alt + R' }
  ];

  constructor(private userService: UserService, private messageService: MessageService) {
    this.user = this.userService.user;
    this.perfilSelecionado = this.user().perfil;
    this.tribunalSelecionado = this.user().tribunal;
  }

  onPerfilChange(event: { value: UserPerfil }) {
    this.userService.setPerfil(event.value);
  }

  salvar() {
    this.messageService.add({
      severity: 'success', summary: 'Salvo',
      detail: 'Configurações atualizadas com sucesso.', life: 2500
    });
  }
}
