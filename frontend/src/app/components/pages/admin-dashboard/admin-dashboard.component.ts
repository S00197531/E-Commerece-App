import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit{

  users!: any[];

  constructor(private userService:UserService){}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users: any) => {
      this.users = users;
    });
    
  }

  fetchUsers(): void {
    this.userService.getUsers().subscribe((users: any) => {
      this.users = users;
    });
  }

  deleteUser(userId: string): void {
    this.userService.deleteUser(userId).subscribe(
      () => {
        // Remove the deleted user from the users array
        this.users = this.users.filter(user => user.id !== userId);
        console.log('User deleted successfully.');
      },
      error => {
        console.error('Error deleting user:', error);
      }
    );
  }
 


}