import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  public page$ = new BehaviorSubject<number>(0);

  constructor() {}

  public setPage(page: number) {
    this.page$.next(page);
  }

  public getPage(): Observable<number> {
    return this.page$.asObservable();
  }
}
