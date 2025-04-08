import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, switchMap, tap, forkJoin, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = "http://localhost:3000/posts";

  constructor(private http: HttpClient) { }

  postEmployee(data: any) {
    return this.http.post<any>(this.apiUrl, data)
      .pipe(
        switchMap(res => this.reorderEmployeeIds().pipe(map(() => res)))
      );
  }

  getEmployee() {
    return this.http.get<any>(this.apiUrl)
      .pipe(map((res: any) => {
        return res;
      }));
  }

  getALLEmployee() {
    return this.http.get<any>(this.apiUrl).pipe(map(res => res));
  }

  deleteEmployee(id: string | number) { 
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(
        switchMap(res => this.reorderEmployeeIds().pipe(map(() => res)))
      );
  }
  
  updateEmployee(data: any, id: string | number) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data)
      .pipe(
        switchMap(res => this.reorderEmployeeIds().pipe(map(() => res)))
      );
  }

  /**
   * Reorders all employee IDs to maintain sequential ordering (0, 1, 2, ...)
   * This is called after each CRUD operation to ensure IDs remain sequential
   */
  private reorderEmployeeIds(): Observable<any> {
    return this.getALLEmployee().pipe(
      switchMap(employees => {
        if (!employees || employees.length === 0) {
          return of(null);
        }

        // Sort employees by existing numeric ID
        const sortedEmployees = [...employees].sort((a, b) => {
          const idA = parseInt(a.id, 10);
          const idB = parseInt(b.id, 10);
          return idA - idB;
        });

        // Create an array of update operations
        const updateOperations = sortedEmployees.map((employee, index) => {
          // Only update if the ID has changed
          if (employee.id !== String(index)) {
            const updatedEmployee = { ...employee, id: String(index) };
            // We need to use the original ID for the URL but the new ID in the data
            return this.http.put<any>(`${this.apiUrl}/${employee.id}`, updatedEmployee);
          }
          return of(null);
        }).filter(op => op !== null);

        // If no updates are needed, return immediately
        if (updateOperations.length === 0) {
          return of(null);
        }

        // Execute all update operations in parallel
        return forkJoin(updateOperations);
      })
    );
  }
}
