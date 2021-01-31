import { Component, OnInit } from '@angular/core';
import { Variable } from 'src/app/interfaces/variable.interface';
import { VariablesService } from 'src/app/providers/variables.service';

@Component({
  selector: 'app-listar-variables',
  templateUrl: './listar-variables.component.html',
  styleUrls: ['./listar-variables.component.scss']
})
export class ListarVariablesComponent implements OnInit {

  variables: Variable[] = [];

  

  constructor( private variablesService: VariablesService ) { }

  ngOnInit(): void {
    this.getVariables();
  }

  getVariables(){
    this.variablesService.getVariables().subscribe(res => this.variables = res);
    
  }
}
