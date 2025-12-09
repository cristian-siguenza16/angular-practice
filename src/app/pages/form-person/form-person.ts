import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { ActivatedRoute, Router } from '@angular/router';
import { DialogFormCredentials } from '../../components/dialog-form-credentials/dialog-form-credentials';
import { MatDivider } from '@angular/material/divider';
import { Header } from '../../components/header/header';
import { Certification, PersonDetail } from '../../services/persons';
import { PersonService } from '../../services/person';

@Component({
  selector: 'app-form-person',
  imports: [
    CommonModule,
    Header,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    MatDivider,
  ],
  templateUrl: './form-person.html',
  styleUrl: './form-person.css',
})
export class FormPerson implements OnInit {
  
  personForm!: FormGroup;
  isEditMode: boolean = false;
  personId: number | null = null;
  
  // Certifications table
  displayedCertColumns: string[] = ['type', 'organization', 'acquired_credential', 'year', 'actions'];
  certificationsDataSource: MatTableDataSource<Certification> = new MatTableDataSource<Certification>([]);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private personService: PersonService,
  ) {}

  // Handles the logic of validate the form and also if is editing or creating.
  ngOnInit(): void {
    this.personForm = this.fb.group({
      id: [null],
      nit: ['', [Validators.required, Validators.pattern(/^[0-9]+(-[0-9]+)?$/)]],
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone_number: ['', [Validators.required, Validators.pattern(/^[0-9]{8,15}$/)]],
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.personId = +id;
        this.loadPersonData(this.personId);
      } else {
        this.isEditMode = false;
      }
    });
  }

  // Handles the logic of add certifications

  openCertificationDialog(certification?: Certification): void {
    const dialogRef = this.dialog.open(DialogFormCredentials, {
      width: '400px',
      data: certification ? { ...certification } : {}
    });

    dialogRef.afterClosed().subscribe((result: Certification | undefined) => {
      if (result) {
        let currentCerts = this.certificationsDataSource.data;
        
        if (certification) {
          const index = currentCerts.findIndex(c => c === certification);
          if (index > -1) {
            currentCerts[index] = { ...result, id: certification.id };
          }
        } else {
          const tempId = -Math.floor(Math.random() * 100000);
          currentCerts = [...currentCerts, { ...result, id: tempId }];
        }
        this.certificationsDataSource.data = currentCerts;
      }
    });
  }
  
  deleteCertification(cert: Certification): void {
    const currentCerts = this.certificationsDataSource.data.filter(c => c !== cert);
    this.certificationsDataSource.data = currentCerts;
  }
  
  // Handles the logic of create or update a person

  onSave(): void {
    if (this.personForm.invalid) {
      this.personForm.markAllAsTouched();
      return;
    }

    const finalPersonData: PersonDetail = {
      ...this.personForm.value,
      educational_credentials: this.certificationsDataSource.data.map(cert => ({
        ...cert,
        id: (cert.id && cert.id > 0) ? cert.id : null
      }))
    };
    if (this.isEditMode && this.personId) {
      this.personService.updatePerson(this.personId, finalPersonData).subscribe({
        next: () => {
            this.router.navigate(['/home']); 
        },
        error: (err) => {
            console.error('Error', err);
        }
      });
    } else {
      delete finalPersonData.id
      this.personService.createPerson(finalPersonData).subscribe({
        next: () => {
            this.router.navigate(['/home']); 
        },
        error: (err) => {
            console.error('Error', err);
        }
      });
    }
    this.router.navigate(['/']);
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }

  // Handles the logic of load the persons when is in editing mode

  loadPersonData(id: number) {
    this.personService.getPerson(
      id
    ).subscribe(data => {
      this.personForm.patchValue(data);
      this.certificationsDataSource.data = data.educational_credentials;
    });    
  }

  navigateBackHome(): void {
    this.router.navigate(['/']);
  }
}
