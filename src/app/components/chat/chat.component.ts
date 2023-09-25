import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from 'src/app/models/message';
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
  // receiverUser = {id: this.chatService.getReceiverUser()!}
  afterId= 0;

  @Input() otherUserId!: number;

  content!: string;
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private authService: AuthService,
    private chatService: ChatService,
    private ws: WebsocketService,
    private cdr: ChangeDetectorRef, //detecte changement rapidement mais 0
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

    this.ws.listen('msgToClient').subscribe((data: any) => {
      console.log("Data recu :", data);

      if (data && 'sender_id' in data && 'receiver_id' in data && 'content' in data && 'timestamp' in data) {
        const newMessage: Message = {
          id: 0,
          username: data.username || 'Inconnu',
          sender_id: data.sender_id,
          receiver_id: data.receiver_id,
          content: data.content,
          timestamp: new Date(data.timestamp),
        };

        this.messages.push(newMessage);

      }
    });

    
  }

  sendMessage(content: string, receiverId: number): void {
    if (this.messageForm.valid && this.currentUser.id) {
      const newMessageContent = this.messageForm.get('newMessage')?.value.trim();

      if (newMessageContent) {
        this.messageService.sendMessage(newMessageContent, this.currentUser.id, receiverId)
          .subscribe({
            next: (data) => {
              console.log('Message envoyé correctement', data.content);
              this.messageForm.reset();
            },
            error: (error) => {
              console.error('Erreur lors du post du message', error);
            }
          });

        const newMessage: Message = {
          id: 0,  
          username: this.authService.getCurrentUsername(),
          sender_id: {
            id: this.authService.getUserId()!,
            username: localStorage.getItem('username')!,
            password: '',
            sentMessages: [],
            receivedMessage: []
          },
          receiver_id: {
            id: +this.receiverUser,
            username: '',
            password: '',
            sentMessages: [],
            receivedMessage: []
          },
          content: newMessageContent,
          timestamp: new Date()
        };

        // this.messages.push(newMessage);
        this.ws.emit('msgToServer', newMessage);  
      }
    }
  }

}