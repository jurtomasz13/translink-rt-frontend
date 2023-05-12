import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Subject, catchError, throwError } from 'rxjs';
import { environment } from 'environment';

export interface Task {
  _id: string;
  name: string;
  description: string;
  isDone: boolean;
}

@Injectable({ providedIn: 'root' })
export class TasksService {
  tasks: Task[] = {} as Task[];
  tasksChanged = new BehaviorSubject<Task[] | null>(null);

  constructor(private http: HttpClient) {
    this.fetchTasks();
  }

  handleError(error: HttpErrorResponse) {
    if (error.status === 0)
      console.error('An client side error occured: ', error.error);
    else
      console.error(
        `Server returned code: ${error.status}, body was: `,
        error.error
      );
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }

  getTask(id: string) {
    return this.tasks?.find((task) => task._id === id);
  }

  createTask(name: string, description: string) {
    this.http
      .post<Task>(
        `${environment.apiBaseUrl}/tasks`,
        {
          name,
          description,
        },
        {
          headers: {
            Authorization: `${window.localStorage.getItem(
              'token_type'
            )} ${window.localStorage.getItem('access_token')}`,
          },
        }
      )
      .subscribe((task) => {
        this.tasks.push(task);
        this.tasksChanged.next(this.tasks);
      });
  }

  updateTask(id: string, name: string, description: string, isDone: boolean) {
    this.http
      .patch<Task>(
        `${environment.apiBaseUrl}/tasks/${id}`,
        {
          name,
          description,
          isDone,
        },
        {
          headers: {
            Authorization: `${window.localStorage.getItem(
              'token_type'
            )} ${window.localStorage.getItem('access_token')}`,
          },
        }
      )
      .subscribe((task) => {
        const index = this.tasks.findIndex((task) => task._id === id);
        this.tasks[index] = task;
        this.tasksChanged.next(this.tasks);
      });
  }

  removeTask(id: string) {
    this.http
      .delete(`${environment.apiBaseUrl}/tasks/${id}`, {
        headers: {
          Authorization: `${window.localStorage.getItem(
            'token_type'
          )} ${window.localStorage.getItem('access_token')}`,
        },
      })
      .subscribe(() => {
        this.tasks = this.tasks.filter((task) => task._id !== id);
        this.tasksChanged.next(this.tasks);
      });
  }

  fetchTasks() {
    this.http
      .get<Task[]>(`${environment.apiBaseUrl}/tasks`, {
        headers: {
          Authorization: `${window.localStorage.getItem(
            'token_type'
          )} ${window.localStorage.getItem('access_token')}`,
        },
      })
      .pipe(catchError(this.handleError))
      .subscribe((tasks) => {
        this.tasksChanged.next(tasks);
        this.tasks = tasks;
      });
  }
}
