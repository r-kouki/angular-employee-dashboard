import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = "http://localhost:3000/posts";

  constructor(private http: HttpClient) { }

  postEmployee(data: any) {
    return this.http.post<any>(this.apiUrl, data)
      .pipe(map((res: any) => {
        return res;
      }));
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
      .pipe(map((res: any) => {
        return res;
      }));
  }
  
  updateEmployee(data: any, id: string | number) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data)
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
