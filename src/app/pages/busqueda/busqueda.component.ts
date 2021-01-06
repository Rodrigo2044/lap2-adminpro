import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusquedasService } from 'src/app/services/busquedas.service';

import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent implements OnInit {

  /* Voy a crearme un par de propiedades */
  public usuarios: Usuario[] = [];
  public medicos: Medico[] = [];
  public hospitales: Hospital[] = [];
  
  constructor( private activatedRoute: ActivatedRoute,
    private busquedasService: BusquedasService) { }
    
    ngOnInit(): void {
      
      this.activatedRoute.params
      .subscribe( ({termino}) => this.busquedaGlobal( termino ))
    }
    
    
    
    /* Voy a transformar esto de tipo any para que no haya ningun tipo de tipado */
  busquedaGlobal( termino: string ){

    this.busquedasService.busquedaGlobal( termino )
        .subscribe( (resp: any) => {
          console.log(resp);
          this.usuarios = resp.usuarios;
          this.medicos = resp.medicos;
          this.hospitales = resp.hospitales;
        });

  }

  abrirMedico( medico: Medico ) {

  }

}
