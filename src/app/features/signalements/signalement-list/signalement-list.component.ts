import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

import { SignalementService } from '../../../core/services/signalement.service';
import { Signalement } from '../../../core/models/signalement.model';

@Component({
  selector: 'app-signalement-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
  ],
  templateUrl: './signalement-list.template.html',
  styleUrl: './signalement-list.scss',
})
export class SignalementListComponent implements OnInit, AfterViewInit {
  constructor(private signalementService: SignalementService) {}

  displayedColumns: string[] = ['id', 'author', 'email', 'description', 'observations'];
  dataSource = new MatTableDataSource<Signalement>([]);
  isLoading = true;
  errorMessage: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadSignalements();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadSignalements(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.signalementService.getAll().subscribe({
      next: (signalements) => {
        this.dataSource.data = signalements;
        this.isLoading = false;
      },
      error: (e) => {
        this.errorMessage = 'Impossible de charger la liste des signalements.';
        this.isLoading = false;
      },
    });
  }

  trackById(index: number, item: Signalement): number {
    return item.id;
  }
}
