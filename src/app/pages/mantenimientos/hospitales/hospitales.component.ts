import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Hospital } from 'src/app/models/hospital.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  // Voy a crear una propiedad que me permita mostrar los hospitales, y va ser un arreglo vacio para empezar
  public hospitales: Hospital[] = []; 
  
  // también voy a dejar una bandera
  public cargando: boolean = true;
  private imgSubs: Subscription

  // public usuarios: Usuario[] = [];
  // public usuariosTemp: Usuario[] = [];

  constructor( private hospitalService: HospitalService,
               private modalImagenService: ModalImagenService,
               private busquedasService: BusquedasService) { }

  ngOnDestroy(): void {
    // Con esto prevengo una fuga de memoria
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales();

    // Aquí actualizamos el grid
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe( img => this.cargarHospitales() );
  }


  buscar( termino: string ) {

    if ( termino.length === 0 ) {
      // return this.hospitales = this.hospitalesTemp;
      return this.cargarHospitales()
    }

    this.busquedasService.buscar( 'hospitales', termino )
        .subscribe( resp => {

          this.hospitales = resp;

        });
  }


  // voy a centralizar esto en un método independiente
  cargarHospitales(){
    this.cargando = true;

    this.hospitalService.cargarHospitales()
        .subscribe( hospitales => {
          // console.log(hospitales); // Deberiamos ser capaces de ver la respuesta
          this.cargando = false;
          // la propiedad de la clase va a ser igual a los hospitales que vienen en el servicio
          this.hospitales = hospitales;
    });
  }

  guardarCambios(hospital: Hospital) {
    // Imprimamos en consola el hospital para asegurarnos de que todo funcione
    // console.log(hospital);

    this.hospitalService.actualizarHospital(hospital._id, hospital.nombre)
        .subscribe( resp=> {
          Swal.fire('Actualizado', hospital.nombre, 'success');
        });

  }

  eliminarCambios(hospital: Hospital) {
    
    this.hospitalService.borrarHospital(hospital._id,)
        .subscribe( resp=> {
          this.cargarHospitales();
          Swal.fire('Borrado', hospital.nombre, 'success');
        });

  }

  async abrirSweetAlert(){
    const {value = ''} = await Swal.fire<string>({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Enter the URL',
      showCancelButton: true,
    })
    
    // console.log(value);
    if(value.trim().length > 0){
      this.hospitalService.crearHospital( value )
          .subscribe( (resp: any) => {
            // console.log(resp);
            this.hospitales.push(resp.hospital)
          })
    }
  }

  abrirModal(hospital: Hospital){
    this.modalImagenService.abrirModal('hospitales', hospital._id, hospital.img );
  }


  

}
