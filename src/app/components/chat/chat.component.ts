import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { io } from 'socket.io-client';
import { Message } from 'src/app/models/message';
import { ShortMessage } from 'src/app/models/short-message';
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

  @Input() otherUserId!: number;

  content!: string;
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private authService: AuthService,
    private chatService: ChatService,
    private ws: WebsocketService
  ) {
    this.messageForm = this.fb.group({
      newMessage: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    console.log("ID utilisateur courant:", this.currentUser.id, this.receiverUser);
    this.loadMessages();
    this.ws.listen('msgToClient').subscribe((data) => {
      console.log('ws listen ',data)
      this.ws.getMessages().subscribe((message)=>{
        this.messages.push(message);
      })
    })
  }

  onSend(messageContent:string){

    // const newMessage: ShortMessage= {
    //   id: 0,  // Peut-être généré par le serveur
    //   sender_id: { id: this.authService.getUserId()!},
    //   receiver_id: { id: +this.receiverUser},
    //   content: messageContent,
    //   timestamp: new Date()
    // };
    // this.messages.push(newMessage as Message);
    // this.ws.sendMessage(newMessage)
  }

  send() {
    this.ws.emit('msgToServer', 'test')
  }

  loadMessages(): void {
    const currentUserId = this.currentUser.id;

    this.messageService.getUserChats(currentUserId, +(this.receiverUser)).subscribe({
      next: (existingMessages: Message[]) => {
        console.log("Messages bruts reçus :", existingMessages);
        this.messages = existingMessages;
      },
      error: error => {
        console.error('Erreur lors de la récup des messages existants:', error);
      }
    });

    // this.chatService.startPolling(this.currentUser.id, +(this.receiverUser)).subscribe({
    //   next: newMessages => {
    //     // console.log('valeur de newMessages :', newMessages);
        
    //     if (newMessages && Array.isArray(newMessages)) {
    //       this.messages = [...this.messages, ...newMessages];
    //     } else {
    //       console.warn('Le format du messages est éclaté');
    //     }
    //   },
    //   error: error => {
    //     console.error('Erreur lors de la récup des nouveaux messages:', error);

      
    //   }    
    // })

    
    
  }

  sendMessage(content: string, receiverId: number): void {
    if(this.messageForm.valid && this.currentUser.id) {
    const newMessageContent = this.messageForm.get('newMessage')?.value.trim();
    console.log('LAST MESSAGE MA BELLE ',newMessageContent); //OK

    console.log('receveur', receiverId); //OK
    console.log('expéditeur du massage', this.currentUser.id) //OK


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
      }

      const newMessage: ShortMessage = {
        id: 0,
        username: `c'est pas la chose la plus facile que j'ai eu a faire MERCI :D`,
        sender_id: { id: this.authService.getUserId()! },
        receiver_id: { id: +this.receiverUser },
        content: newMessageContent,
        timestamp: new Date()
      };


      this.messages.push(newMessage as unknown as Message);
      this.ws.sendMessage(newMessage)


}
  }}