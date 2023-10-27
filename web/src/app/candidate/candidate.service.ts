import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CandidateLoginRequest, CandidateFormRegister, CandidateServiceSchema, PersonalInfoResponse, SavePersonalInfoRequest } from './candidate';
import { CountryResponse } from '../shared/Country';
import { LanguageResponse } from '../shared/Language';
import { CollegeDegree, CollegeDegreeResponse } from '../shared/CollegeDegree';
import { X } from '@angular/cdk/keycodes';
import { Career, CareerResponse, CareerServiceSchema } from './career';
import { Job, JobResponse, JobServiceSchema } from './job';
import { SkillResponse } from '../shared/skill';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private backCandidateUrl = environment.baseUrl + 'candidatos';
  private backUtilsUrl = environment.baseUrl + 'candidatos/utils';
  private backUsersUrl = environment.baseUrl + 'usuarios';

  constructor(private http: HttpClient) { }

  userSignUp(candidate: CandidateFormRegister): Observable<any> {
    let candidateServiceSchema = new CandidateServiceSchema(
      candidate.names,
      candidate.lastnames,
      candidate.email,
      candidate.password
    );
    return this.http.post<any>(`${this.backCandidateUrl}/crear`, candidateServiceSchema);
  }

  login(credentials: CandidateLoginRequest): Observable<any> {
    return this.http.post<any>(`${this.backUsersUrl}/login`, credentials);
  }

  getCountries(): Observable<CountryResponse> {
    return this.http.get<CountryResponse>(`${this.backUtilsUrl}/countries`)
  }

  getLanguages(): Observable<LanguageResponse> {
    return this.http.get<LanguageResponse>(`${this.backUtilsUrl}/languages`)
  }

  getPersonalInfo(token: string): Observable<PersonalInfoResponse> {

    const headers = this.getHeader(token)

    return this.http.get<PersonalInfoResponse>(`${this.backCandidateUrl}/personal-info`, { headers })
  }

  updatePersonalInfo(request: SavePersonalInfoRequest, token: string): Observable<any> {

    const headers = this.getHeader(token)

    return this.http.post<PersonalInfoResponse>(`${this.backCandidateUrl}/personal-info`, request, { headers })
  }

  getHeader(token: string) {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  getCollegeDegrees(): Observable<CollegeDegreeResponse> {
    return this.http.get<CollegeDegreeResponse>(`${this.backUtilsUrl}/title-types`)
  }

  getCareersInfo(token: string): Observable<CareerResponse> {
    const headers = this.getHeader(token);
    return this.http.get<CareerResponse>(`${this.backCandidateUrl}/academic-info`, { headers })
  }

  addCareerInfo(career: Career, token: string): Observable<any> {
    const headers = this.getHeader(token);
    let request = new CareerServiceSchema(
      career.id,
      career.collegeDegree.id,
      career.careerTitle,
      career.school,
      career.careerStart,
      career.careerEnd,
      career.achievement
    );

    return this.http.post<CareerResponse>(
      `${this.backCandidateUrl}/academic-info`, request, { headers })
  }

  updateCareerInfo(career: Career, token: string): Observable<any> {
    const headers = this.getHeader(token);
    let request = new CareerServiceSchema(
      career.id,
      career.collegeDegree.id,
      career.careerTitle,
      career.school,
      career.careerStart,
      career.careerEnd,
      career.achievement
    );
    return this.http.post<CareerResponse>(
      `${this.backCandidateUrl}/academic-info/${request.id}`, request, { headers })
  }

  deleteCareerInfo(careerId: number, token: string): Observable<any> {
    const headers = this.getHeader(token);
    return this.http.delete<CareerResponse>(
      `${this.backCandidateUrl}/academic-info/${careerId}`, { headers })
  }

 /*  updateCareersInfo(request: Career[], token: string): Observable<any> {
    const headers = this.getHeader(token);
    return this.http.post<CareerResponse>(
      `${this.backCandidateUrl}/academic-info`, request, { headers })
  } */

  getSkills(): Observable<SkillResponse> {
    return this.http.get<SkillResponse>(`${this.backUtilsUrl}/skills`)
  }

  getJobsInfo(token: string): Observable<JobResponse> {
    const headers = this.getHeader(token);
    return this.http.get<JobResponse>(`${this.backCandidateUrl}/work-info`, { headers })
  }

  addJobInfo(job: Job, token: string): Observable<any> {
    const headers = this.getHeader(token);
    let request = new JobServiceSchema(
      job.id,
      job.role,
      job.company,
      job.description,
      job.skills,
      /* job.jobStart, */
      `${job.jobStart}-01-01`, /* TODO: eliminar cuando el api reciba años */
      /* job.jobEnd */
      `${job.jobEnd}-12-31` /* TODO: eliminar cuando el api reciba años */
    );
    console.log(request);

    return this.http.post<JobResponse>(
      `${this.backCandidateUrl}/work-info`, request, { headers })
  }

  updateJobInfo(job: Job, token: string): Observable<any> {
    const headers = this.getHeader(token);
    let request = new JobServiceSchema(
      job.id,
      job.role,
      job.company,
      job.description,
      job.skills,
      /* job.jobStart, */
      `${job.jobStart}-01-01`, /* TODO: eliminar cuando el api reciba años */
      /* job.jobEnd */
      `${job.jobEnd}-12-31` /* TODO: eliminar cuando el api reciba años */
    );
    return this.http.post<JobResponse>(
      `${this.backCandidateUrl}/work-info/${request.id}`, request, { headers })
  }

  deleteJobInfo(jobId: number, token: string): Observable<any> {
    const headers = this.getHeader(token);
    return this.http.delete<JobResponse>(
      `${this.backCandidateUrl}/work-info/${jobId}`, { headers })
  }

}
  