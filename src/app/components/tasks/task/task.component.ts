import { Component, Input } from '@angular/core';
import { Task, TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent {
  @Input() task!: Task;

  constructor(private tasksService: TasksService) {}

  onDelete() {
    this.tasksService.removeTask(this.task._id);
  }

  onStatusChange() {
    this.tasksService.updateTask(
      this.task._id,
      this.task.name,
      this.task.description,
      !this.task.isDone
    );
  }
}
