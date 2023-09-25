import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/models/user';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent {




  users: User[] = [];
  selectedUser!: User;

  @ViewChild('chatModal') chatModal: any;
  @Output() userSelected: EventEmitter<User> = new EventEmitter<User>();

  constructor(private chatService: ChatService, private router: Router, private modalService: NgbModal) { }

  ngOnInit() {
    this.chatService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  openChatModal(user: User) {
    this.selectedUser = user;
    console.log('selectIUsercote controlleur ', this.selectedUser);
    localStorage.setItem('receiverId', (user.id).toString())
    localStorage.setItem('receiverUsername', user.username);///////////////////////
    this.modalService.open(this.chatModal, { size: 'lg' });
  }


  selectUser(user: User, content: any) {
    console.log('utilisateur selectionner dans la liste :', user);

    this.userSelected.emit(user);


    this.modalService.open(content, { size: 'lg' });

  }

  navigateToChat(user: User) {
    this.router.navigate(['/chat/', user.id]);
  }
}
