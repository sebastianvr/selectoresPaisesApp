import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { delay, switchMap, tap } from 'rxjs/operators';
import { PaisesService } from '../../services/paises.service';
import { IPaisSmall } from '../../interfaces/paises.interface';

@Component({
  selector: 'app-selector-pages',
  templateUrl: './selector-pages.component.html',
  styles: [
  ]
})
export class SelectorPagesComponent implements OnInit {

  regiones: string[] = [];
  paisesSeleccionados: IPaisSmall[] = [];
  fronteras: IPaisSmall[] = []

  //UX
  //mostar aviso mientras reliza la consulta al endpoint
  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private paisesService: PaisesService
  ) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones

    //La sgte linea se disparará cuando cambie el valor del selector por region 
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap(_ => {
          //El guion bajo representa el dato que se obtendra, en este caso 
          //se obtiene la region seleccionada por el usuario, yo no nececito ocupar este valor 
          //y es por esto que por convencion se declara "_" o "()" a una variable que no usarás.
          // console.log(_)
          //necesito  purgar este formGroup para cuando el usuario cambia de continente y el pais no coincide con 
          //el continente
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        }),
        switchMap(region =>
          this.paisesService.getRegion(region))
      )
      .subscribe(paises => {
        this.paisesSeleccionados = paises;
        this.cargando = false;
        // console.log(this.paisesSeleccionados)
      });

    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap((_) => {
          this.fronteras = [];
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;
        }),

        switchMap(alphaCode => this.paisesService.buscarPaisPorAlpha3Code(alphaCode)
        ),

        tap(pais => {
          if (pais?.borders.length === 0) {
            this.cargando = false;
          }
        }

        ),
        switchMap(pais => this.paisesService.getPaisesPorBordes(pais?.borders!))
      )
      .subscribe(pais => {
        this.fronteras = pais || [];
        this.cargando = false;
      })

  }

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required]

  })

  enviarFormulario() {
    console.log('Enviando Formulario');
  }
}
