import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, filter, map } from 'rxjs';
import { AppConfig } from 'src/app/config';
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
  year: number = new Date().getFullYear();
  selectedItem: string = 'PANEL DE INICIO';
  public menutoogle?: boolean;
  public mobile?: boolean;
  public isMenuInitOpen?: boolean;
  public isMenuOpen: boolean = true;
  public contentMargin: number = 240;
  public isFullScreenOpen = false;
  public session_ls: any = undefined;
  public menu: NavItem[] = [];

  constructor(
    private breakpointObserver: BreakpointObserver,
    public modals: MatDialog,
    private s_user: UserService,
    private router: Router,
    private route: Router,
    private http: HttpClient
  ) {
    console.log('gola cons');
  }

  async ngOnInit() {
    let r_config = await this.http.get('assets/config.json').toPromise();
    let config = r_config as { apiUrl: string };
    AppConfig.url_api = config.apiUrl;

    this.isMenuOpen = true;
    this.session_ls = this.s_user.session_ls();

    if (!this.session_ls) {
      this.router.navigate(['/']);
      return;
    }

    console.log(this.route.url);

    this.menu.push({
      displayName: 'Panel de Inicio',
      iconName: ' <i class="bx bx-home"></i> ',
      route: '/dashboard/bienvenido',
    }, {
      displayName: 'Reporte GRE',
      iconName: '<i class="bx bx-server" ></i>',
      route: '/dashboard/dashboard',
    }

    )

    if (this.session_ls.role_name.toUpperCase() == "ADMINISTRADOR") {
      this.menu.push({
        displayName: 'Usuarios',
        iconName: '<i class="bx bx-user"></i>',
        route: '/dashboard/usuarios',
      });
    }

    if (this.session_ls.role_name.toUpperCase() == "ADMINISTRADOR" || this.session_ls.role_name.toUpperCase() == "SUPERVISOR") {
      this.menu.push({
        displayName: 'Concesiones',
        iconName: '<i class="bx bx-map-pin"></i>',
        route: '/dashboard/concesiones',
      })
    }

    if (this.session_ls.role_name.toUpperCase() != "ADMINISTRADOR" && this.route.url == '/dashboard/usuarios') {
      this.route.navigate(['/dashboard/dashboard']);
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

  onSelectItem(item: string): void {
    this.selectedItem = item;
  }


}


