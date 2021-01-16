import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SociosService } from 'src/app/providers/socios.service';
import {  DatePipe, Location } from '@angular/common';

import { WebcamImage } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';

import Swal from 'sweetalert2';
import { Socio } from 'src/app/interfaces/socio.interface';
import { ActivatedRoute } from '@angular/router';
import { LocalidadesService } from 'src/app/providers/localidades.service';
import { Localidad } from 'src/app/interfaces/localidad.interface';
import { UsuariosService } from 'src/app/providers/usuarios.service';
import { Rol } from 'src/app/interfaces/rol.interface';
import { TipoDocumento } from 'src/app/interfaces/tipo-documento.interface';
import { EstadoCivil } from 'src/app/interfaces/estado-civil.interface';
import { Categoria } from 'src/app/interfaces/categoria.interface';



@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnChanges, OnDestroy {

  socio: Socio | undefined;

  localidades: Localidad[] = [];

  roles: Rol[] = [];

  rol!: Rol;

  subiendo: boolean = false;

  url: string = ''; //TODO: BORRAR SI NO  SE USA

  tiposDocumentos: TipoDocumento[] = [];
  categorias: Categoria[] = [];
  estadosCiviles: EstadoCivil[] = [];

  public fotoSubida: any;

  public today = new DatePipe('es').transform(new Date, 'yyyy-MM-dd');

  public webcamImage!: WebcamImage;

  private trigger: Subject<void> = new Subject<void>();

  public editar: boolean = false;

  public activarCamara: boolean = false;

  mostrarFoto = false;

  foto!: WebcamImage;

  form!: FormGroup;

  constructor(  private fb: FormBuilder,
                private sociosService: SociosService,
                private location: Location,
                private route: ActivatedRoute,
                private localidadesService: LocalidadesService,
                private usuariosService: UsuariosService ) { 


    this.crearForm();
    
  }
  ngOnDestroy(): void {
    this.fotoSubida = null;
    this.url = ''; //TODO: BORRAR SI NO  SE USA
  }
  ngOnChanges(changes: SimpleChanges): void {

  }

  cambioValor( valor: string){
    console.log(valor);
    
    if(valor == "true") {
      this.form.controls['fechaBaja'].setValue(this.today);
    } else {
      this.form.controls['fechaBaja'].setValue('');
    } 
  }
  
  ngOnInit(): void {

    this.sociosService.getTiposDocumentos().subscribe(
      res => {
        this.tiposDocumentos = res;

        this.tiposDocumentos.unshift({
          id: 0,
          nombre: 'Seleccione un tipo'
        });
        
      }
    )

    /* this.usuariosService.getRoles().subscribe(
      res => {
        this.roles = res;

        this.roles.unshift({
          id: 0,
          authority: 'Seleccione un rol',
        });
      }); */
      this.usuariosService.getRol(2).subscribe(
        res => this.rol = res);

    this.localidadesService.getLocalidades().subscribe( 
      res => {
        this.localidades = res;

        this.localidades.unshift({
          id: 0,
          nombre: 'Seleccione la localidad',
          cp: 0,
        });
      });
    this.sociosService.getCategorias().subscribe( 
      res => {
        this.categorias = res;

        this.categorias.unshift({
          id: 0,
          nombre: 'Seleccione la categoría',
        });
      });
    this.sociosService.getEstadosCiviles().subscribe( 
      res => {
        this.estadosCiviles = res;

        this.estadosCiviles.unshift({
          id: 0,
          nombre: 'Seleccione el estado civil',
        });
      });
    
    const { id } = this.route.snapshot.params;

    if( id ){
      
      this.editar = true;
      this.sociosService.getSocio(id).subscribe( res => {
 
        
        let fechaAltaFormat = new DatePipe('es').transform(res.fechaAlta, 'yyyy-MM-dd');
        let fechaBajaFormat = new DatePipe('es').transform(res.fechaBaja, 'yyyy-MM-dd');
        let fechaNacFormat = new DatePipe('es').transform(res.fechaNacimiento, 'yyyy-MM-dd');
        let fechaLaboralFormat = new DatePipe('es').transform(res.fechaIngresoLaboral, 'yyyy-MM-dd');
        
        // ABAJO OK
        this.socio = res;
        if(fechaAltaFormat){
          this.socio.fechaAlta = fechaAltaFormat;
        }
        if(fechaBajaFormat){
          this.socio.fechaBaja = fechaBajaFormat;
        }
        if(fechaNacFormat){
          this.socio.fechaBaja = fechaNacFormat;
        }
        if(fechaLaboralFormat){
          this.socio.fechaBaja = fechaLaboralFormat;
        }

        this.socio.usuario.rol.id = 2;

        this.socio.baja = res.baja.toString();
        this.socio.extranjero = res.extranjero;

        this.fotoSubida = this.socio.foto;
        
        this.form.setValue(this.socio);

        console.log(this.socio);
        
        
        
      });
      
    } else {
      /* this.cargarDataAlFormulario(); */
    }

    /* console.log(this.form); */
    
  
  }

  // MANEJO DE WEBCAM

  triggerSnapshot(): void {
    this.trigger.next();
    this.activarCamara = false;
  }
  handleImage(webcamImage: WebcamImage): void {
    console.info('Saved webcam image', webcamImage);

    this.webcamImage = webcamImage;

    var file = this.webcamImageAFile(this.webcamImage.imageAsDataUrl, 'image/png');

    console.log(file);
    this.sociosService.subirImagen(file).subscribe( (res: any) => {
      
      
      this.subiendo = true;
      this.form.controls['foto'].setValue(res.foto);
      /* localStorage.clear(); */
      this.fotoSubida = res.foto
      this.subiendo = false;
    
    });
    
    
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }




   webcamImageAFile(webcamUrl: string, type : string): File {
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
    
    
    
    /* return bb; */
    return new File([ab],"webcam-foto",{ type: type, lastModified: fecha.getTime() });
  }

   // FIN MANEJO DE WEBCAM


  // INPUT FILE FOTO
  subirFoto() {
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
        cancelButton: 'btn btn-outline-danger ms-1'
      },
    }).then((res) => {
      if (res.value) {
        console.log(res.value);
        this.sociosService.subirImagen(res.value).subscribe(
          (res: any) => {
            this.subiendo = true;
            
            this.form.controls['foto'].setValue(res.foto)

            this.fotoSubida = res.foto
            console.log(res.foto);
            
            this.subiendo = false;

          }
          
        );
        
        

        /* const reader = new FileReader();
        reader.onload = (e: any) => {
          
          if(this.socio){
            this.socio.foto = this.fotoSubida = e.target.result;
            
          } else {
            this.fotoSubida = e.target.result;
          }
          
        };
        reader.readAsDataURL(res.value); */
      }
    });
  }

  // FIN INPUT FILE FOTO

  crearForm() {
    this.form = this.fb.group({
      id: [''],
      numDoc: [''],
      nombre: [''],
      apellido: [''],
      correo: [''],
      fechaAlta: [this.today],
      fechaBaja: [''],
      cuotaSocial: [''],
      direccion: [''],
      baja: ['false'],
      extranjero: [false],
      fechaIngresoLaboral: [''],
      fechaNacimiento: [''],
      foto: [''],
      legajo: [''],
      motivoBaja: [''],
      numCuenta: [''],
      telefono: [''],
      cuil: [''],
      usuario: this.fb.group ({
        id: [''],
        nombreUsuario: [''],
        contraseña: [''],
        fechaAlta: [''],
        fechaBaja: [''],
        rol: this.fb.group ({
          id: [2],
          authority: ['']
        }),
      }),
      localidad: this.fb.group ({
        id: [0],
        nombre: [''],
        cp: []
      }),
      tipoDocumento: this.fb.group ({
        id: [0],
        nombre: [''],
      }), 
      categoria: this.fb.group ({
        id: [0],
        nombre: [''],
      }), 
      estadoCivil: this.fb.group ({
        id: [0],
        nombre: [''],
      }), 
      
    });
  }

  cargarDataAlFormulario() {
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
      usuario: this.fb.group ({
        id: [''],
        nombreUsuario: [''],
        contraseña: [''],
        fechaAlta: [''],
        fechaBaja: [''],
        rol: this.fb.group ({
          id: [1],
          authority: ['']
        }),
      }),
      localidad: this.fb.group ({
        id: [1],
        nombre: [''],
      }),
      tipoDocumento: this.fb.group ({
        id: [1],
        nombre: [''],
      }) 

    });
  }

  crearUsuario( correo: string ){
    this.form.controls['usuario'].patchValue({nombreUsuario: correo});
  }


  guardar() {
    console.log(this.form.value);

    /* this.form.controls['foto'].setValue(this.fotoSubida); */
        
    if(this.editar){
      this.sociosService.editarSocio(this.form.value).subscribe();
    } else {
      this.sociosService.crearSocio(this.form.value).subscribe();
    }

    
    this.url = ''; //TODO: BORRAR SI NO  SE USA
    this.location.back();
  }

  volver() {
    this.location.back();
  }
  


}
