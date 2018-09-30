import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { Actions, Effect, ofType  } from '@ngrx/effects';

import {
  UsersActionTypes,
  UsersListActionsUnion,
  LoadUsers,
  LoadUsersSuccess,
  LoadUsersFail
} from './users.actions';

import {catchError, map, switchMap, retry} from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UsersService } from '../services/users.service';

@Injectable()
export class UsersEffects {

  constructor(
    private actions: Actions,
    private usersService: UsersService,
    private router: Router,
  ) {}

  @Effect()
  loadAllUsers$: Observable<Action> = this.actions.ofType(UsersActionTypes.LoadUsers).pipe(
    map((action: LoadUsers) => action),
    switchMap(() =>
      this.usersService.getAllUsers().pipe(
        retry(3),
        map((result: any) => new LoadUsersSuccess(result)),
        catchError(error => of(new LoadUsersFail(error)))
      )
    )
  );

}