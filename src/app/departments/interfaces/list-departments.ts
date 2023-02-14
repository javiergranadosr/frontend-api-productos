export interface ListDepartments {
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
  id:            number;
  keyDepartment: string;
  name:          string;
  image: string;
  categories:    Category[];
}

export interface Category {
  id:       number;
  name:     string;
  products: Product[];
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
