import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service';

interface Automacao {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  icone: string;
  perfis: ('servidor' | 'advogado')[];
  ativa: boolean;
  cliquesEconomizados: number;
  execucoes: number;
  tag?: string;
}

const AUTOMACOES: Automacao[] = [
  {
    id: 1, titulo: 'Assinatura em Lote',
    descricao: 'Assina múltiplos documentos de uma só vez sem precisar abrir cada processo individualmente.',
    categoria: 'Documentos', icone: 'pi-pen-to-square',
    perfis: ['servidor'], ativa: true, cliquesEconomizados: 847, execucoes: 212, tag: 'Popular'
  },
  {
    id: 2, titulo: 'Movimentação Automática',
    descricao: 'Encaminha o processo para a próxima fase com base em regras configuradas.',
    categoria: 'Processos', icone: 'pi-forward',
    perfis: ['servidor'], ativa: true, cliquesEconomizados: 430, execucoes: 86
  },
  {
    id: 3, titulo: 'Resposta Padrão a Intimações',
    descricao: 'Detecta intimações rotineiras e gera minutas de resposta com dados do processo preenchidos.',
    categoria: 'Intimações', icone: 'pi-reply',
    perfis: ['servidor', 'advogado'], ativa: false, cliquesEconomizados: 0, execucoes: 0, tag: 'Novo'
  },
  {
    id: 4, titulo: 'Emissão de Certidão de Prazo',
    descricao: 'Emite certidões de prazo automaticamente ao detectar o fim de contagem.',
    categoria: 'Documentos', icone: 'pi-file-check',
    perfis: ['servidor'], ativa: true, cliquesEconomizados: 204, execucoes: 51
  },
  {
    id: 5, titulo: 'Preenchimento Automático de Campos',
    descricao: 'Memoriza padrões e autocompleta campos repetitivos em formulários do PJe.',
    categoria: 'Formulários', icone: 'pi-pencil',
    perfis: ['servidor', 'advogado'], ativa: true, cliquesEconomizados: 1203, execucoes: 401, tag: 'Popular'
  },
  {
    id: 6, titulo: 'Peticionamento em Lote',
    descricao: 'Envia a mesma peça para múltiplos processos com geração automática de protocolo.',
    categoria: 'Petições', icone: 'pi-send',
    perfis: ['advogado'], ativa: false, cliquesEconomizados: 0, execucoes: 0, tag: 'Novo'
  },
  {
    id: 7, titulo: 'Monitor de Prazos',
    descricao: 'Exibe contador visual de prazos na lista de processos, destacando os críticos.',
    categoria: 'Prazos', icone: 'pi-clock',
    perfis: ['advogado', 'servidor'], ativa: true, cliquesEconomizados: 96, execucoes: 320
  },
  {
    id: 8, titulo: 'Consulta Rápida de Movimentações',
    descricao: 'Consolida as últimas movimentações de todos os processos em uma visão única.',
    categoria: 'Processos', icone: 'pi-list',
    perfis: ['advogado'], ativa: false, cliquesEconomizados: 0, execucoes: 0
  }
];

@Component({
  selector: 'app-automacoes',
  standalone: true,
  imports: [CommonModule, FormsModule, InputSwitchModule, ToastModule, TooltipModule],
  providers: [MessageService],
  template: `
    <p-toast position="top-right"></p-toast>

    <!-- Stats -->
    <div class="stats-banner">
      <div class="stat-item">
        <div class="stat-value">{{ totalCliques() }}</div>
        <div class="stat-label">Cliques Economizados</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ totalAtivas() }}</div>
        <div class="stat-label">Ativas</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ totalExecucoes() }}</div>
        <div class="stat-label">Execuções</div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="filter-chips">
      @for (cat of categorias(); track cat) {
        <span class="chip" [class.active]="filtroAtivo() === cat" (click)="setFiltro(cat)">
          {{ cat }}
        </span>
      }
    </div>

    <!-- Lista -->
    @for (auto of automacoesFiltradas(); track auto.id) {
      <div class="auto-card" [class.active-card]="auto.ativa" [class.inactive-card]="!auto.ativa">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:0.5rem;">
          <div style="display:flex;align-items:flex-start;gap:0.5rem;flex:1;">
            <i class="pi {{ auto.icone }} auto-card-icon"></i>
            <div style="flex:1;">
              <div class="auto-card-title">
                {{ auto.titulo }}
                @if (auto.tag) {
                  <span
                    [style.background]="auto.tag === 'Novo' ? '#fff3cd' : '#d1ecf1'"
                    [style.color]="auto.tag === 'Novo' ? '#856404' : '#0c5460'"
                    style="font-size:0.6rem;font-weight:700;padding:1px 6px;border-radius:10px;margin-left:6px;vertical-align:middle;">
                    {{ auto.tag }}
                  </span>
                }
              </div>
              <div class="auto-card-desc">{{ auto.descricao }}</div>
            </div>
          </div>
          <p-inputSwitch
            [(ngModel)]="auto.ativa"
            (onChange)="onToggle(auto)"
            pTooltip="{{ auto.ativa ? 'Desativar' : 'Ativar' }}"
            tooltipPosition="left">
          </p-inputSwitch>
        </div>

        <div class="auto-card-footer">
          <span class="auto-card-stat">
            <i class="pi pi-bolt"></i>
            {{ auto.cliquesEconomizados }} cliques economizados
          </span>
          <span class="auto-card-stat" style="margin-left:auto;">
            <i class="pi pi-tag" style="color:#6c757d;"></i>
            {{ auto.categoria }}
          </span>
        </div>
      </div>
    }

    @if (automacoesFiltradas().length === 0) {
      <div style="text-align:center;padding:2rem;color:#6c757d;">
        <i class="pi pi-inbox" style="font-size:2rem;display:block;margin-bottom:0.5rem;color:#ced4da;"></i>
        Nenhuma automação neste filtro.
      </div>
    }
  `
})
export class AutomacoesComponent {
  private perfil = this.userService.user().perfil;

  automacoes = signal<Automacao[]>(
    AUTOMACOES.filter(a => a.perfis.includes(this.perfil))
  );

  filtroAtivo = signal('Todas');

  categorias = computed(() =>
    ['Todas', ...new Set(this.automacoes().map(a => a.categoria))]
  );

  automacoesFiltradas = computed(() => {
    const f = this.filtroAtivo();
    return f === 'Todas' ? this.automacoes() : this.automacoes().filter(a => a.categoria === f);
  });

  totalAtivas    = computed(() => this.automacoes().filter(a => a.ativa).length);
  totalCliques   = computed(() => this.automacoes().reduce((s, a) => s + a.cliquesEconomizados, 0));
  totalExecucoes = computed(() => this.automacoes().reduce((s, a) => s + a.execucoes, 0));

  constructor(private userService: UserService, private messageService: MessageService) {}

  setFiltro(cat: string) { this.filtroAtivo.set(cat); }

  onToggle(auto: Automacao) {
    this.messageService.add(auto.ativa
      ? { severity: 'success', summary: 'Ativada',    detail: `"${auto.titulo}" está ativa.`,     life: 2500 }
      : { severity: 'info',    summary: 'Desativada', detail: `"${auto.titulo}" foi desativada.`, life: 2500 }
    );
  }
}
