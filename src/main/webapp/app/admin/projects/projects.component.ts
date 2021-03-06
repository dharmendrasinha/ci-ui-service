import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ProjectsService } from './projects.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'jhi-projects',
  templateUrl: './projects.component.html'
})
export class ProjectsComponent implements OnInit {
  displayedColumns: string[] = [
    'projectNo',
    'projName',
    'program',
    'member',
    'projectStatus',
    'commitmentStatus',
    'commitmentBalance',
    'commitmentExpiration'
  ];
  dataSource: any;
  controlList: any;
  searchForm: FormGroup;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private projectsService: ProjectsService, private fb: FormBuilder) {
    this.pageLoad();
  }

  ngOnInit() {
    this.projectsService.getSearchControls().subscribe((res: any) => {
      this.controlList = res;
    });
    this.searchForm = this.fb.group({
      projectNo: '',
      projectName: '',
      program: [null],
      member: [null],
      projectStatus: [null],
      commitmentStatus: [null]
    });
  }

  syncPrimaryPaginator(event: PageEvent) {
    this.paginator.pageIndex = event.pageIndex;
    this.paginator.pageSize = event.pageSize;
    this.paginator.page.emit(event);
  }

  pageLoad() {
    this.projectsService.getProjectList().subscribe((res: any) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  search() {
    const queryString = Object.keys(this.searchForm.getRawValue())
      .map(key => key + '=' + (this.searchForm.getRawValue()[key] !== '' ? this.searchForm.getRawValue()[key] : null))
      .join('&');
    this.projectsService.searchProject(queryString).subscribe((res: any) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
}
