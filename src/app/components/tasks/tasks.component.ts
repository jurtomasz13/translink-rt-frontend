import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'environment';
import { Subscription } from 'rxjs';
import { Task, TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit, OnDestroy {
  tasks: Task[] = [] as Task[];
  tasksSub?: Subscription;
  isFetching = true;

  constructor(private tasksService: TasksService) {}

  ngOnInit() {
    this.tasksService.tasksChanged.subscribe(
      (data) => (this.tasks = data as Task[])
    );

    this.isFetching = false;
  }

  ngOnDestroy() {
    this.tasksSub?.unsubscribe();
  }
}
