import { Component, OnInit } from '@angular/core';
import { Variable } from 'src/app/interfaces/variable.interface';
import { VariablesService } from 'src/app/providers/variables.service';

@Component({
  selector: 'app-variables',
  templateUrl: './variables.component.html',
  styleUrls: ['./variables.component.scss']
})
export class VariablesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }

}
