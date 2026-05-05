import { Injectable, signal } from '@angular/core';

export type UserPerfil = 'servidor' | 'advogado';

export interface FarolUser {
  nome: string;
  perfil: UserPerfil;
  tribunal: string;
  initials: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  user = signal<FarolUser>({
    nome: 'Carlos Mendes',
    perfil: 'servidor',
    tribunal: 'TJPB',
    initials: 'CM'
  });

  setPerfil(perfil: UserPerfil) {
    const perfis: Record<UserPerfil, FarolUser> = {
      servidor: { nome: 'Carlos Mendes',  perfil: 'servidor', tribunal: 'TJPB',   initials: 'CM' },
      advogado: { nome: 'Dra. Ana Lopes', perfil: 'advogado', tribunal: 'OAB-PB', initials: 'AL' }
    };
    this.user.set(perfis[perfil]);
  }
}
