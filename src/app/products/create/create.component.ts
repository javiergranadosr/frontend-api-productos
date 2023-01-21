import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Department } from 'src/app/shared/common/interfaces/common';
import { CommonService } from 'src/app/shared/common/services/common.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  public $departments!: Observable<Department[]>;

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.$departments = this.commonService.getAllDepartments();

    this.commonService.getAllCategories(2).subscribe( response => {
      console.log("Categories: ", response);
    });

  }
}
