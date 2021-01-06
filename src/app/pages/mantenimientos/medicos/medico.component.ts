import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Medico } from 'src/app/models/medico.model';
import { Hospital } from 'src/app/models/hospital.model';

import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm: FormGroup;
  public hospitales: Hospital[] = [];

  public medicoSeleccionado: Medico;
  public hospitalSeleccionado: Hospital;


  constructor( private fb: FormBuilder,
                private hospitalService: HospitalService,
                private medicoService: MedicoService,
                private router: Router,
                private activatedRoute: ActivatedRoute) { }

  /*             
    Aquí voy a establecer la información del medico form
    Gracias a que estamos trabajando con formularios reactivos, yo puedo crear un observable 
    que este pendiente de este hospital, mediante el valueChanges a cual me puedo subscribir, puedo obtener el Id
    desestructurando los params
  */
  ngOnInit(): void {

    this.activatedRoute.params
        .subscribe( ({ id }) =>  this.cargarMedico(id) );

    this.medicoForm = this.fb.group({
      nombre: [ '', Validators.required ],
      hospital: [ '', Validators.required ],
    });

    this.cargarHospitales();

     this.medicoForm.get('hospital').valueChanges
        .subscribe( hospitalId => {
          // console.log(hospitalId);
          // Esta es una funcion sincrona por que es un arreglo que esta en memoria
          this.hospitalSeleccionado = this.hospitales.find( h => h._id === hospitalId );
          // console.log(this.hospitalSeleccionado);
        })


  }


  /*
   Se me ocurre un método para que el ngOnInit no cresca tanto 
   aquí estoy recibiendo el médico y se lo estoy asignando al médico seleccionado,
   ahora voy a extraer el dos cosas del médico que estoy recibiendo como argumento
  */

  cargarMedico(id: string) {


    if ( id === 'nuevo' ) {
      return;
    }

    // Si no me regresa nada el médico es undefine
    this.medicoService.obtenerMedicoPorId(id)
        .pipe(
          delay(100)
        )
        .subscribe( medico => {

          if ( !medico ) {
            this.router.navigateByUrl(`/dashboard/medicos/`);
          }
          // console.log(medico);
          const { nombre, hospital:{ _id }} = medico;
          // console.log(nombre, _id);      
          this.medicoSeleccionado = medico;
          this.medicoForm.setValue({ nombre, hospital: _id });
        });
  }



  // Creare un método para cargar los hospitales
  cargarHospitales(){
    this.hospitalService.cargarHospitales()
        .subscribe( (hospitales: Hospital[]) => {
          // console.log(hospitales);
          this.hospitales = hospitales;
        })
  }

  guardarMedico(){

    // console.log(this.medicoSeleccionado);
    const {nombre} = this.medicoForm.value;

    if ( this.medicoSeleccionado ) {
      // Actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicoService.actualizarMedico( data )
          .subscribe( resp => {
            // console.log(resp);
            Swal.fire('Actualizado', `${ nombre } actualizado correctamente`, 'success');

          })
    } else {
      // Crear
      this.medicoService.crearMedico( this.medicoForm.value )
          .subscribe( (resp: any) => {
            console.log(resp);
            Swal.fire('Creado', `${ nombre } creado correctamente`, 'success');
            //  Tengo que importar mi router, ahora puedo hacer mi navegación
            this.router.navigateByUrl(`/dashboard/medico/${ resp.medico._id }`)
          })
    }
    }


}
