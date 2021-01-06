import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Medico } from '../models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor( private http: HttpClient ) { }

  // Como el token lo tengo en le local storage, puedo acceder a el facilmente
  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  cargarMedicos() {

    const url = `${ base_url }/medicos`;
    // Voy a crear un pipe que me ayude con la carga de las imagenes, coloque el tipado en el map
    return this.http.get( url, this.headers )
              .pipe(
                map( (resp: {ok: boolean, medicos: Medico[] }) => resp.medicos)
              );
  }


  /* 
    Voy a crear un pipe que me ayude con la carga de las imagenes, coloque el tipado en el map,
    Sabemos que no es un médico pero luce como un medico 
  */

  obtenerMedicoPorId(id: string){
    const url = `${ base_url }/medicos/${ id }`;
    
    return this.http.get( url, this.headers )
              .pipe(
                map( (resp: {ok: boolean, medico: Medico }) => resp.medico)
              );
  }


  /*
    En la parte de crear médico yo lo puedo mandar completo
    Voy a crear un pipe que me ayude con la carga de las imagenes, coloque el tipado en el 
    El payload que voy a mandar va a ser el médico completo osea el objeto
    Recuerden que si mi backend recibe información adicional, la va a ignorar
  */

  crearMedico( medico: { nombre: string, hospital: string } ) {

    const url = `${ base_url }/medicos`;    
    return this.http.post( url, medico, this.headers );
  }


  // Igualmente puedo recibir el médico
  actualizarMedico( medico: Medico ) {

    const url = `${ base_url }/medicos/${ medico._id }`;
    return this.http.put( url, medico, this.headers );
              
  }

  borrarMedico( _id: string ) {

    const url = `${ base_url }/medicos/${ _id }`;
    return this.http.delete( url, this.headers );
              
  }


}
