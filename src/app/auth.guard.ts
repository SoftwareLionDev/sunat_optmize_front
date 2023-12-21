import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  
  const ruta_path = route.routeConfig?.path;

  let ls_session = localStorage.getItem('session');
  let data_session = ls_session ? JSON.parse(ls_session) : null;

  if(!ls_session){
    console.log();
    return false;
  }

  const permisos = [
    {
      role: "ADMINISTRADOR",
      views: [
        "bienvenido",
        "dashboard",
        "usuarios",
        "concesiones"
      ]
    },
    {
      role: "SUPERVISOR",
      views: [
        "bienvenido",
        "dashboard",
        "concesiones"
      ]
    },
    {
      role: "NORMAL",
      views: [
        "bienvenido",
        "dashboard"
      ]
    }
  ];

  const role_data = permisos.filter(x => x.role == data_session.role_name.toUpperCase())[0];

  return role_data.views.filter(x => x == ruta_path).length > 0;
};
