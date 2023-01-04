import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

import { employees } from 'src/app/constant/employee';
import { employee } from 'src/app/shared/interface/employee.model';
import { employeeService } from 'src/app/shared/services/employee.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  constructor(
    private employeeService: employeeService,
    private sanitizer: DomSanitizer
  ) {}
  employeeList: employee[] = []; // membuat data penampung yang akan di panggil di constant
  buttons: any[] = [];
  orderHeader!: string;
  isDescOrder: boolean = true;
  search: any;
  searchList: string[] = [];
  searchGroup: FormGroup = new FormGroup({
    search: new FormControl(''),
  });
  images: string = '';

  deleteList(firstName: string, lastName: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeeService.remove(firstName, lastName).subscribe();
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }

  ngOnInit(): void {
    this.onLoadEmployees();
    this.searchHistory();
    console.log(this.employeeList);
  }

  // convert(): void {
  //   this.employeeList.map((t) => {
  //     this.sanitizer.bypassSecurityTrustResourceUrl(t.image);
  //   });
  // }

  onLoadEmployees() {
    this.employeeService.list().subscribe({
      next: (employees: employee[]) => {
        this.employeeList = employees;
      },
    });
  }

  page: number = 1;
  count: number = 0;
  tableSize: number = 5;
  tableSizes: number[] = [5, 10, 20, 50];

  onTableDataChange(event: any) {
    this.page = event;
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  submitSearch() {
    const { search } = this.searchGroup.value;
    this.searchList.push(search);
    sessionStorage.setItem('search', JSON.stringify(this.searchList));
  }

  searchHistory() {
    const sessionHistory = sessionStorage.getItem('search') as string;
    this.searchList = JSON.parse(sessionHistory);
  }

  sort(headerName: string) {
    this.isDescOrder = !this.isDescOrder;
    this.orderHeader = headerName;
  }
}
