import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { EmployeeModel } from './employee-dashboard.modal';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule,CommonModule],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.css',
  providers: [ApiService]
})
export class EmployeeDashboardComponent implements OnInit {
  formValue !: FormGroup;
  employeeModelObj: EmployeeModel = new EmployeeModel();
  employeeData !: any;
  currentMaxId: number = 0;
  
  constructor(private formBuilder: FormBuilder, private api: ApiService) {}
  
  ngOnInit(): void {
    this.formValue = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      mobile: [''],
      salary: ['']
    })
    this.getAllEmployee();
  }
  
  postEmployeeDetails(){
    this.employeeModelObj.firstName = this.formValue.value.firstName;
    this.employeeModelObj.lastName = this.formValue.value.lastName;
    this.employeeModelObj.email = this.formValue.value.email;
    this.employeeModelObj.mobile = this.formValue.value.mobile;
    this.employeeModelObj.salary = this.formValue.value.salary;
    
    // Convert currentMaxId to string for the ID to match db.json format
    this.employeeModelObj.id = this.currentMaxId + 1;
    
    // Convert the ID to string when sending to the API
    const employeeToSave = {
      ...this.employeeModelObj,
      id: String(this.employeeModelObj.id)
    };

    this.api.postEmployee(employeeToSave)
    .subscribe(res => {
      console.log(res);
      alert("employee added successfully");
      this.formValue.reset();
      this.getAllEmployee();
    },
    err => {
      alert("something went wrong");
    });
  }
  
  getAllEmployee() {
    this.api.getALLEmployee().subscribe(res => {
      this.employeeData = res;
      
      // Find the maximum ID from the retrieved data
      if (this.employeeData && this.employeeData.length > 0) {
        // Convert string IDs to numbers before finding max
        const numericIds = this.employeeData.map((emp: any) => parseInt(emp.id, 10));
        // Filter out NaN values (in case there are non-numeric IDs)
        const validIds = numericIds.filter((id: number) => !isNaN(id));
        
        if (validIds.length > 0) {
          this.currentMaxId = Math.max(...validIds);
        } else {
          this.currentMaxId = 0;
        }
      }
    });
  }
  
  deleteEmployee(row: any){
    this.api.deleteEmployee(row.id).subscribe(res => {
      alert("Employee deleted successfully");
      this.getAllEmployee();
    })
  }
  
  onEdit(row: any) {
    // Convert string ID to number if needed
    this.employeeModelObj.id = typeof row.id === 'string' ? parseInt(row.id, 10) : row.id;
    this.formValue.controls['firstName'].setValue(row.firstName);
    this.formValue.controls['lastName'].setValue(row.lastName);
    this.formValue.controls['email'].setValue(row.email);
    this.formValue.controls['mobile'].setValue(row.mobile);
    this.formValue.controls['salary'].setValue(row.salary);
  }
  
  updateEmployeeDetails() {
    this.employeeModelObj.firstName = this.formValue.value.firstName;
    this.employeeModelObj.lastName = this.formValue.value.lastName;
    this.employeeModelObj.email = this.formValue.value.email;
    this.employeeModelObj.mobile = this.formValue.value.mobile;
    this.employeeModelObj.salary = this.formValue.value.salary;
    
    // Convert ID to string when updating
    const employeeToUpdate = {
      ...this.employeeModelObj,
      id: String(this.employeeModelObj.id)
    };
    
    this.api.updateEmployee(employeeToUpdate, this.employeeModelObj.id)
      .subscribe(res => {
        alert("Update successfuly");
        this.formValue.reset();
        this.getAllEmployee();
      });
  }
}
