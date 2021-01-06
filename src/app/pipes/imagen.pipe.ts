import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

   /* 
   Un pipe me sirve para transformar la forma visual de como recibo la información
   si yo recibo un string, puedo transformarlo, pero esta transformación solo es visual, los pipes no
   modifican la referencia, ni tampoco modifican el objeto, pipe quiere decir tuberia
   */

  transform(img: string, tipo: 'usuarios' | 'medicos' | 'hospitales'): string {
    // return 'Hola mundo' + img + ' ' + tipo;
    if (!img) {
      return `${base_url}/upload/usuarios/no-image`;
    } else if (img.includes('https')) {
      return img;
    } else if (img) {
      return `${base_url}/upload/${tipo}/${img}`;
    } else {
      return `${base_url}/upload/usuarios/no-image`;
    }
  }

}
