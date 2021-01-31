import { DatePipe, Location } from '@angular/common';
import { Component, OnInit, Pipe, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Convenio } from 'src/app/interfaces/convenios/convenio.interface';
import { Descuento } from 'src/app/interfaces/descuentos/descuento.interface';
import { Foto } from 'src/app/interfaces/foto.interface';
import { Rol } from 'src/app/interfaces/rol.interface';
import { Socio } from 'src/app/interfaces/socios/socio.interface';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { Variable } from 'src/app/interfaces/variable.interface';
import { ConveniosService } from 'src/app/providers/convenios.service';
import { DescuentosService } from 'src/app/providers/descuentos.service';
import { SociosService } from 'src/app/providers/socios.service';
import { UsuariosService } from 'src/app/providers/usuarios.service';
import { ValidadoresService } from 'src/app/providers/validadores.service';
import { VariablesService } from 'src/app/providers/variables.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-descuentos',
  templateUrl: './form-descuentos.component.html',
  styleUrls: ['./form-descuentos.component.scss']
})
export class FormDescuentosComponent implements OnInit {

  cuotas: number[] = [1,2,3,4,5,6,7,8,9,10,11,12];

  convenio!: Convenio;

  socio!: Socio;

  mostrarModalComercios = false;

  mostrarModalSocios = false;

  convenios: Convenio[] = [];

  socios: Socio[] = [];

  guardado: boolean = true;

  guardando: boolean = false;

  form!: FormGroup;

  editar: boolean = false;

  descuento!: Descuento;
  
  today = new DatePipe('es').transform(new Date(), 'yyyy-MM-ddTHH:mm');

  variables!: Variable[];

  comision!: number;


  constructor(  private fb: FormBuilder,
                private route: ActivatedRoute,
                private location: Location,
                private descuentosService: DescuentosService,
                private sociosService: SociosService,
                private conveniosService: ConveniosService,
                private usuariosService: UsuariosService,
                private validadoresService: ValidadoresService,
                private variablesService: VariablesService) { }

  ngOnInit(): void {

    this.crearForm();
  

    this.getVariables();

    

    const { id } = this.route.snapshot.params;
    
    if (id) {
      
      this.editar = true;

      this.descuentosService.getDescuento(id).subscribe( res => {
        
        console.log(res);
        
        this.descuento = res;
        
        if(this.descuento.convenio) {
          let foto: Foto = { id: 0, url: '', publicId: ''};
          let rol: Rol = { id: 0, authority: ''}
          let usuario: Usuario = {id: 0, nombreUsuario: '', contrasena: '', fechaAlta: '', fechaBaja: '', rol }
          this.descuento.convenio.usuario = usuario;
          this.descuento.convenio.foto = foto; 
          
        }
        if(res.convenio){
          this.convenio = res.convenio;
        }
        this.socio =res.socio;


        if(!this.descuento.socio.foto){
          let foto: Foto = { id: 0, url: '', publicId: ''};
          
          this.descuento.socio.foto = foto;          
          
        }
        
        let fechaAlta = new DatePipe('es').transform( this.descuento.fechaAlta, 'yyyy-MM-ddTHH:mm');
        

        if(fechaAlta){
          this.descuento.fechaAlta = fechaAlta;
        }

        if(!this.descuento.valorCuota){
          this.descuento.valorCuota = this.descuento.valorTotal;

        }



        this.form.setValue(this.descuento);
        
        
      });
      
    }
  }


  listarConvenios(){
    this.mostrarModalComercios = true;
    this.conveniosService.getConvenios().subscribe(res => {
      
      res.forEach( convenio => {

        if(convenio.id == 1){

          res.splice(0,1);
        }
      })
      this.convenios = res;
    });

  }
  seleccionarConvenio(convenio: Convenio){

    this.convenios.find(element => {
      element = convenio;
      this.convenio = convenio;
      
      this.form.controls['convenio'].patchValue({
                                                  id: element.id, 
                                                  nombre: element.nombre,
                                                  direccion: element.direccion,
                                                  cuit: element.cuit,
                                                  contacto: element.contacto
                                                })
    });

    
  }

  listarSocios(){
    this.mostrarModalSocios = true;
    this.sociosService.getSocios().subscribe(res => this.socios = res);

  }

  seleccionarSocio(socio: Socio){
    this.socios.find( element => {

      element = socio;
      this.socio = socio;

      this.form.controls['socio'].patchValue({
                                                id: element.id, 
                                                nombre: element.nombre,
                                                apellido: element.apellido,
                                                numDoc: element.numDoc,
                                                legajo: element.legajo
                                              })   
    })
  }

  buscar(param: string){
    if(param.length > 0){
      this.sociosService.buscarSocios(param).subscribe(res => this.socios = res);
    }else {
      this.listarSocios();
    }
  }

  getVariables(){
    this.variablesService.getVariables().subscribe(res => {
      
      
      this.comision = (res[1].valor / 100) + 1 ;
      
      console.log(this.comision);
      
    })
  }

  guardar(){
    

    console.log(this.form.value);

    if( this.form.invalid ) {

      return Object.values( this.form.controls ).forEach( control => {
        
        if( control instanceof FormGroup ) {
          Object.values( control.controls ).forEach( control => control.markAllAsTouched);
        }
        control.markAllAsTouched();
        console.log( this.form );
        
      });
      
    }

   

    
    

    this.form.controls['valorCuota'].setValue((this.form.controls['valorTotal'].value / this.form.controls['numCuotas'].value ) * this.comision );
    this.form.controls['valorTotal'].setValue(this.form.controls['valorTotal'].value * this.comision );
    


    
    this.guardando = true;

    if (this.editar) {
      this.descuentosService.editarDescuento(this.form.value).subscribe();
    } else {
      this.descuentosService.crearDescuento(this.form.value).subscribe();
    }

    this.guardado = true;

    Swal.fire({
      title: `Descuento de $${this.form.controls['valorTotal'].value} guardado con éxito!`,
      icon: 'success',
      confirmButtonText: 'OK',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-outline-primary',
      },
    })

    /* this.location.back(); */
  }

  volver() {
    this.location.back();
  }


  get descNoValido() {
    return this.form.get('descripcion')?.invalid && this.form.get('descripcion')?.touched;
  }
  get cuotasNoValido() {
    return this.form.get('numCuotas')?.invalid && this.form.get('numCuotas')?.touched;

  }
  get valorTotalNoValido() {
    return this.form.get('valorTotal')?.invalid && this.form.get('valorTotal')?.touched;

  }
  get fechaAltaNoValido() {
    return this.form.get('fechaAlta')?.invalid && this.form.get('fechaAlta')?.touched;

  }
  get socioNoValido() {
    return this.form.get('socio.id')?.invalid && this.form.get('socio.id')?.touched && this.form.get('socio.id')?.errors?.distintoCero;
  }
  get convenioNoValido() {
    return this.form.get('convenio.id')?.invalid && this.form.get('convenio.id')?.touched && this.form.get('convenio.id')?.errors?.distintoCero;
  }

  crearForm() {
    this.form = this.fb.group({
      id: [''],
      descripcion: ['', [Validators.required]],
      numCuotas: ['', [Validators.required]],
      ultimaCuota: [''],
      valorCuota: [],
      valorTotal: ['', [Validators.required]],
      fechaAlta: [this.today , [Validators.required]],
      cuotas: [],
      items: [],
      socio: this.fb.group({
        id: [0, this.validadoresService.distintoCero(/^[0]+/)],
        numDoc: [''],
        nombre: [''],
        apellido: [''],
        legajo: [''],
       
        correo: [''],
        fechaAlta: [],
        fechaBaja: [],
        direccion: [],
        baja: [],
        extranjero: [],
        fechaIngresoLaboral: [],
        fechaNacimiento: [],
        motivoBaja: [],
        numCuenta: [],
        telefono: [],
        cuil: [],
        foto: this.fb.group({
          id: [],
          publicId: [],
          url: [],
        }),
        cuotaSocial: this.fb.group({
          id: [],
          nombre: [],
          valor: [],
        }),
        usuario: this.fb.group({
          id: [],
          nombreUsuario: [],
          contraseña: [],
          fechaAlta: [],
          fechaBaja: [],
          rol: this.fb.group({
            id: [],
            authority: [],
          }),
        }),
        localidad: this.fb.group({
          id: [],
          nombre: [],
          cp: [],
        }),
        tipoDocumento: this.fb.group({
          id: [],
          nombre: [],
        }),
        tipo: this.fb.group({
          id: [],
          nombre: [''],
        }),
        estadoCivil: this.fb.group({
          id: [],
          nombre: [],
        }),

      }),
      convenio: this.fb.group({
        id: [0, this.validadoresService.distintoCero(/^[0]+/)],
        nombre: [''],
        direccion: [''],
        cuit: [''],
        contacto: [''],
      
        correo: [],
        fechaAlta: [],
        fechaBaja: [],
        baja: [],
        telefono: [],
    
        usuario: this.fb.group({
          id: [],
          nombreUsuario: [],
          contraseña: [],
          fechaAlta: [],
          fechaBaja: [],
          rol: this.fb.group({
            id: [],
            authority: [],
          }),
        }),
        foto: this.fb.group({
          id: [],
          publicId: [],
          url: [],
        }),
        localidad: this.fb.group({
          id: [],
          nombre: [],
          cp: [],
        }),
        categoria: this.fb.group({
          id: [],
          nombre: [],
        }),
      }),
      
    });
  }

}
