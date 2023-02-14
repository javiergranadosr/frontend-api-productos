export interface ListCategories {
  content:          Content[];
  pageable:         Pageable;
  last:             boolean;
  totalPages:       number;
  totalElements:    number;
  size:             number;
  number:           number;
  sort:             Sort;
  first:            boolean;
  numberOfElements: number;
  empty:            boolean;
}

export interface Content {
  id:         number;
  name:       string;
  department: Department;
  image: string;
  products:   Product[];
}

export interface Department {
  id:            number;
  keyDepartment: KeyDepartment;
  name:          Name;
}

export enum KeyDepartment {
  Accesorios = "ACCESORIOS",
  Electronica = "ELECTRONICA",
  Hardware = "HARDWARE",
}

export enum Name {
  Accesorios = "Accesorios",
  Electrónica = "Electrónica",
  Hardware = "Hardware",
}

export interface Product {
  id:       number;
  name:     string;
  brand:    string;
  model:    string;
  price:    number;
  discount: number;
}

export interface Pageable {
  sort:       Sort;
  offset:     number;
  pageSize:   number;
  pageNumber: number;
  unpaged:    boolean;
  paged:      boolean;
}

export interface Sort {
  empty:    boolean;
  sorted:   boolean;
  unsorted: boolean;
}
