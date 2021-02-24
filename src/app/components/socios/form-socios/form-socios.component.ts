import {
  Component,
  HostListener,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SociosService } from 'src/app/providers/socios.service';
import { DatePipe, Location } from '@angular/common';

import { WebcamImage } from 'ngx-webcam';
import { Subject, Observable, pipe } from 'rxjs';

import Swal from 'sweetalert2';
import { Socio } from 'src/app/interfaces/socios/socio.interface';
import { ActivatedRoute } from '@angular/router';
import { LocalidadesService } from 'src/app/providers/localidades.service';
import { Localidad } from 'src/app/interfaces/localidad.interface';
import { UsuariosService } from 'src/app/providers/usuarios.service';
import { Rol } from 'src/app/interfaces/rol.interface';
import { TipoDocumento } from 'src/app/interfaces/socios/tipo-documento.interface';
import { EstadoCivil } from 'src/app/interfaces/socios/estado-civil.interface';
import { Tipo } from 'src/app/interfaces/socios/tipo.interface';
import { Foto } from 'src/app/interfaces/foto.interface';
import { FotosService } from 'src/app/providers/fotos.service';
import { VariablesService } from 'src/app/providers/variables.service';
import { ValidadoresService } from 'src/app/providers/validadores.service';
import { DescuentosService } from 'src/app/providers/descuentos.service';


@Component({
  selector: 'app-form',
  templateUrl: './form-socios.component.html',
  styleUrls: ['./form-socios.component.scss'],
})
export class FormSociosComponent implements OnInit, OnDestroy {

  contrasena: string = '';

  socio!: Socio;

  localidades: Localidad[] = [];

  roles: Rol[] = [];

  rol!: Rol;

  subiendo: boolean = false;

  guardado: boolean = true;

  guardando: boolean = false;

  tiposDocumentos: TipoDocumento[] = [];
  tipos: Tipo[] = [];
  estadosCiviles: EstadoCivil[] = [];

  hoy = new DatePipe('es').transform(new Date(), 'yyyy-MM-dd');
  
  trigger: Subject<void> = new Subject<void>();
  
  editar: boolean = false;
  
  activarCamara: boolean = false;
  
  foto!: Foto;

  fotoAnterior!: Foto; 

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private sociosService: SociosService,
    private location: Location,
    private route: ActivatedRoute,
    private localidadesService: LocalidadesService,
    private usuariosService: UsuariosService,
    private variablesService: VariablesService,
    private fotosService: FotosService,
    private validadoresService: ValidadoresService,
    private descuentosService: DescuentosService,
    ) {
      this.crearForm();
    }

  ngOnDestroy(): void {
    if(!this.guardado) {
      this.borrarImagen(this.foto);
    }    
  }

  @HostListener('window:beforeunload')
  onReload() { //windows:beforeunload => antes de recargar

    if(!this.guardado) {
      this.borrarImagen(this.foto);
    }
  }
    
    
  ngOnInit(): void {

    const { id } = this.route.snapshot.params;
    
    if (id) {
      
      this.editar = true;

      this.sociosService.getSocio(id).subscribe((res) => {
        this.socio = res;
      
        this.socio.fechaAlta = this.formatFecha( res.fechaAlta );
        this.socio.fechaBaja = this.formatFecha( res.fechaBaja );
        this.socio.fechaNacimiento = this.formatFecha( res.fechaNacimiento );
        this.socio.fechaIngresoLaboral = this.formatFecha( res.fechaIngresoLaboral );
        
        if(!this.socio.foto){
          let foto: Foto = { id: 0, url: '', publicId: ''};
          
          this.socio.foto = foto;          
          
        }
        
        
        this.socio.baja = res.baja.toString();
        /* this.socio.extranjero = res.extranjero; */
        if(!this.socio.usuario.baja){
          this.socio.usuario.baja = false;
        }
        if(this.socio.foto.id != 0) {
          this.foto = this.fotoAnterior = this.socio.foto;
        }
        
        this.form.setValue(this.socio);
      
            
      });
    } else {
      /* this.cargarDataAlFormulario(); */
    }

    /* this.cargarDataAlFormulario(); */ //TODO: BORRAR

    this.form.controls['usuario'].patchValue({ fechaAlta: this.hoy });

    this.sociosService.getTiposDocumentos().subscribe((res) => {
      this.tiposDocumentos = res;
      this.tiposDocumentos.unshift({
        id: 0,
        nombre: 'Seleccione un tipo',
      });
    });

    this.variablesService.getVariable(1).subscribe( res => {      
      this.form.controls['cuotaSocial'].patchValue({id: res.id, valor: res.valor});
  
    });
    
    this.usuariosService.getRol(3).subscribe(res => this.rol = res);
    
    this.localidadesService.getLocalidades().subscribe((res) => {
      this.localidades = res;
      
      this.localidades.unshift({
        id: 0,
        nombre: 'Seleccione la localidad',
        cp: 0,
      });
    });
    this.sociosService.getTipos().subscribe((res) => {
      this.tipos = res;
      
      this.tipos.unshift({
        id: 0,
        nombre: 'Seleccione la clase',
      });
    });
    this.sociosService.getEstadosCiviles().subscribe((res) => {
      this.estadosCiviles = res;
      
      this.estadosCiviles.unshift({
        id: 0,
        nombre: 'Seleccione el estado civil',
      });
    });
    
    
        
  }
  cambioValor(valor: string) {
    if (valor == 'true') {
      this.form.controls['fechaBaja'].setValue(this.hoy);

      this.form.controls['usuario'].patchValue({ fechaBaja: this.hoy });
    } else {
      this.form.controls['fechaBaja'].setValue('');

      this.form.controls['usuario'].patchValue({ fechaBaja: '' });
    }
  }
      
  formatFecha(fecha: string) {
    let fechaFormat = new DatePipe('es').transform(
      fecha,
      'yyyy-MM-dd',
      'UTC+3'
      );
      
      if (fechaFormat) {
        return fechaFormat;
      } else {
        return '';
      }
  }
        
  // TODO: ARREGLAR IMAGEN
  
  // MANEJO DE WEBCAM
  
  triggerSnapshot(): void {
    this.trigger.next();
    this.activarCamara = false;
  }
  handleImage(webcamImage: WebcamImage): void {
    
    let file = this.webcamImageToFile(
      webcamImage.imageAsDataUrl,
      'image/jpeg'
    );
    this.subirImagen(file);
    
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  webcamImageToFile(webcamUrl: string, type: string): File {
    // convert base64 to raw binary data held in a string
    var byteString = atob(webcamUrl.split(',')[1]);

    // write the bytes of the string to an ArrayBuffer
    var fecha = new Date();
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    // write the ArrayBuffer to a blob, and you're done
    var bb = new Blob([ab], { type: type });

    return new File([ab], 'webcam-foto', {
      type: type,
      lastModified: fecha.getTime(),
    });
  }

  // FIN MANEJO DE WEBCAM

  // INPUT FILE FOTO
  inputFoto() {
    Swal.fire({
      title: 'Seleccione una foto',
      input: 'file',
      inputAttributes: {
        accept: 'image/*',
        'aria-label': 'Suba la foto de perfil',
      },
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Subir',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-outline-primary me-1',
        cancelButton: 'btn btn-outline-danger ms-1',
      },
    }).then((res) => {
      if(res.value){
        this.subirImagen(res.value);
        
      }
    });
  }

  // FIN INPUT FILE FOTO

  subirImagen(file: File){
    this.subiendo = true;

    const tipo = "socio";
    
    if(!this.guardado){
      this.borrarImagen(this.foto);
    }
  
    this.fotosService.subirImagen(file, tipo).subscribe((res: any) => {
      
      this.foto = res;
      this.guardado = false;
      this.form.controls['foto'].patchValue({id: '', publicId: res.publicId, url: res.url});
      this.subiendo = false;
      
    
    });
  }

  borrarImagen(img: Foto) {
    if(this.foto){
      this.fotosService.borrarImagen(img.publicId).subscribe();
    }
  }

  crearUsuarioPass(nombre: string, apellido: string, documento: string, correo: string) {
    this.form.controls['usuario'].patchValue({ nombreUsuario: correo });
    if(nombre != '' && apellido != '' && documento != ''){
    
      
      this.contrasena = nombre.charAt(0).toLowerCase().concat(apellido.charAt(0).toLowerCase()).concat(documento);

      this.form.controls['usuario'].patchValue({contraseña: this.contrasena});
    }
  }

  

  /* asignarFechaAltaUsuario(fecha: string) {
    this.form.controls['usuario'].patchValue({ fechaAlta: fecha });
  }
  asignarFechaBajaUsuario(fecha: string) {
    this.form.controls['usuario'].patchValue({ fechaBaja: fecha });
  }
 */
  guardar() {

    this.form.controls['usuario'].patchValue({ fechaAlta: this.form.controls['fechaAlta'].value });
    this.form.controls['usuario'].patchValue({ fechaBaja:  this.form.controls['fechaBaja'].value });
    this.form.controls['usuario'].patchValue({ baja:  this.form.controls['baja'].value });


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
      this.sociosService.editarSocio(this.form.value).subscribe();
    } else {
      this.sociosService.crearSocio(this.form.value).subscribe();
    }
    if(this.foto && this.fotoAnterior && this.foto.publicId != this.fotoAnterior.publicId ){
      this.borrarImagen(this.fotoAnterior);

      this.fotoAnterior = this.foto;
    }

    this.guardado = true;

    Swal.fire({
      title: `Socio ${this.form.controls['apellido'].value}, ${this.form.controls['nombre'].value} guardado con éxito!`,
      icon: 'success',
      confirmButtonText: 'OK',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-outline-primary',
      },
    })
    
    this.location.back();
  }

  volver() {
    this.location.back();
  }


  // VALIDACIONES

  get nombreNoValido() {
    return this.form.get('nombre')?.invalid && this.form.get('nombre')?.touched;
  }
  get apellidoNoValido() {
    return this.form.get('apellido')?.invalid && this.form.get('apellido')?.touched;
  }
  get tipoDocumentoNoValido() {
    return this.form.get('tipoDocumento.id')?.invalid && this.form.get('tipoDocumento.id')?.touched && this.form.get('tipoDocumento.id')?.errors?.distintoCero;
  }
  get docNoValido() {
    return this.form.get('numDoc')?.invalid && this.form.get('numDoc')?.touched;
  }
  get correoNoValido() {
    return this.form.get('correo')?.invalid && this.form.get('correo')?.touched;
  }
  get telefonoNoValido() {
    return this.form.get('telefono')?.invalid && this.form.get('telefono')?.touched;
  }
  get cuilNoValido() {
    return this.form.get('cuil')?.invalid && this.form.get('cuil')?.touched;
  }
  get direccionNoValido() {
    return this.form.get('direccion')?.invalid && this.form.get('direccion')?.touched;
  }
  get fechaAltaNoValido() {
    return this.form.get('fechaAlta')?.invalid && this.form.get('fechaAlta')?.touched;
  }
  get fechaIngresoLaboralNoValido() {
    return this.form.get('fechaIngresoLaboral')?.invalid && this.form.get('fechaIngresoLaboral')?.touched;
  }
  get fechaNacimientoNoValido() {
    return this.form.get('fechaNacimiento')?.invalid && this.form.get('fechaNacimiento')?.touched;
  }
  get estadoCivilNoValido() {
    return this.form.get('estadoCivil.id')?.invalid && this.form.get('estadoCivil.id')?.touched && this.form.get('estadoCivil.id')?.errors?.distintoCero;
  }
  get localidadNoValido() {
    return this.form.get('localidad.id')?.invalid && this.form.get('localidad.id')?.touched && this.form.get('localidad.id')?.errors?.distintoCero;
  }
  get legajoNoValido() {
    return this.form.get('legajo')?.invalid && this.form.get('legajo')?.touched;
  }
  get tipoNoValido() {
    return this.form.get('tipo.id')?.invalid && this.form.get('tipo.id')?.touched && this.form.get('tipo.id')?.errors?.distintoCero;
  }
  get numCuentaNoValido() {
    return this.form.get('numCuenta')?.invalid && this.form.get('numCuenta')?.touched;
  }
  

  crearForm() {
    this.form = this.fb.group({
      id: [''],
      numDoc: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')],],
      fechaAlta: [this.hoy, [Validators.required]],
      fechaBaja: [''],
      direccion: ['', [Validators.required]],
      baja: ['false'],
      habilitado: [true],
      extranjero: [false],
      fechaIngresoLaboral: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      legajo: ['', [Validators.required]],
      motivoBaja: [],
      cuotaDeporte: [],
      seguroVida: [],
      numCuenta: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      cuil: ['', [Validators.required]],
      foto: this.fb.group({
        id: [''],
        publicId: [''],
        url: [''],
      }),
      cuotaSocial: this.fb.group({
        id: [''],
        nombre: [''],
        valor: [''],
      }),
      usuario: this.fb.group({
        id: [],
        nombreUsuario: [''],
        contrasena: [''],
        fechaAlta: [''],
        fechaBaja: [''],
        baja: [false],
        rol: this.fb.group({
          id: [3],
          nombreRol: [''],
        }),
      }),
      localidad: this.fb.group({
        id: [0, this.validadoresService.distintoCero(/^[0]+/)],
        nombre: [''],
        cp: [],
      }),
      tipoDocumento: this.fb.group({
        id: [0 , this.validadoresService.distintoCero(/^[0]+/)],
        nombre: [''],
      }),
      tipo: this.fb.group({
        id: [0 , this.validadoresService.distintoCero(/^[0]+/)],
        nombre: [''],
      }),
      estadoCivil: this.fb.group({
        id: [0 , this.validadoresService.distintoCero(/^[0]+/)],
        nombre: [''],
      }),
    });
  }


  cargarDataAlFormulario() {
    this.form = this.fb.group({
      id: [''],
      numDoc: [3123213],
      nombre: ['Pablo'],
      apellido: ['Ruiz'],
      correo: ['pruiz@mail.com'],
      fechaAlta: [this.hoy],
      fechaBaja: [''],
      direccion: ['dir 123'],
      baja: ['false'],
      habilitado: [true],
      extranjero: [false],
      fechaIngresoLaboral: [this.hoy],
      fechaNacimiento: [this.hoy],
      legajo: [3214123],
      motivoBaja: [],
      cuotaDeporte: [],
      seguroVida: [],
      numCuenta: [1312434],
      telefono: [4324213],
      cuil: [12321313],
      foto: this.fb.group({
        id: [''],
        publicId: [''],
        url: [''],
      }),
      cuotaSocial: this.fb.group({
        id: [''],
        nombre: [''],
        valor: [''],
      }),
      usuario: this.fb.group({
        id: [],
        nombreUsuario: [''],
        contrasena: [''],
        fechaAlta: [''],
        fechaBaja: [''],
        baja: [false],
        rol: this.fb.group({
          id: [3],
          nombreRol: [''],
        }),
      }),
      localidad: this.fb.group({
        id: [1],
        nombre: [''],
        cp: [],
      }),
      tipoDocumento: this.fb.group({
        id: [1],
        nombre: [''],
      }),
      tipo: this.fb.group({
        id: [1],
        nombre: [''],
      }),
      estadoCivil: this.fb.group({
        id: [1],
        nombre: [''],
      }),
    });
  }
}
