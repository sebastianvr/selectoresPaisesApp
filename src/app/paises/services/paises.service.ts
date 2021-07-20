import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { IPaisSmall, IPais } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _urlBase: string = 'https://restcountries.eu/rest/v2'
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones(): string[] {
    return [...this._regiones];
  }
  constructor(private http: HttpClient) {

  }

  getRegion(region: string): Observable<IPaisSmall[]> {
    const url = `${this._urlBase}/region/${region}?fields=name;alpha3Code`;
    return this.http.get<IPaisSmall[]>(url)
  }

  buscarPaisPorAlpha3Code(codigoPais: string): Observable<IPais | null> {

    if (!codigoPais) {
      return of(null);
    }
    const url = `${this._urlBase}/alpha/${codigoPais}`;
    return this.http.get<IPais>(url);
  }

  buscarPaisPorCodigoSmall(codigo: string): Observable<IPaisSmall> {
    const url = `${this._urlBase}/alpha/${codigo}?fields=name;alpha3Code`;
    return this.http.get<IPaisSmall>(url)
  }

  getPaisesPorBordes(borders: string[]): Observable<IPaisSmall[]> {

    //si no vienen bordes, devuelvo arreglo vacio
    if (!borders) {
      return of([])
    }

    const peticiones: Observable<IPaisSmall>[] = [];

    borders.forEach(codigo => {
      const peticion = this.buscarPaisPorCodigoSmall(codigo);
      peticiones.push(peticion)
    });

    //para disparar todas las peticiones simultaneamente
    return combineLatest(peticiones)


  }
}
