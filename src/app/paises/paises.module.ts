import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaisesRoutingModule } from './paises-routing.module';
import { SelectorPagesComponent } from './pages/selector-pages/selector-pages.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SelectorPagesComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PaisesRoutingModule
  ]
})
export class PaisesModule { }
