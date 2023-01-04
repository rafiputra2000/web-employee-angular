import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { convertFormatRp, formList } from 'src/app/constant/employee';
import { employee } from 'src/app/shared/interface/employee.model';
import { employeeService } from 'src/app/shared/services/employee.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  private emploList: employee[] = [];
  emplo?: employee;
  listForm: any = [];
  maxDate: string = this.dateToString(new Date());
  basicSalaryFormat!: string;
  imageSrc!: string;

  constructor(
    private EmployeeService: employeeService,
    private router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.listForm = formList;
    this.route.params.subscribe({
      next: (params: Params) => {
        const { id } = params;
        this.EmployeeService.get(id).subscribe({
          next: (emplo: employee) => {
            this.emplo = emplo;
            this.basicSalaryFormat = emplo.tesSalary;
            this.setFormValue(this.emplo);
            this.changeConvertRp();
          },
        });
      },
    });
  }

  // handleInputChange(e: any): void {
  //   var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
  //   var pattern = /image-*/;
  //   var reader = new FileReader();
  //   if (!file.type.match(pattern)) {
  //     alert('invalid format');
  //     return;
  //   }
  //   reader.onload = this._handleReaderLoaded.bind(this);
  //   reader.readAsDataURL(file);
  // }

  // _handleReaderLoaded(e: any): void {
  //   let reader = e.target;
  //   this.images = reader.result;
  // }

  employeeGroup: FormGroup = new FormGroup({
    id: new FormControl(''),
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    birthDate: new FormControl('', [Validators.required]),
    tesSalary: new FormControl('', [Validators.required]),
    // basicSalary: new FormControl('', [
    //   Validators.required,
    //   // Validators.pattern('^[0-9]*$'),
    // ]),
    status: new FormControl('', [Validators.required]),
    group: new FormControl('', [Validators.required]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
    ]),
    image: new FormControl(''),
  });

  // validation
  isFormValid(employeeField: string): boolean {
    const control: AbstractControl = this.employeeGroup.get(
      employeeField
    ) as AbstractControl;
    return control && control.invalid && (control.dirty || control.touched);
  }

  onSubmit() {
    //mengambil variable dri formgroup

    const {
      id,
      username,
      firstName,
      lastName,
      email,
      birthDate,
      tesSalary,
      status,
      group,
      description,
      image,
    } = this.employeeGroup.value;

    if (
      //menngecek kondisi
      username &&
      firstName &&
      lastName &&
      this.emailValidation(email) &&
      status &&
      birthDate &&
      tesSalary &&
      group &&
      description
    ) {
      this.EmployeeService.save({
        id,
        username,
        firstName,
        lastName,
        email,
        birthDate: new Date(birthDate),
        tesSalary,
        status,
        group,
        description,
        image,
      }).subscribe();
      this.onFormReset();
      this.router.navigateByUrl('view');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Masukkan data dengan benar',
      });
    }
  }

  onFormReset() {
    this.employeeGroup.reset();
  }

  emailValidation(email: any): boolean {
    return email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  }

  ngOnChanges(): void {
    this.setFormValue(this.emplo as employee);
  }

  setFormValue(employee: employee) {
    if (employee) {
      this.employeeGroup.controls['id']?.setValue(employee.id);
      this.employeeGroup.controls['username']?.setValue(employee.username);
      this.employeeGroup.controls['firstName']?.setValue(employee.firstName);
      this.employeeGroup.controls['lastName']?.setValue(employee.lastName);
      this.employeeGroup.controls['email']?.setValue(employee.email);
      this.employeeGroup.controls['birthDate']?.setValue(
        this.dateToString(employee.birthDate)
      );
      this.employeeGroup.controls['tesSalary']?.setValue(employee.tesSalary);
      // this.employeeGroup.controls['basicSalary']?.setValue(employee.lastName);
      // console.log(employee.basicSalary);
      this.employeeGroup.controls['status']?.setValue(employee.status);
      this.employeeGroup.controls['group']?.setValue(employee.group);
      this.employeeGroup.controls['description']?.setValue(
        employee.description
      );
    }
  }
  dateToString(date: Date): string {
    return format(new Date(date), 'yyyy-MM-dd', { locale: id });
  }

  changeConvertRp(): void {
    if (this.basicSalaryFormat.includes(',')) {
      this.basicSalaryFormat = this.basicSalaryFormat.slice(
        0,
        this.basicSalaryFormat.lastIndexOf(',')
      );
    }
    const basicSalaryRp = this.basicSalaryFormat.replace(/\D/g, '');
    this.employeeGroup.controls['tesSalary']?.setValue(
      (this.basicSalaryFormat = convertFormatRp(basicSalaryRp))
      // this.convertFormatRp(Number(basicSalaryRp))
    );
  }

  // convert(): void {
  //   let convert = this.EmployeeService.readUrl(this.images).subscribe();
  //   console.log(convert);
  // }

  readUrl(event: any): void {
    this.EmployeeService.convert(event).subscribe();
    // console.log(this.employeeGroup.value);
    console.log(this.EmployeeService.imageSrc);
  }

  // convertFormatRp(amount: number): string {
  //   return (this.basicSalaryFormat = new Intl.NumberFormat('id-ID', {
  //     style: 'currency',
  //     currency: 'IDR',
  //   }).format(amount));
  // }

  // readPhotoUrl(file: any): void {
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     this.imageSrc = reader.result as string;
  //   };
  //   reader.readAsDataURL(file);
  // }

  // eventImage(event: any): void {
  //   if (event.target.files && event.target.files[0]) {
  //     const file = event.target.files[0];
  //     this.readPhotoUrl(file);
  //   }
  // }
}
