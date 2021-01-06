import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

/*
  Voy a ocupar injectar mi usuario service, en un nuevo constructor
*/

constructor(private usuairoService: UsuarioService,
            private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
   
      // Puedo usar una condición ternaria
      console.log('adminguard')


      if( this.usuairoService.role === 'ADMIN_ROLE'){
        return true;
      } else {
        this.router.navigateByUrl('/dashboard');
        return false;
      }
      // return ( this.usuairoService.role === 'ADMIN_ROLE') ? true : false;
  
  }
}