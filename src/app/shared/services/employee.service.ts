import { ReadVarExpr } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { EMPLO, employees } from 'src/app/constant/employee';
import Swal from 'sweetalert2';
import { employee } from '../interface/employee.model';

@Injectable({
  providedIn: 'root',
})
export class employeeService {
  private emploList: employee[] = [];
  private storage: Storage = sessionStorage;
  imageSrc!: string;

  constructor() {}

  //menampilkan data
  list(): Observable<employee[]> {
    return new Observable<employee[]>((observer: Observer<employee[]>) => {
      const sessionEmployees = this.storage.getItem(EMPLO) as string;
      try {
        if (!sessionEmployees) {
          this.emploList = employees;
          observer.next(this.emploList);
        } else {
          this.emploList = JSON.parse(sessionEmployees);
          observer.next(this.emploList);
        }
        this.setToStorage();
      } catch (error: any) {
        observer.error(error.message);
      }
    });
  }

  //menyimpan data

  save(Employee: employee): Observable<void> {
    return new Observable<void>((observer: Observer<void>): void => {
      try {
        if (Employee.id) {
          this.emploList = this.emploList.map((t) => {
            if (t.id == Employee.id) t = Employee;

            return t;
          });
          Swal.fire(
            'Edit data berhasil ditambahkan!',
            'You clicked the button!',
            'success'
          );
        } else {
          Employee.image = this.imageSrc;
          Employee.id = makeid(4);
          this.emploList.push(Employee);

          Swal.fire(
            'Data Employee baru berhasil ditambahkan!',
            'You clicked the button!',
            'success'
          );
        }

        Swal.fire(
          'Data berhasil ditambahkan!',
          'You clicked the button!',
          'success'
        );

        this.setToStorage();
        observer.next();
      } catch (error: any) {
        observer.error(error.message);
      }
    });
  }

  setToStorage(): void {
    this.storage.setItem(EMPLO, JSON.stringify(this.emploList));
  }

  // delete data
  remove(firstName: string, lastName: string): Observable<void> {
    return new Observable<void>((observer: Observer<void>): void => {
      try {
        for (let i = 0; i < this.emploList.length; i++) {
          if (
            this.emploList[i].firstName === firstName &&
            this.emploList[i].lastName === lastName
          ) {
            this.emploList.splice(i, 1);
            this.setToStorage();
            observer.next();
          }
        }
      } catch (error: any) {
        observer.error(error.message);
      }
    });
  }

  //method get id
  get(id: string): Observable<employee> {
    return new Observable<employee>((observer: Observer<employee>) => {
      try {
        const employee = this.emploList.find((e) => e.id == id) as employee;
        observer.next(employee);
        console.log(employee);
      } catch (error: any) {
        observer.error(error.message);
      }
    });
  }

  convert(event: any): Observable<void> {
    return new Observable<void>((observer: Observer<void>) => {
      try {
        const file = event.target.files[0];
        const reader = new FileReader();
        // reader.readAsBinaryString(file);
        reader.onload = () => {
          // let convertString = reader.result as string;
          // console.log(convertString);
          if (event) {
            this.imageSrc = reader.result as string;
          } else {
            this.imageSrc = '';
          }
          console.log(this.imageSrc);
        };
        reader.readAsDataURL(file);
        this.setToStorage();
        observer.next();
        // let convertString = reader.result as string;
        // this.emploList.map((t) => (t.image = convertString));
        // console.log(convertString);
        // this.setToStorage();
        // observer.next();
      } catch (err: any) {
        observer.error(err.message);
      }
    });
  }

  // readUrl(event: any) {
  //   if (event.target.files && event.target.files[0]) {
  //     var reader = new FileReader();

  //     reader.onload = (event: ProgressEvent) => {
  //       this.images = (<FileReader>event.target).result;
  //     };

  //     reader.readAsDataURL(event.target.files[0]);
  //   }
  // }

  // readUrl(event: any): Observable<void> {
  //   return new Observable<void>((observer: Observer<void>) => {
  //     try {
  //       if (event.target.files && event.target.files[0]) {
  //         var reader = new FileReader();

  //         reader.onload = (event: ProgressEvent) => {
  //           this.images = (<FileReader>event.target).result;
  //         };
  //         let convert = reader.readAsDataURL(event.target.files[0]);
  //         console.log(convert);
  //       }
  //       observer.next();
  //     } catch (error: any) {
  //       observer.error(error.message);
  //     }
  //   });
  // }
}

function makeid(length: number): string {
  var result = '';
  var characters = '0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
