import { IfStmt } from '@angular/compiler';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Categoria } from 'src/app/interfaces/convenios/categoria.interface';
import { Convenio } from 'src/app/interfaces/convenios/convenio.interface';
import { CategoriasService } from 'src/app/providers/categorias.service';
import { ConveniosService } from 'src/app/providers/convenios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-categorias',
  templateUrl: './listar-categorias.component.html',
  styleUrls: ['./listar-categorias.component.scss']
})
export class ListarCategoriasComponent implements OnInit {

  categoriasIniciales: Categoria[] = [];

  categorias: Categoria[] = [];

  error: boolean = false;

  convenios: Convenio[] = [];

  categoria!: Categoria | null;

  soloLectura: boolean = true;

  numCategoriasIniciales: number = 0;

  constructor(  private categoriasService: CategoriasService,
                private conveniosService: ConveniosService ) { }

  ngOnInit(): void {
    
    this.getCategorias();
    
    
  }

  getCategorias(){
    this.categoriasService.getCategorias().subscribe( res => {
      res.splice(0,1);
     
      this.categorias = res;

      this.numCategoriasIniciales = res.length;
      
    });
  }

  buscar( param: string){

    if(param.length > 0){
      this.categoriasService.buscarCategorias(param).subscribe(res => {this.categorias = res});
    }else {
     this.getCategorias(); 
    }
  }

  borrarCategoria(cat: Categoria, idx: number){

    if(cat.nombre === ''){
      this.categorias.splice(idx, 1);
      
    } else {

      this.conveniosService.buscarPorCategoria(cat.nombre).subscribe(res => {
  
        if(res.length > 0){
  
          this.categoria = cat;
          this.convenios = res;
          
         
        }else {
          Swal.fire({
            title: `¿Está seguro que desea eliminar la categoría ${cat.nombre}?`,
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Eliminar',
            buttonsStyling: false,
            focusCancel: true,
            reverseButtons: true,
            customClass: {
              cancelButton: 'btn btn-outline-danger me-1',
              confirmButton: 'btn btn-outline-primary ms-1',
            },
          }).then((result) => {
            if (result.isConfirmed) {
              
              this.categoriasService.eliminarCategoria(cat.id).subscribe( res => {
              
                Swal.fire({
                  title: `La categoría ${cat.nombre} se ha eliminado!`,
                  icon: 'success',
                  confirmButtonText: 'OK',
                  buttonsStyling: false,
                  customClass: {
                    confirmButton: 'btn btn-outline-primary me-1',
                  }
                })
                this.getCategorias();
              });
            }
          });
        }
      });
    }
  }

  crearFila(){

    const cat : Categoria = {id:  this.categorias[this.categorias.length - 1].id + 1, nombre: ''};
    this.categorias.push( cat );
    
  }

  guardar(btn: Element, input: Element, inputId: string, valor: string, error: Element ) {
    
    const cat: Categoria = { id: Number(inputId), nombre: valor }

    let existe: boolean = false;
    let nombre = '';
    let duplicado: boolean = false;
    if(valor != ''){

     
      this.categoriasService.getCategorias().subscribe(res => {
        const categoriasIniciales = res;
        categoriasIniciales.forEach(categoria => {
  
          if(categoria.id === cat.id){            
            existe = true;
            nombre = categoria.nombre;
          } else if(categoria.nombre.toLowerCase() == cat.nombre.toLowerCase()){
            duplicado = true;
          }
          
          
        });


        if(existe && !duplicado){
          Swal.fire({
            title: `¿Está seguro que desea actualizar la categoría ${nombre}?
            ¡Se cambiará esta categoria en todos los convenios que la tengan asignada!
            `,
            icon: 'info',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Actualizar',
            buttonsStyling: false,
            focusCancel: true,
            reverseButtons: true,
            customClass: {
              cancelButton: 'btn btn-outline-danger me-1',
              confirmButton: 'btn btn-outline-primary ms-1',
            },
          }).then((result) => {
            if (result.isConfirmed) {
              this.categoriasService.editarCategoria(cat).subscribe(res => {
              
                Swal.fire({
                  title: `¡La categoría se ha actualizado!`,
                  icon: 'success',
                  confirmButtonText: 'OK',
                  buttonsStyling: false,
                  customClass: {
                    confirmButton: 'btn btn-outline-primary me-1',
                  }
                })
                this.getCategorias();
              });
            } else {
              input.removeAttribute('readonly');
              btn.removeAttribute('disabled');
            }
          });

          input.setAttribute('readonly', 'true');
          btn.setAttribute('disabled','true');
          
        } else if( duplicado){
          input.removeAttribute('readonly');
          btn.removeAttribute('disabled');

          Swal.fire({
            title: `¡La categoría ingresada ya existe!`,
            icon: 'info',
            confirmButtonText: 'OK',
            buttonsStyling: false,
            customClass: {
              confirmButton: 'btn btn-outline-primary me-1',
            }
          });

        }else {
          this.categoriasService.crearCategoria(cat).subscribe();
          Swal.fire({
            title: `¡Categoria ${cat.nombre} guardada con éxito!`,
            icon: 'success',
            confirmButtonText: 'OK',
            buttonsStyling: false,
            customClass: {
              confirmButton: 'btn btn-outline-primary',
            },
          });
          input.setAttribute('readonly', 'true');
          btn.setAttribute('disabled','true');
        }
      });
      
    }else{
      this.mostrarError(error);
      
    }

      
      
    

  }

  mostrarError(error: Element){

    error.removeAttribute('hidden');
   
  
  }
  ocultarError(error: Element) {
    error.setAttribute('hidden','true');
  }

  editar(input: Element, btn: Element){
    if( input.hasAttribute('readonly')){
      input.removeAttribute('readonly');
      btn.removeAttribute('disabled');
    } else {
      input.setAttribute('readonly','true');
      btn.setAttribute('disabled','true');
    }

  }
}
