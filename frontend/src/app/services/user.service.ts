import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../shared/models/User';
import { IUserLogin } from '../shared/interfaces/IUserLogin';
import { HttpClient } from '@angular/common/http';
import { USER_LOGIN_URL, USER_REGISTER_URL, USER_URL } from '../shared/constants/urls';
import { ToastrService } from 'ngx-toastr';
import { IUserRegister } from '../shared/interfaces/IUserRegister';

const USER_KEY = 'User';
const apiUrl = '/api/users';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<User>(this.getUserFromLocalStorage());
  public userObservable:Observable<User>;
  private _loggedInUser?: User;
  user!:User;
  


  constructor(private http:HttpClient, private toastrService:ToastrService) { 
    this.userObservable = this.userSubject.asObservable();
  }

  public get currentUser():User{
    return this.userSubject.value;
  }

  public updateUser(user: User):Observable<User> {
    return this.http.put<User>(`${USER_URL}/${user.id}`, user).pipe(
      tap({
        next: (updatedUser) => {
          this.setUserToLocalStorage(updatedUser);
          this.userSubject.next(updatedUser);
          this.toastrService.success(
            `Your account details have been updated successfully!`,
            'Update Successful'
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(
            'There was an error while updating your account details. Please try again later.',
            'Update Failed'
          );
        }
      })
    );
  }


  loggedIn() {
    return !!localStorage.getItem(USER_KEY)
  }

  getUsers() {
    return this.http.get(USER_URL);
  }

  login(userLogin:IUserLogin):Observable<User>{
    return this.http.post<User>(USER_LOGIN_URL, userLogin).pipe(
      tap({
        next: (user) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user)
          this.toastrService.success(
            `Welcome to EatMore ${user.name}!`,
            'Login Successful'
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Login Failed');
        }
      })
    );
  }

  register(userRegister:IUserRegister): Observable<User>{
    return this.http.post<User>(USER_REGISTER_URL, userRegister).pipe(
      tap({
        next: (user) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(
            `Welcome to EatMore ${user.name}!`,
            'Register Successful'
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error,
            'Register Failed')
        }
      })
    );
  }
  
  deleteUser(userId: string): Observable<void> {
    const url = `${USER_URL}/${userId}`;
    return this.http.delete<void>(url);
  }

  
  
  

  logout(){
    this.userSubject.next(new User());
    localStorage.removeItem(USER_KEY);
    window.location.reload();
  }

  private setUserToLocalStorage(user:User){
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private getUserFromLocalStorage():User{
    const userJson = localStorage.getItem(USER_KEY);
    if(userJson) return JSON.parse(userJson) as User;
    return new User();
  }

  
  
}
