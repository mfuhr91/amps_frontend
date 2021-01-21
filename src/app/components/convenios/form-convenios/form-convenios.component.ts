import { DatePipe, Location } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-convenios',
  templateUrl: './form-convenios.component.html',
  styleUrls: ['./form-convenios.component.scss']
})
export class FormConveniosComponent implements OnInit, OnDestroy {
  
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
                private localidadesService: LocalidadesService ) {
    
   }

  ngOnDestroy(): void {
    if(!this.guardado ) {
      this.borrarImagen(this.foto.publicId);
    }    
  }

  @HostListener('window:beforeunload')
  onReload() { //windows:beforeunload => antes de recargar

    if(!this.guardado) {
      this.borrarImagen(this.foto.publicId);
    }
  }

  ngOnInit(): void {

    this.crearForm();

    this.categoriasService.getCategorias().subscribe((res) => {
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
          this.foto = this.convenio.foto;
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
      'UTC+3'
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
    this.fotoAnterior = this.convenio.foto;

    console.log(this.fotoAnterior);
    
    const tipo = 'comercio';

    this.fotosService.subirImagen(file, tipo).subscribe((res: any) => {
      
      this.foto = res;
      console.log(this.foto);
      
      this.guardado = false;
      this.form.controls['foto'].patchValue({id: '',publicId: res.publicId, url: res.url});

      this.subiendo = false;
      
      
      
    });
  }

  borrarImagen(publicId: string) {
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

  crearForm() {
    this.form = this.fb.group({
      id: [''],
      nombre: [''],
      correo: [''],
      fechaAlta: [this.today],
      fechaBaja: [''],
      direccion: [''],
      baja: ['false'],
      telefono: [''],
      cuit: [''],
      contacto: [''],
      usuario: this.fb.group({
        id: [],
        nombreUsuario: [''],
        contraseña: [''],
        fechaAlta: [''],
        fechaBaja: [''],
        rol: this.fb.group({
          id: [4],
          authority: [''],
        }),
      }),
      foto: this.fb.group({
        id: [''],
        publicId: [''],
        url: [''],
      }),
      localidad: this.fb.group({
        id: [0],
        nombre: [''],
        cp: [],
      }),
      categoria: this.fb.group({
        id: [0],
        nombre: [''],
      }),
      
    });
  }

  guardar() {
    console.log(this.form.value);
    /* if(this.fotoAnterior.publicId != ''){
      this.borrarImagen(this.fotoAnterior.publicId);
    } */
    this.guardado = true;

    if (this.editar) {
      this.conveniosService.editarConvenio(this.form.value).subscribe();
    } else {
      this.conveniosService.crearConvenio(this.form.value).subscribe();
    }

    /* this.location.back(); */
  }

  volver() {
    this.location.back();
  }
}

