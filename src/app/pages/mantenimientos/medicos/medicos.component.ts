import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Medico } from 'src/app/models/medico.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  // Voy a crear una propiedad que me permita mostrar los médicos, y va ser un arreglo vacio para empezar
  public medicos: Medico[] = []; 
  
  // también voy a dejar una bandera
  public cargando: boolean = true;
  private imgSubs: Subscription

  constructor(private medicoService: MedicoService,
              private modalImagenService: ModalImagenService,
              private busquedasService: BusquedasService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();

    // Aquí actualizamos el grid
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe(img => this.cargarMedicos());

  }


   // voy a centralizar esto en un método independiente
   cargarMedicos(){
    this.cargando = true;

    this.medicoService.cargarMedicos()
        .subscribe( medicos => {
           // console.log(medicos); // Deberiamos ser capaces de ver la respuesta

          this.cargando = false;
          // la propiedad de la clase va a ser igual a los hospitales que vienen en el servicio
          this.medicos = medicos;
    });
  }

  buscar( termino: string ) {

    if ( termino.length === 0 ) {
      // return this.hospitales = this.hospitalesTemp;
      return this.cargarMedicos();
    }

    this.busquedasService.buscar( 'medicos', termino )
        .subscribe( resp => {
          // console.log(resp);
          this.medicos = resp;

        });
  }

  abrirModal(medico: Medico){
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img );
  }

  borrarMedico( medico: Medico){
    Swal.fire({
      title: '¿Borrar médico?',
      text: `Esta a punto de borrar a ${ medico.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.value) {
        
        this.medicoService.borrarMedico( medico._id )
          .subscribe( resp => {
            
            this.cargarMedicos();
            Swal.fire(
              'Médico borrado',
              `${ medico.nombre } fue eliminado correctamente`,
              'success'
            );
            
          });

      }
    })
  }

}
