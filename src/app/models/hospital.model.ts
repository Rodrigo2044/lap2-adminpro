// Esta interface solo me sirve para saber el usuario que creo al hospital
interface _HospitalUser {
    _id:string;
    nombre: string;
    img: string;
}


export class Hospital {
    constructor(
        public nombre: string,
        public _id?: string,
        public img?: string,
        public usuario?: _HospitalUser,

    ){}
}