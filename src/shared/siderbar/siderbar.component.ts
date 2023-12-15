import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, HostListener } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { UserService } from 'src/app/services/user.service';


export interface NavItem {
  displayName: string;
  disabled?: boolean;
  iconName: string;
  estado?: boolean;
  route?: string;
  children?: NavItem[];
}
@Component({
  selector: 'app-siderbar',
  templateUrl: './siderbar.component.html',
  styleUrls: ['./siderbar.component.css']
})
export class SiderbarComponent {

  public menutoogle?: boolean;
  public mobile?: boolean;
  public isMenuInitOpen?: boolean;
  public isMenuOpen: boolean = true;
  public contentMargin: number = 240;
  public isFullScreenOpen = false;
  public session_ls: any = undefined;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public modals: MatDialog,
    private s_user: UserService,
    private router: Router,

  ) { }
  async ngOnInit() {
    this.isMenuOpen = true;
    this.session_ls = this.s_user.session_ls();

    if (!this.session_ls) {
      this.router.navigate(['/']);
      return;
    }
  }
  close() {
    localStorage.removeItem('session');
    this.router.navigate(['/']);
  }

  get isHandset(): boolean {
    return this.breakpointObserver.isMatched(Breakpoints.Handset);
  }
  ngDoCheck() {
    if (this.isHandset) {
      this.isMenuOpen = false;
    } else {
      this.isMenuOpen = true;
    }
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  setStep(item: NavItem) {
    this.menu.forEach(el => el.estado = false);
    item.estado = true;
  }


  @HostListener('window:keydown', ['$event'])
  handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'F11') {
      event.preventDefault();
      this.toggleFullScreen();
    }
  }

  toggleFullScreen() {
    const doc = window.document;
    const docEl = doc.documentElement;
    const requestFullScreen = docEl.requestFullscreen || docEl.requestFullscreen || docEl.requestFullscreen || docEl.requestFullscreen;
    const exitFullScreen = doc.exitFullscreen || doc.exitFullscreen || doc.exitFullscreen;

    if (!doc.fullscreenElement && !doc.fullscreenElement && !doc.fullscreenElement && !doc.fullscreenElement) {
      requestFullScreen.call(docEl);
      this.isFullScreenOpen = true;
    } else {
      exitFullScreen.call(doc);
      this.isFullScreenOpen = false;
    }
  }

  menu: NavItem[] = [
    {
      displayName: 'Panel de Inicio',
      iconName: ' <i class="bx bx-home"></i> ',
      route: '/dashboard/bienvenido',
    },
    {
      displayName: 'Reporte Guias',
      iconName: '<i class="bx bx-server" ></i>',
      route: '/dashboard/dashboard',
    },
    {
      displayName: 'Usuarios',
      iconName: '<i class="bx bx-user"></i>',
      route: '/dashboard/usuarios',
    },
    {
      displayName: 'Concesiones',
      iconName: '<i class="bx bx-map-pin"></i>',
      route: '/dashboard/recargas',
    },
    // {
    //   displayName: 'Concesiones',
    //   iconName: '<i class="bx bx-map-pin"></i>',
    //   estado: false,
    //   route: 'mypages',
    //   children: [
    //     {
    //       displayName: 'Consultas',
    //       iconName: '<i class="bx bx-radio-circle"></i>',
    //       route: '/dashboard/reporte/consulta',
    //     },

    //     {
    //       displayName: 'Sesiones',
    //       iconName: '<i class="bx bx-radio-circle"></i>',
    //       route: '/dashboard/reporte/sesiones',
    //     },

    //     {
    //       displayName: 'Recargas',
    //       iconName: '<i class="bx bx-radio-circle"></i>',
    //       route: '/dashboard/reporte/recargas',
    //     },
    //   ]
    // },
  ];
}


