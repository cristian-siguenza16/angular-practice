import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Header } from '../../components/header/header';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DialogFormCredentials } from '../../components/dialog-form-credentials/dialog-form-credentials';
import { Certification, PersonDetail } from '../../services/persons';
import { PersonService } from '../../services/person';

@Component({
  selector: 'app-person',
  imports: [
    CommonModule,
    Header,
    MatCardModule, 
    MatDividerModule, 
    MatListModule, 
    MatTableModule,
    MatIcon,
    MatButtonModule,
  ],
  templateUrl: './person.html',
  styleUrl: './person.css',
})
export class Person implements OnInit {
  
  personId: number | null = null;
  personDetail: PersonDetail | null = null;
  
  // Table headers certifications
  displayedCertColumns: string[] = ['id', 'type', 'organization', 'acquired_credential', 'year'];
  certificationsDataSource: MatTableDataSource<Certification> = new MatTableDataSource<Certification>([]);

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    public dialog: MatDialog,
    private personService: PersonService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.personId = +id;
        this.loadPersonData(this.personId);
      }
    });
  }

  // Handles the logic of get all data
  loadPersonData(id: number) {
    this.personService.getPerson(
      id
    ).subscribe(data => {
      this.personDetail = data
      this.certificationsDataSource.data = data.educational_credentials
    });
  }

  navigateBackHome() {
    this.router.navigate(['/']);
  }

  createNewCertification(): void {
    const dialogRef = this.dialog.open(DialogFormCredentials, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result: Certification | undefined) => {
      if (result) {
        this.personDetail?.educational_credentials.push(result);
        this.certificationsDataSource.data.push(result);
      }
    });
  }
}
