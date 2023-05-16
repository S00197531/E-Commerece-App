import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent implements OnInit{

  user:User = new User();
  isEditMode: boolean = false;

  constructor(private userService:UserService){}

  ngOnInit() {

    this.userService.userObservable.subscribe((user) => {
      this.user = user;
      // Handle the updated user information
    });

    this.user = this.userService.currentUser;
    
  }

  toggleEditMode() {
    if(this.isEditMode) {
      this.userService.updateUser(this.user).subscribe(
        (updatedUser: User) => {
          this.user = updatedUser;
          this.isEditMode = false;
          console.log('User updated successfully.');
        },
        (error) => {
          console.log('Error updating user:', error)
        }
      );
    } else {
      this.isEditMode = true;
    }
  }

  

}
