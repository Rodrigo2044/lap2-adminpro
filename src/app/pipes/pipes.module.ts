/*
  Esta es la instrucción para crear mi modulo independiente en la carpeta de pipes, 
  el --flat es para que me lo cree en el mismo directorio
  ng g m pipes/pipes --flat      
*/

import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { ImagenPipe } from './imagen.pipe';



@NgModule({
  declarations: [ ImagenPipe ],
  exports: [ ImagenPipe ],
  // No voy a ocupar el ngif ngfor y otras directivas de angular por eso borro el common module por eso borro los imports
})
export class PipesModule { }
