import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from 'src/app/models/message';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  messages: Message[] = [];
  messageForm: FormGroup;
  currentUser = { id: this.authService.getUserId()! };
  receiverUser = localStorage.getItem('receiverId')!
  // receiverUser = {id: this.chatService.getReceiverUser()!}

  @Input() otherUserId!: number;

  content!: string;
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private authService: AuthService,
    private chatService: ChatService
  ) {
    this.messageForm = this.fb.group({
      newMessage: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    console.log("ID utilisateur courant:", this.currentUser.id, this.receiverUser);
    this.loadMessages();
  }

  loadMessages(): void {
    const currentUserId = this.currentUser.id;


    this.messageService.getMessagesBetweenUsers(currentUserId,+( this.receiverUser)).subscribe({
      next: (existingMessages: Message[]) => {
        console.log("Messages bruts reçus :", existingMessages);
        this.messages = existingMessages.map(msg => {
          console.log('papapapapapapapapapapapa',existingMessages);
          
          console.log("ID de l'expéditeur du message : ", currentUserId);
          console.log('id du receveur du message : ', this.receiverUser);

          return {
            id: msg.id,
            sender_id: msg.sender_id,
            receiver_id: msg.receiver_id,
            content: msg.content,
            timestamp: msg.timestamp
          }
        })
      },
      error: error => {
        console.error('Erreur lors de la récupération des messages existants:', error);
      }
    });

    // return {
    //   id: msg.id,
    //   sender_id: currentUserId,
    //   receiver_id: this.otherUserId,
    //   content: msg.content,
    //   timestamp: msg.timestamp
    // }

    this.chatService.startPolling(this.currentUser.id, +(this.receiverUser)).subscribe({
      next: newMessages => {
        if (newMessages && Array.isArray(newMessages)) {
          this.messages = [...this.messages, ...newMessages]
        } else {
          console.warn('Received unexpected data format for new messages.');
        }
      },
      error: error => {
        console.error('Erreur lors de la récupération des nouveaux messages:', error);
      }
    });
  }

  sendMessage(content: string, receiverId: number): void {
    if(this.messageForm.valid && this.currentUser.id) {
    const newMessage = this.messageForm.get('newMessage')?.value.trim();
    console.log(newMessage); //OK

    console.log('receveur', receiverId); //OK
    console.log('expéditeur du massage', this.currentUser.id) //OK



    if (newMessage) {
      this.messageService.sendMessage(newMessage, this.currentUser.id ,receiverId).subscribe(data => {
        console.log('Message envoyer correctement', data)
        this.messageForm.reset();
      }, error =>{
        console.error('Erreur lors du post du msg', error)
      });
    }
  }
}




}