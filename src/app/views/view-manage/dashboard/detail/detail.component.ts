import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { format } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { employee } from 'src/app/shared/interface/employee.model';
import { employeeService } from 'src/app/shared/services/employee.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  employees!: employee;
  birthDate: string = '';

  constructor(
    private employeeServices: employeeService,
    private readonly route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (params: Params) => {
        const { id } = params;
        this.employeeServices.get(id).subscribe({
          next: (employee: employee) => {
            employee.birthDate = new Date(employee.birthDate);
            this.birthDate = format(
              new Date(employee.birthDate),
              'dd MMMM yyyy',
              { locale: enGB }
            );
            this.employees = employee;
          },
        });
      },
    });
  }
}
