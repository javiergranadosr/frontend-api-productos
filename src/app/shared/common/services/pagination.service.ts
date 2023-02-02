import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Pagination } from '../interfaces/common';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  private _page$ = new BehaviorSubject<number>(0);
  private _filter$ = new BehaviorSubject<Pagination>({
    page: 1,
    prev: 0,
    next: 0,
  });

  constructor() {}

  public setPage(page: number): void {
    this._page$.next(page);
  }

  public getPage$(): Observable<number> {
    return this._page$.asObservable();
  }

  public setPagination(pagination: Pagination): void {
    this._filter$.next(pagination);
  }

  public getPagination$(): Observable<Pagination> {
    return this._filter$.asObservable();
  }

  public get sizePages(): string[] {
    return ['5', '10', '15', '20'];
  }
}
