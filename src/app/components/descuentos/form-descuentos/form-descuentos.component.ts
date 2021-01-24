import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConveniosService } from 'src/app/providers/convenios.service';
import { SociosService } from 'src/app/providers/socios.service';
import { UsuariosService } from 'src/app/providers/usuarios.service';
import { ValidadoresService } from 'src/app/providers/validadores.service';

@Component({
  selector: 'app-form-descuentos',
  templateUrl: './form-descuentos.component.html',
  styleUrls: ['./form-descuentos.component.scss']
})
export class FormDescuentosComponent implements OnInit {

  guardado: boolean = true;

  guardando: boolean = false;

  form!: FormGroup;

  editar: boolean = false;
  
  today = new DatePipe('es').transform(new Date(), 'yyyy-MM-dd');

  constructor(  private fb: FormBuilder,
                private route: ActivatedRoute,
                private location: Location,
                private sociosService: SociosService,
                private conveniosService: ConveniosService,
                private usuariosService: UsuariosService,
                private validadoresService: ValidadoresService) { }

  ngOnInit(): void {
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
      valorCuota: ['', [Validators.required]],
      valorTotal: ['', [Validators.required]],
      fechaAlta: [this.today , [Validators.required]],
      socio: this.fb.group({
        id: [''],
        numDoc: ['', [Validators.required]],
        nombre: ['', [Validators.required]],
        apellido: ['', [Validators.required]],
        baja: ['false'],
        legajo: ['', [Validators.required]],
      }),
      convenio: this.fb.group({
        id: [''],
        nombre: ['', [Validators.required]],
        direccion: ['', [Validators.required]],
        cuit: ['', [Validators.required]],
        contacto: ['', [Validators.required]],
      }),
      
    });
  }


  guardar(){

  }

  volver() {
    this.location.back();
  }

}
