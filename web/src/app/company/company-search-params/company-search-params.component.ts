import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, map, startWith } from 'rxjs';
import { CandidateSearch } from 'src/app/candidate/candidate';
import { CandidateService } from 'src/app/candidate/candidate.service';
import { Country } from 'src/app/shared/Country';
import { Language } from 'src/app/shared/Language';
import { Personality } from 'src/app/shared/Personality';
import { Skill } from 'src/app/shared/skill';
import { CompanyService } from '../company.service';
import { CollegeDegree } from 'src/app/shared/CollegeDegree';

@Component({
  selector: 'app-company-search-params',
  templateUrl: './company-search-params.component.html',
  styleUrls: ['./company-search-params.component.css']
})
export class CompanySearchParamsComponent implements OnInit {

  candidates: CandidateSearch[] = []; 
  activeSearch: boolean = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  searchCandidatesForm!: FormGroup;
  countries!: Country[];
  personalities!: Personality[];
  collegeDegrees: CollegeDegree[] = [];
  objectLanguages!: Language[];
  languages!: string[];
  filteredLanguages!: Observable<string[]>;
  selectedLanguages: string[] = []
  objectTechs!: Skill[];
  techs!: string[];
  filteredTechs!: Observable<string[]>;
  selectedTechs: string[] = []
  objectStudyAreas!: Skill[];
  studyAreas!: string[];
  filteredStudyAreas!: Observable<string[]>;
  selectedStudyAreas: string[] = []
  objectRoles!: Skill[];
  roles!: string[];
  filteredRoles!: Observable<string[]>;
  selectedRoles: string[] = []

  constructor(
    private formBuilder: FormBuilder,
    private candidateService: CandidateService,
    private companyService: CompanyService
  ) { }

  loadCandidates() {
    /* this.candidates = []; */

    let countries = [
      new Country(1, "CO", "COL", "Colombia", "Colombian@"),
      new Country(2, "AR", "ARG", "Argentina", "Argentin@")
    ];

    let skills = [
      new Skill(1, "Python"),
      new Skill(2, "Java"),
      new Skill(3, "Desarrollo de software")
    ]

    let roles = [
      new Skill(1, "Tester"),
      new Skill(2, "Developer"),
      new Skill(3, "Scrum Master")
    ]

    let languages = [
      new Language("ES", "Español"),
      new Language("EN", "Inglés"),
      new Language("FR", "Francés")
    ]

    this.candidates = [
      new CandidateSearch(
        "Juan", 
        "Perez", 
        "juan.perez@email.com", 
        "Bogota", 
        countries[0], 
        [skills[1]],
        [roles[0], roles[1]],
        []
      ),
      new CandidateSearch(
        "Juan", 
        "Perez", 
        "juan.perez@email.com", 
        "Bogota", 
        countries[0], 
        [],
        [],
        []
      )
    ];
    for(let i = 0; i < 10; i++) {
      this.candidates.push(
        new CandidateSearch(
          "Pedro Samuel", 
          "Gutierrez Saldarriaga", 
          "emailmuuuylargooooo@email.com", 
          "Buenos aires", 
          countries[1], 
          [...skills],
          [...roles],
          [...languages]
        )
      );
    }
  }

  ngOnInit() {
    this.loadCandidates();

    this.countries = []
    this.candidateService.getCountries().subscribe({
      next: (response) => this.countries = response.data
    })

    this.personalities = []
    this.companyService.getPersonalities().subscribe({
      next: (response) => this.personalities = response.data
    })

    this.collegeDegrees = []
    this.candidateService.getCollegeDegrees().subscribe({
      next: (response) => {
        this.collegeDegrees = response.data;
      }
    })

    this.techs = []
    this.objectTechs = []
    this.candidateService.getTechnicalInfoTypes().subscribe({
      next: (response) => {
        this.objectTechs = response.data
        this.techs = this.objectTechs.map(tech => tech.name)
        this.filteredTechs = this.searchCandidatesForm.controls['technical_info_types'].valueChanges.pipe(
          startWith(null),
          map((tech: string | null) => (tech ? this._filterTech(tech) : this.techs.slice())),
        );
      }
    })

    this.languages = []
    this.objectLanguages = []
    this.candidateService.getLanguages().subscribe({
      next: (response) => {
        this.objectLanguages = response.data
        this.languages = this.objectLanguages.map(lang => lang.name)
        this.filteredLanguages = this.searchCandidatesForm.controls['languages'].valueChanges.pipe(
          startWith(null),
          map((language: string | null) => (language ? this._filterLanguage(language) : this.languages.slice())),
        );
      }
    })

    /* this.studyAreas = []
    this.objectStudyAreas = []
    this.candidateService.getCollegeDegrees().subscribe({
      next: (response) => {
        this.objectStudyAreas = response.data
        this.languages = this.objectLanguages.map(lang => lang.name)
        this.filteredLanguages = this.searchCandidatesForm.controls['languages'].valueChanges.pipe(
          startWith(null),
          map((language: string | null) => (language ? this._filterLanguage(language) : this.languages.slice())),
        );
      }
    }) */

    this.roles = []
    this.objectRoles = []
    this.candidateService.getSkills().subscribe({
      next: (response) => {
        this.objectRoles = response.data
        this.roles = this.objectRoles.map(role => role.name)
        this.filteredRoles = this.searchCandidatesForm.controls['roles'].valueChanges.pipe(
          startWith(null),
          map((role: string | null) => (role ? this._filterRole(role) : this.roles.slice())),
        );
      }
    })
 

    this.searchCandidatesForm = this.formBuilder.group(
      {
        country_code: [, []],
        languages: [, []],
        technical_info_types: [, []],
        personality_code: [, []],
        least_academic_level: [, []],
        study_areas: [, []],
        roles: [, []],
      }
    )
  }

  enableSearch() {
    this.activeSearch = true;
  }

  searchCandidates() {
    console.log("search candidates");
  }

  removeLanguage(language: string): void {
    const index = this.selectedLanguages.indexOf(language);
    if (index >= 0) {
      this.selectedLanguages.splice(index, 1);
    }
  }

  addLanguage(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.selectedLanguages.push(value);
    }
    event.chipInput!.clear();
  }

  selectedLanguage(event: MatAutocompleteSelectedEvent): void {
    const index = this.selectedLanguages.indexOf(event.option.viewValue);
    if (index < 0) {
      this.selectedLanguages.push(event.option.viewValue);
      this.searchCandidatesForm.get('languages')!.setValue(null);
    }
  }

  private _filterLanguage(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.languages.filter(language => language.toLowerCase().includes(filterValue));
  }

  removeTech(tech: string): void {
    const index = this.selectedTechs.indexOf(tech);
    if (index >= 0) {
      this.selectedTechs.splice(index, 1);
    }
  }

  addTech(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.selectedTechs.push(value);
    }
    event.chipInput!.clear();
  }

  selectedTech(event: MatAutocompleteSelectedEvent): void {
    const index = this.selectedTechs.indexOf(event.option.viewValue);
    if (index < 0) {
      this.selectedTechs.push(event.option.viewValue);
      this.searchCandidatesForm.get('technical_info_types')!.setValue(null);
    }
  }

  private _filterTech(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.techs.filter(tech => tech.toLowerCase().includes(filterValue));
  }

  removeStudyArea(studyArea: string): void {
    const index = this.selectedStudyAreas.indexOf(studyArea);
    if (index >= 0) {
      this.selectedStudyAreas.splice(index, 1);
    }
  }

  addStudyArea(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.selectedStudyAreas.push(value);
    }
    event.chipInput!.clear();
  }

  selectedStudyArea(event: MatAutocompleteSelectedEvent): void {
    const index = this.selectedStudyAreas.indexOf(event.option.viewValue);
    if (index < 0) {
      this.selectedStudyAreas.push(event.option.viewValue);
      this.searchCandidatesForm.get('study_areas')!.setValue(null);
    }
  }

  private _filterStudyArea(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.studyAreas.filter(studyArea => studyArea.toLowerCase().includes(filterValue));
  }

  removeRole(role: string): void {
    const index = this.selectedRoles.indexOf(role);
    if (index >= 0) {
      this.selectedRoles.splice(index, 1);
    }
  }

  addRole(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.selectedRoles.push(value);
    }
    event.chipInput!.clear();
  }

  selectedRole(event: MatAutocompleteSelectedEvent): void {
    const index = this.selectedRoles.indexOf(event.option.viewValue);
    if (index < 0) {
      this.selectedRoles.push(event.option.viewValue);
      this.searchCandidatesForm.get('roles')!.setValue(null);
    }
  }

  private _filterRole(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.roles.filter(role => role.toLowerCase().includes(filterValue));
  }

}
