import { Component, OnInit } from '@angular/core';
import { Header } from '../../components/header/header';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Persons } from '../../services/persons';
import { PersonDetail } from '../../services/persons';
import { PersonService } from '../../services/person';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog, ConfirmDialogData } from '../../components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-home',
  imports: [Header, MatPaginator, MatButton, MatIcon, MatFormField, MatInput, FormsModule, MatButtonModule, MatSort, MatPaginator, MatTableModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  constructor(private router: Router, private personsService: Persons, private personService: PersonService, private dialog: MatDialog) {}
  
  searchTerm: string = '';

  displayedColumns: string[] = ['id', 'nit', 'name', 'address', 'phone_number', 'actions'];

  dataSource = new MatTableDataSource<PersonDetail>([]);

  totalElements: number = 0;
  pageSize: number = 5;
  currentPage: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort

  ngOnInit() {
    this.loadPersonsData();
  }

  loadPersonsData() {
    this.personsService.getPersons(
      this.currentPage, 
      this.pageSize,
      this.searchTerm,
    ).subscribe(data => {
      this.dataSource.data = data.people; 
      this.totalElements = data.totalElements;
      this.pageSize = data.size;
      this.paginator.pageIndex = this.currentPage; 
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onSearchChange() {
    this.currentPage = 0;
    this.loadPersonsData();
  }

  clearSearch() {
    if (this.searchTerm) {
        this.searchTerm = '';
        this.currentPage = 0; 
        this.loadPersonsData();
    }
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPersonsData();
  }

  createPerson() {
    this.router.navigate(['/person/create']);
  }

  viewPerson(person: PersonDetail) {
    this.router.navigate(['/person', person.id]);
  }

  editPerson(person: PersonDetail) {
    this.router.navigate(['/person/edit/', person.id]);
  }

  deletePerson(person: PersonDetail) {
    if (!person.id) {
        return;
    }

    const dialogRef = this.dialog.open(ConfirmDialog, {
        width: '400px',
        data: {
            title: `Eliminar Persona: ${person.name}`,
            message: 'Esta acción es irreversible. ¿Estás seguro de que deseas eliminar esta persona?',
        } as ConfirmDialogData,
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
            this.personService.deletePerson(person.id!).subscribe({
                next: () => {
                    this.loadPersonsData(); 
                },
                error: (err) => {
                    console.error('Error al eliminar persona:', err);
                }
            });
        }
    });
}
}
