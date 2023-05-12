import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Task, TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent implements OnInit {
  @ViewChild('form') form!: NgForm;
  @ViewChild('name') name!: NgModel;
  @ViewChild('description') description!: NgModel;
  formTouched = false;
  editMode = false;
  id?: string;
  currentTask?: Task;

  constructor(
    private tasksService: TasksService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  onSubmit() {
    this.formTouched = true;

    if (!this.form.valid && !this.name.value) return;

    if (this.editMode) {
      this.tasksService.updateTask(
        this.currentTask!._id,
        this.name.value,
        this.description.value,
        this.currentTask!.isDone
      );
    } else {
      this.tasksService.createTask(this.name.value, this.description.value);
    }

    this.router.navigate(['..']);
  }

  ngOnInit() {
    this.route.url.subscribe((url) => {
      const lastPath = url[url.length - 1]?.path;
      if (lastPath !== 'edit') return;
      this.editMode = true;
      this.id = url[url.length - 2]!.path;
      this.currentTask = this.tasksService.getTask(this.id);
    });
  }
}
