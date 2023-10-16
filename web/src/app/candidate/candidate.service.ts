import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CandidateFormRegister, CandidateServiceSchema } from './candidate';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private backCandidateUrl = environment.backCandidateUrl;

  constructor(private http: HttpClient) { }

  userSignUp(candidate: CandidateFormRegister): Observable<any> {
    let candidateServiceSchema = new CandidateServiceSchema(
      candidate.names,
      candidate.lastnames,
      candidate.email,
      candidate.password
    );
    return this.http.post<any>(`${this.backCandidateUrl}/crear`,candidateServiceSchema);
  }

}
