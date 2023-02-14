export interface ListProducts {
  content:          Content[];
  pageable:         Pageable;
  last:             boolean;
  totalElements:    number;
  totalPages:       number;
  size:             number;
  number:           number;
  sort:             Sort;
  numberOfElements: number;
  first:            boolean;
  empty:            boolean;
}

export interface Content {
  id:       number;
  name:     string;
  brand:    string;
  model:    string;
  price:    number;
  discount: number;
  category: Category;
  image: string;
}

export interface Category {
  id:         number;
  name:       string;
  department: Department;
}

export interface Department {
  id:            number;
  keyDepartment: string;
  name:          string;
}

export interface Pageable {
  sort:       Sort;
  offset:     number;
  pageNumber: number;
  pageSize:   number;
  unpaged:    boolean;
  paged:      boolean;
}

export interface Sort {
  empty:    boolean;
  sorted:   boolean;
  unsorted: boolean;
}
