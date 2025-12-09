import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-dialog-form-credentials',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './dialog-form-credentials.html',
  styleUrl: './dialog-form-credentials.css',
})
export class DialogFormCredentials implements OnInit {
  certificationForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogFormCredentials>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.certificationForm = this.fb.group({
      type: ['', Validators.required],
      organization: ['', Validators.required],
      acquired_credential: ['', Validators.required],
      year: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]], 
    });

    if (this.data && Object.keys(this.data).length > 0) {
      this.certificationForm.patchValue(this.data);
    }
  }


  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.certificationForm.valid) {
      this.dialogRef.close(this.certificationForm.value);
    } else {
      this.certificationForm.markAllAsTouched();
    }
  }
}
