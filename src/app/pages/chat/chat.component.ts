import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { MessageService } from 'src/app/services/message.service';
import { WebsocketService } from 'src/app/services/websocket.service';

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

  @Input() otherUserId!: number;
  @Input() selectedUser!: User;

  content!: string;
  
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private authService: AuthService,
    private chatService: ChatService,
    private ws: WebsocketService,

  ) {
    this.messageForm = this.fb.group({
      newMessage: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    console.log("ID utilisateur courant:", this.currentUser.id);
    this.loadMessages();
  }

  loadMessages(): void {
    const currentUserId = this.currentUser.id;

    this.messageService.getUserChats(currentUserId, +(this.receiverUser)).subscribe({
      next: (existingMessages: Message[]) => {
        console.log("Messages bruts reçus :", existingMessages);
        this.messages = existingMessages;
        const lastMessage = existingMessages[existingMessages.length - 1];
        console.log("Dernier message de la conv :", lastMessage);

      },
      error: error => {
        console.error('Erreur lors de la récup des messages existants:', error);
      }
    });

    console.log('listen to websocket');

    this.ws.listen('msgToClient').subscribe((data: any) => {
      console.log("Data recu :", data);

      if (typeof data === 'object' && 'sender_id' in data && 'receiver_id' in data && 'content' in data && 'timestamp' in data) {
        const newMessage: Message = {
          id: 0,
          username: data.username,
          sender_id: data.sender_id,
          receiver_id: data.receiver_id,
          content: data.content,
          timestamp: new Date(data.timestamp),
        };

        this.messages.push(newMessage);
      }
    });


  }
  // loadMessages(): void {

  /*console.log('aiaiaiaiaiaiaaiaiaiaiaiaiaiaiaiaiaia'+this.currentUser.id, this.otherUserId);

    this.messageService.getMessagesBetweenUsers(this.currentUser.id, this.otherUserId).subscribe({
     
      next: (existingMessages: Message[]) => {
        console.log("Messages bruts reçus :", existingMessages);
        this.messages = existingMessages.map(msg => {
          console.log("ID de l'expéditeur du message : ", this.currentUser.id);
          console.log('id du receveur du message : ',this.otherUserId);
          
          return {
            id: msg.id,
            sender_id: this.currentUser.id,
            receiver_id: this.otherUserId,
            content: msg.content,
            timestamp: msg.timestamp
          }
        })
          .filter(msg => msg !== null) as Message[];
      },
      error: error => {
        console.error('Erreur lors de la récupération des messages existants:', error);
      }
    });*/

    // this.chatService.startPolling(this.otherUserId).subscribe({
    //   next: newMessages => {
    //     console.log(newMessages);
        
    //     if (newMessages && Array.isArray(newMessages)) {
    //       this.messages = [...this.messages, ...newMessages]
    //     } else {
    //       console.warn('Received unexpected data format for new messages.');
    //     }
    //   },
    //   error: error => {
    //     console.error('Erreur lors de la récupération des nouveaux messages:', error);
    //   }
    // });
  // }

  sendMessage(content: string, receiverId: number): void {
    if (this.messageForm.valid && this.currentUser.id) {
      const newMessage = this.messageForm.get('newMessage')?.value.trim();
      console.log(newMessage); //OK
      
      console.log('receveur',receiverId);
      console.log('expéditeur du massage', this.currentUser.id)
      
      
      
      if (newMessage) {
        this.messageService.sendMessage(newMessage,this.currentUser.id, receiverId).subscribe(data => {
          this.messageForm.reset();
        });
      }
    }
  }




}
