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
import { TokenService } from 'src/app/providers/token.service';
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

  convenios: Convenio[] = [];

  socios: Socio[] = [];

  guardado: boolean = true;

  guardando: boolean = false;

  form!: FormGroup;

  editar: boolean = false;

  descuento!: Descuento;
  
  today = new DatePipe('es').transform(new Date(), 'yyyy-MM-ddTHH:mm');

  variables!: Variable[];

  rolComercio = false;

  usuarioLogin!: any;

  socioNoEncontrado = false;

  socioHabilitado = true;


  constructor(  private fb: FormBuilder,
                private route: ActivatedRoute,
                private location: Location,
                private descuentosService: DescuentosService,
                private sociosService: SociosService,
                private conveniosService: ConveniosService,
                private usuariosService: UsuariosService,
                private validadoresService: ValidadoresService,
                private variablesService: VariablesService,
                private tokenService: TokenService) { }

  ngOnInit(): void {

    this.crearForm();

    if(this.tokenService.roles.includes('comercio')){
      this.usuarioLogin = this.tokenService.getUserName();
      this.conveniosService.buscarConvenioPorUsuario(this.usuarioLogin).subscribe(res => {
        
        
        this.convenio = res
        
        this.form.controls['convenio'].patchValue({'id':res.id});
        this.form.controls['convenio'].patchValue({'nombre':res.nombre});
        this.form.controls['convenio'].patchValue({'direccion':res.direccion});
        this.form.controls['convenio'].patchValue({'cuit':res.cuit});
        this.form.controls['convenio'].patchValue({'contacto':res.contacto});
      
      });

      this.rolComercio = true;
    }



    const { id } = this.route.snapshot.params;
    
    if (id) {
      
      this.editar = true;

      this.descuentosService.getDescuento(id).subscribe( res => {
        
        this.descuento = res;
        
        if(this.descuento.convenio) {
          let foto: Foto = { id: 0, url: '', publicId: ''};
          let rol: Rol = { id: 0, nombreRol: ''}
          let usuario: Usuario = {id: 0, nombreUsuario: '', contrasena: '', fechaAlta: '', fechaBaja: '', rol , baja: false }
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
      this.sociosService.buscarSocioPorDoc(param).subscribe((res : any) => {
        
        if(res){
          this.socioNoEncontrado = false;
          
          if(!res.habilitado){
            this.socioHabilitado = false;
          }else {
            
            this.socio = res
            this.form.controls['socio'].patchValue({
                                                      id: res.id, 
                                                      nombre: res.nombre,
                                                      apellido: res.apellido,
                                                      numDoc: res.numDoc,
                                                      legajo: res.legajo
                                                    })
          }
        } else {
          this.socioNoEncontrado = true;
        }
      })
    }
  }

  guardar(){
    
    if( this.form.invalid ) {

      return Object.values( this.form.controls ).forEach( control => {
        
        if( control instanceof FormGroup ) {
          Object.values( control.controls ).forEach( control => control.markAllAsTouched);
        }
        control.markAllAsTouched();
        
      });
      
    }
    
    this.guardando = true;

    if (this.editar) {
      this.descuentosService.editarDescuento(this.form.value).subscribe();
    } else {
      this.descuentosService.crearDescuento(this.form.value).subscribe();
    }

    this.guardado = true;

    Swal.fire({
      title: `Descuento: $${this.form.controls['valorSubTotal'].value} 
              ${this.socio.apellido}, ${this.socio.nombre}
              ¡Guardado con éxito!`,
      icon: 'success',
      confirmButtonText: 'OK',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-outline-primary',
      },
    })/* .then((result) => {
  
    }); */
    if(this.rolComercio){
      window.location.reload();   
    }else{
      this.location.back();   
    }
    /* if(!this.rolComercio){
    } */
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
      valorSubTotal: ['', [Validators.required]],
      valorTotal: [],
      fechaAlta: [this.today , [Validators.required]],
      cuotas: [],
      items: [],
      socio: this.fb.group({
        id: [0, this.validadoresService.distintoCero(/^[0]+/)],
        numDoc: [''],
        nombre: [''],
        apellido: [''],
        legajo: [''],
        seguroVida: [],
        cuotaDeporte: [],
        correo: [''],
        fechaAlta: [],
        fechaBaja: [],
        direccion: [],
        baja: [],
        habilitado: [],
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
          contrasena: [],
          fechaAlta: [],
          fechaBaja: [],
          baja: [],
          rol: this.fb.group({
            id: [],
            nombreRol: [],
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
          contrasena: [],
          fechaAlta: [],
          fechaBaja: [],
          baja: [],
          rol: this.fb.group({
            id: [],
            nombreRol: [],
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
