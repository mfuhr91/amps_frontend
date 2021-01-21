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
import { first, throwIfEmpty } from 'rxjs/operators';
import { FotosService } from 'src/app/providers/fotos.service';
import { VariablesService } from 'src/app/providers/variables.service';


@Component({
  selector: 'app-form',
  templateUrl: './form-socios.component.html',
  styleUrls: ['./form-socios.component.scss'],
})
export class FormSociosComponent implements OnInit, OnDestroy {

  socio!: Socio;

  localidades: Localidad[] = [];

  roles: Rol[] = [];

  rol!: Rol;

  subiendo: boolean = false;
  guardado: boolean = true;

  tiposDocumentos: TipoDocumento[] = [];
  tipos: Tipo[] = [];
  estadosCiviles: EstadoCivil[] = [];

  today = new DatePipe('es').transform(new Date(), 'yyyy-MM-dd');
  
  trigger: Subject<void> = new Subject<void>();
  
  editar: boolean = false;
  
  activarCamara: boolean = false;
  
  foto!: Foto;
  
  /*  webcamImage!: WebcamImage; */
  /* imagen!: WebcamImage; */

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
    ) {
      this.crearForm();
    }

  ngOnDestroy(): void {
    if(!this.guardado) {
      this.borrarImagen();
    }    
  }

  @HostListener('window:beforeunload')
  onReload() { //windows:beforeunload => antes de recargar

    if(!this.guardado) {
      this.borrarImagen();
    }
  }
    
    
  ngOnInit(): void {

  
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
    
    this.usuariosService.getRol(2).subscribe(res => this.rol = res);
    
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
        nombre: 'Seleccione el tipo',
      });
    });
    this.sociosService.getEstadosCiviles().subscribe((res) => {
      this.estadosCiviles = res;
      
      this.estadosCiviles.unshift({
        id: 0,
        nombre: 'Seleccione el estado civil',
      });
    });
    
    const { id } = this.route.snapshot.params;
    
    if (id) {
      
      this.editar = true;

      this.sociosService.getSocio(id).subscribe((res) => {
        this.socio = res;
        console.log(this.socio);
        
        
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
        
        if(this.socio.foto.id != 0) {
          this.foto = this.socio.foto;
        }
        
        this.form.setValue(this.socio);
        
        console.log(this.foto);
            
      });
    } else {
      /* this.cargarDataAlFormulario(); */
    }
        
  }
  cambioValor(valor: string) {
    if (valor == 'true') {
      this.form.controls['fechaBaja'].setValue(this.today);

      this.form.controls['usuario'].patchValue({ fechaBaja: this.today });
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
    
    /* this.webcamImage = webcamImage; */
    
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
    

    this.borrarImagen();

    this.fotosService.subirImagen(file, tipo).subscribe((res: any) => {
      console.log(res);
      
      this.foto = res;
      this.guardado = false;
      this.form.controls['foto'].patchValue({id: '', publicId: res.publicId, url: res.url});
      this.subiendo = false;
      
    
    });
  }

  borrarImagen() {
    if(this.foto){
      this.fotosService.borrarImagen(this.foto.publicId).subscribe();
    }
  }

  crearUsuario(correo: string) {
    this.form.controls['usuario'].patchValue({ nombreUsuario: correo });
  }

  asignarFechaAltaUsuario(fecha: string) {
    this.form.controls['usuario'].patchValue({ fechaAlta: fecha });
  }
  asignarFechaBajaUsuario(fecha: string) {
    this.form.controls['usuario'].patchValue({ fechaBaja: fecha });
  }

  guardar() {
    console.log(this.form.value);

    

    if (this.editar) {
      this.sociosService.editarSocio(this.form.value).subscribe();
    } else {
      this.sociosService.crearSocio(this.form.value).subscribe();
    }

    this.guardado = true;

    /* this.location.back(); */
  }

  volver() {
    this.location.back();
  }

  crearForm() {
    this.form = this.fb.group({
      id: [''],
      numDoc: [''],
      nombre: [''],
      apellido: [''],
      correo: [''],
      fechaAlta: [this.today],
      fechaBaja: [''],
      direccion: [''],
      baja: ['false'],
      extranjero: [false],
      fechaIngresoLaboral: [''],
      fechaNacimiento: [''],
      legajo: [''],
      motivoBaja: [''],
      numCuenta: [''],
      telefono: [''],
      cuil: [''],
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
        contraseña: [''],
        fechaAlta: [''],
        fechaBaja: [''],
        rol: this.fb.group({
          id: [2],
          authority: [''],
        }),
      }),
      localidad: this.fb.group({
        id: [0],
        nombre: [''],
        cp: [],
      }),
      tipoDocumento: this.fb.group({
        id: [0],
        nombre: [''],
      }),
      tipo: this.fb.group({
        id: [0],
        nombre: [''],
      }),
      estadoCivil: this.fb.group({
        id: [0],
        nombre: [''],
      }),
    });
  }


  /* cargarDataAlFormulario() {
    this.form = this.fb.group({
      id: [''],
      numDoc: [''],
      nombre: ['Mariano'],
      apellido: ['Fuhr'],
      correo: [''],
      fechaAlta: [this.today],
      fechaBaja: [''],
      categoria: [''],
      cuotaSocial: [''],
      direccion: [''],
      suspendido: [false],
      extranjero: [false],
      fechaIngresoLaboral: [''],
      fechaNacimiento: [''],
      foto: [''],
      legajo: [''],
      motivoSusp: [''],
      numCuenta: [''],
      telefono: [''],
      cuil: [''],
      usuario: this.fb.group({
        id: [''],
        nombreUsuario: [''],
        contraseña: [''],
        fechaAlta: [''],
        fechaBaja: [''],
        rol: this.fb.group({
          id: [1],
          authority: [''],
        }),
      }),
      localidad: this.fb.group({
        id: [1],
        nombre: [''],
      }),
      tipoDocumento: this.fb.group({
        id: [1],
        nombre: [''],
      }),
    });
  } */
}
