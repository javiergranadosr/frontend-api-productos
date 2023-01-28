export interface Department {
  id:            number;
  name:          string;
  keyDepartment: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Pagination{
  page: number;
  prev:number;
  next:number;
}
