import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ListProducts } from '../../products/interfaces/list-products';
import { PaginationService } from '../common/services/pagination.service';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent implements OnInit, OnChanges, OnDestroy {
  private _paginationService = inject(PaginationService);
  public paginationSubscription!: Subscription;

  @Input() public data!: ListProducts;
  public initArrayPages: number[] = [];
  public arrayPages: number[] = [];
  public pagesElements: number = 4;
  public prev: number = 0;
  public next: number = this.pagesElements;
  public loading: boolean = false;
  public page: number = 1;

  ngOnInit(): void {
    this.paginationSubscription = this._paginationService
      .getPagination$()
      .subscribe((filter) => {
        this.page = filter.page;
        this.prev = filter.prev;
        this.next = this.pagesElements;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['data'].currentValue &&
      Object.keys(changes['data']).length > 0
    ) {
      this.loading = false;
      this.paginationSubscription = this._paginationService
        .getPagination$()
        .subscribe((filter) => {
          this.initLoadPages();
          this.configureArrayPages(this.prev, this.next);
        });
    }
  }

  public prevPage(): void {
    this.loading = true;
    if (this.prev > 0) {
      this.prev--;
      this.next--;
    } else {
      this.page = 1;
      this.prev = 0;
      this.next = this.pagesElements;
    }
    this.page = this.prev + 1; // Se suma 1 ya que la primera pagina inicia en 1  en el cliente y prev inicia en 0 por el back
    console.log(`PREV: ${this.prev} NEXT: ${this.next} PAGE: ${this.page}`);
    this.configureArrayPages(this.prev, this.next);
    this._paginationService.setPage(this.page - 1); // Restamos -1 ya que en el back la primera pagina inicia en 0
  }

  public nextPage(): void {
    this.loading = true;
    this.prev++;
    this.next++;
    this.page = this.prev + 1; // Se suma 1 ya que la primera pagina inicia en 1  en el cliente y prev inicia en 0 por el back
    console.log(`PREV: ${this.prev} NEXT: ${this.next} PAGE: ${this.page}`);
    this.configureArrayPages(this.prev, this.next);
    this._paginationService.setPage(this.page - 1); // Restamos -1 ya que en el back la primera pagina inicia en 0
  }

  public activePage(page: number): void {
    this.page = page;
    this.loading = true;
    this.prev = this.page - 1; // Inicio de array de paginas
    this.next = this.pagesElements + this.prev; // Final del array de paginas
    console.log(`PREV: ${this.prev} NEXT: ${this.next} PAGE: ${this.page}`);
    this._paginationService.setPage(page - 1); // Restamos -1 ya que en el back la primera pagina inicia en 0
  }

  private initLoadPages(): void {
    this.initArrayPages = [];
    for (let i = 0; i < this.data.totalPages; i++) {
      this.initArrayPages.push(i + 1);
    }
  }

  private configureArrayPages(prev: number, next: number): void {
    if (this.data.totalElements > this.pagesElements) {
      this.arrayPages = this.initArrayPages.slice(prev, next);
    } else {
      this.arrayPages = this.initArrayPages;
    }
  }

  ngOnDestroy(): void {
    if (this.paginationSubscription) {
      this.paginationSubscription.unsubscribe();
    }
  }
}
