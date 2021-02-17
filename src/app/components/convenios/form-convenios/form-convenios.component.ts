import { DatePipe, Location } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Categoria } from 'src/app/interfaces/convenios/categoria.interface';
import { Convenio } from 'src/app/interfaces/convenios/convenio.interface';
import { Foto } from 'src/app/interfaces/foto.interface';
import { Localidad } from 'src/app/interfaces/localidad.interface';
import { Rol } from 'src/app/interfaces/rol.interface';
import { CategoriasService } from 'src/app/providers/categorias.service';
import { ConveniosService } from 'src/app/providers/convenios.service';
import { FotosService } from 'src/app/providers/fotos.service';
import { LocalidadesService } from 'src/app/providers/localidades.service';
import { UsuariosService } from 'src/app/providers/usuarios.service';
import { ValidadoresService } from 'src/app/providers/validadores.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-convenios',
  templateUrl: './form-convenios.component.html',
  styleUrls: ['./form-convenios.component.scss']
})
export class FormConveniosComponent implements OnInit, OnDestroy {

  contrasena: string = '';
  
  subiendo: boolean = false;

  guardado: boolean = true;

  guardando: boolean = false;

  form!: FormGroup;

  categorias: Categoria[] = [];

  localidades: Localidad[] = [];

  rol!: Rol;

  foto!: Foto;

  fotoAnterior!: Foto;

  convenio!: Convenio;

  editar: boolean = false;

  today = new DatePipe('es').transform(new Date(), 'yyyy-MM-dd');
  

  constructor(  private fb: FormBuilder,
                private route: ActivatedRoute,
                private location: Location,
                private conveniosService: ConveniosService,
                private categoriasService: CategoriasService,
                private usuariosService: UsuariosService,
                private fotosService: FotosService,
                private localidadesService: LocalidadesService,
                private validadoresService: ValidadoresService ) {
    
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

    this.crearForm();

    this.categoriasService.getCategorias().subscribe((res) => {
      
      res.splice(0,1);
      this.categorias = res;
      this.categorias.unshift({
        id: 0,
        nombre: 'Seleccione la categoría',
      });
    });

    this.localidadesService.getLocalidades().subscribe((res) => {
      this.localidades = res;

      this.localidades.unshift({
        id: 0,
        nombre: 'Seleccione la localidad',
        cp: 0,
      });
    });

    this.usuariosService.getRol(4).subscribe(res => this.rol = res);


    const { id } = this.route.snapshot.params;
    
    if (id) {
      
      this.editar = true;
      this.conveniosService.getConvenio(id).subscribe((res: Convenio) => {
        this.convenio = res;
        console.log(this.convenio);
        
        
        this.convenio.fechaAlta = this.formatFecha( res.fechaAlta );
        this.convenio.fechaBaja = this.formatFecha( res.fechaBaja );
     
            
        if(!this.convenio.foto){
          let foto: Foto = { id: 0, url: '', publicId: ''};
          
          this.convenio.foto = foto;
          
        }
        
        
        this.convenio.baja = res.baja.toString();
        /* this.socio.extranjero = res.extranjero; */
        
        if(this.convenio.foto.id != 0) {
          this.foto = this.fotoAnterior = this.convenio.foto;
        }
        
        this.form.setValue(this.convenio);
        
            
      });
    } else {
      /* this.cargarDataAlFormulario(); */
    }
    
  }

  formatFecha(fecha: string) {
    let fechaFormat = new DatePipe('es').transform(
      fecha,
      'yyyy-MM-dd',
      );
      
      if (fechaFormat) {
        return fechaFormat;
      } else {
        return '';
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
   

    if(!this.guardado){
      this.borrarImagen(this.foto);
    }
    
    const tipo = 'comercio';

    this.fotosService.subirImagen(file, tipo).subscribe((res: any) => {
      
      this.foto = res;
      console.log(this.foto);
      
      this.guardado = false;
      this.form.controls['foto'].patchValue({id: '',publicId: res.publicId, url: res.url});

      this.subiendo = false;
      
    });
  }

  borrarImagen(img: Foto) {
    if(this.foto){
      this.fotosService.borrarImagen(img.publicId).subscribe();
    }
  }

  crearUsuarioPass(comercio: string, contacto: string, telefono: string, correo: string) {
    this.form.controls['usuario'].patchValue({ nombreUsuario: correo });

    if(comercio != '' && contacto != '' && telefono != ''){
    
      
      this.contrasena = comercio.charAt(0).toLowerCase().concat(contacto.charAt(0).toLowerCase()).concat(telefono);

      this.form.controls['usuario'].patchValue({contrasena: this.contrasena});
    }
  }

  /* asignarFechaAltaUsuario(fecha: string) {
    this.form.controls['usuario'].patchValue({ fechaAlta: fecha });
  }
  asignarFechaBajaUsuario(fecha: string) {
    this.form.controls['usuario'].patchValue({ fechaBaja: fecha });
  } */



  // VALIDACIONES

  get cuitNoValido() {
    return this.form.get('cuit')?.invalid && this.form.get('cuit')?.touched;

  }
  get nombreNoValido() {
    return this.form.get('nombre')?.invalid && this.form.get('nombre')?.touched;

  }
  get correoNoValido() { 
    return this.form.get('correo')?.invalid && this.form.get('correo')?.touched;

  }
  get telefonoNoValido() {
    return this.form.get('telefono')?.invalid && this.form.get('telefono')?.touched;

  }
  get direccionNoValido() {
    return this.form.get('direccion')?.invalid && this.form.get('direccion')?.touched;

  }
  get localidadNoValido() {
    return this.form.get('localidad.id')?.invalid && this.form.get('localidad.id')?.touched && this.form.get('localidad.id')?.errors?.distintoCero;
  }
  get categoriaNoValido() {
    return this.form.get('categoria.id')?.invalid && this.form.get('categoria.id')?.touched && this.form.get('categoria.id')?.errors?.distintoCero;
  }
  get fechaAltaNoValido() {
    return this.form.get('fechaAlta')?.invalid && this.form.get('fechaAlta')?.touched;

  }
  get contactoNoValido() {
    return this.form.get('contacto')?.invalid && this.form.get('contacto')?.touched;

  }

  crearForm() {
    this.form = this.fb.group({
      id: [''],
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')],],
      fechaAlta: [this.today , [Validators.required]],
      fechaBaja: [''],
      direccion: ['', [Validators.required]],
      baja: ['false'],
      telefono: ['', [Validators.required]],
      cuit: ['', [Validators.required]],
      contacto: ['', [Validators.required]],
      usuario: this.fb.group({
        id: [],
        nombreUsuario: [''],
        contrasena: [''],
        fechaAlta: [''],
        fechaBaja: [''],
        baja: [false],
        rol: this.fb.group({
          id: [4],
          nombreRol: [''],
        }),
      }),
      foto: this.fb.group({
        id: [''],
        publicId: [''],
        url: [''],
      }),
      localidad: this.fb.group({
        id: [0, this.validadoresService.distintoCero(/^[0]+/)],
        nombre: [''],
        cp: [],
      }),
      categoria: this.fb.group({
        id: [0, this.validadoresService.distintoCero(/^[0]+/)],
        nombre: [''],
      }),
      
    });
  }

  guardar() {

    console.log(this.form.value);

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
    
    if (this.editar) {
      this.conveniosService.editarConvenio(this.form.value).subscribe();
    } else {
      this.conveniosService.crearConvenio(this.form.value).subscribe();
    }
    
    this.guardando = true;
    
    if(this.foto && this.fotoAnterior && this.foto.publicId != this.fotoAnterior.publicId ){
      this.borrarImagen(this.fotoAnterior);

      this.fotoAnterior = this.foto;
    }
    
    this.guardado = true;


    Swal.fire({
      title: `Comercio ${this.form.controls['nombre'].value} guardado con éxito!`,
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
}

