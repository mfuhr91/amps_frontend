import { DatePipe, Location } from '@angular/common';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Rol } from 'src/app/interfaces/rol.interface';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { UsuariosService } from 'src/app/providers/usuarios.service';
import { ValidadoresService } from 'src/app/providers/validadores.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-usuarios',
  templateUrl: './form-usuarios.component.html',
  styleUrls: ['./form-usuarios.component.scss']
})
export class FormUsuariosComponent implements OnInit{

  contrasena: string = '';

  usuario!: Usuario;

  roles: Rol[] = [];

  rol!: Rol;

  guardando: boolean = false;

  hoy = new DatePipe('es').transform(new Date(), 'yyyy-MM-dd');
  
  editar: boolean = false;
  
  form!: FormGroup;

  usuarioExiste: boolean = false;

  checkeando: boolean = false;

  constructor(  private fb: FormBuilder,
                private validadoresService: ValidadoresService,
                private usuariosService: UsuariosService,
                private location: Location,
                private route: ActivatedRoute ) { }


  ngOnInit(): void {
    this.crearForm();
    this.getRoles();

    const { id } = this.route.snapshot.params;
    
    if (id) {
      
      this.editar = true;

      this.usuariosService.getUsuario(id).subscribe((res) => {
        this.usuario = res;

        this.usuario.contrasena2 = res.contrasena;
        
        let fechaAlta = new DatePipe('es').transform( this.usuario.fechaAlta, 'yyyy-MM-dd');
      

        if(fechaAlta){
          this.usuario.fechaAlta = fechaAlta;
        }
  
        
        this.form.setValue(this.usuario);
      
            
      });
    }
  }

  async checkearUsuario(param: string) {

    const promise = await this.usuariosService.getUsuarios().toPromise();
    
    if(this.editar){

        let usr = promise.filter(usuario => usuario.id === this.usuario.id );

        promise.splice(promise.indexOf(usr[0]));

    }
    let nuevoUsuario!: Usuario;
    promise.forEach(usuario => {
      if(usuario.nombreUsuario == param ) {
        nuevoUsuario = usuario;   
      }    
    })
    if(nuevoUsuario){
      this.usuarioExiste = true;
    }else {
      this.usuarioExiste = false;
    
    }
    this.checkeando = true;
  
  
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
      this.usuariosService.editarUsuario(this.form.value).subscribe();
    } else {
      this.usuariosService.crearUsuario(this.form.value).subscribe();
    }
    Swal.fire({
          title: `Usuario ${this.form.controls['nombreUsuario'].value} guardado con éxito!`,
          icon: 'success',
          confirmButtonText: 'OK',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn btn-outline-primary',
          },
    })

    this.location.back();
  }

  volver(){
    this.location.back(); 
  }

  getRoles(){
    this.usuariosService.getRoles().subscribe( res => {
      
      this.roles = res
      this.roles.unshift({
        id: 0,
        nombreRol: "Seleccione un rol"
      })
      });
  }



  get nombreUsuarioNoValido() {
    return this.form.get('nombreUsuario')?.invalid && this.form.get('nombreUsuario')?.touched;
  }

  get contrasenaNoValido() {
    return this.form.get('contrasena')?.invalid && this.form.get('contrasena')?.touched;
  }
  get contrasenaNoCoincide() {
    const contrasena1 = this.form.get('contrasena')?.value;
    const contrasena2 = this.form.get('contrasena2')?.value;
    
    return ( contrasena1 === contrasena2 ) ? false : true;
  }
  get rolNoValido() {
    return this.form.get('rol.id')?.invalid && this.form.get('rol.id')?.touched && this.form.get('rol.id')?.errors?.distintoCero;
  }
  get fechaAltaNoValido() {
    return this.form.get('fechaAlta')?.invalid && this.form.get('fechaAlta')?.touched;
  }

  crearForm(){
    this.form = this.fb.group({
      id: [''],
      nombreUsuario: ['', Validators.required],
      contrasena: ['', Validators.required],
      contrasena2: ['', Validators.required],
      fechaAlta: [this.hoy, Validators.required],
      fechaBaja: [''],
      baja: [false],
      rol: this.fb.group({
        id: [0,this.validadoresService.distintoCero(/^[0]+/)],
        nombreRol: [''],
      })
    },
    {
      Validators: this.validadoresService.passwordsIguales('contrasena','contrasena2')
    }
    );
  }

}
