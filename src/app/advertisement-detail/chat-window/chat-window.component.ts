import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ad } from 'src/models/Ad';
import { ChatMessage } from 'src/models/ChatMessage';
import { User } from 'src/models/User';
import { ChatService } from 'src/services/chat.service';

@Component({
  selector: 'app-user-chat',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnInit {

  messages:any[] = [];
  message!:any;
  user!:User;
  chatId!:string;
  isChatOpen:boolean=true;

  @Output() hideChatWindow = new EventEmitter<any>();

  @Input()
  ad!:Ad;

  @Input()
  seller!:User;
  messagesMap!: Map<string, any[]>;
  subscription!: Subscription;

  constructor(private chatService:ChatService,private eRef: ElementRef) {
    this.user = JSON.parse(localStorage.getItem('user')!) as User;
  }

  addMessage(){
    const chatMessage = {
      message : this.message,
      senderId : this.user.id,
      receiverId : this.seller.id,
      timestamp : new Date()+""
    };
    this.chatService.addMessage(this.ad.adId,this.user.id,this.seller.id,chatMessage);
    this.message = "";
  }

  getMessagesMap(messages:any[]):Map<string,any[]>{
    let datepipe = new DatePipe('en-US'); // Use your own locale

    let todayDate = datepipe.transform(new Date()+"", 'dd-MM-yyyy')!;

    let yesterdayDate:any = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate()-1);
    yesterdayDate = datepipe.transform(yesterdayDate, 'dd-MM-yyyy')!;

    messages = messages.sort((c1:any,c2:any)=>new Date(c1.timestamp).getTime()-new Date(c2.timestamp).getTime());
    let map = new Map<string,any[]>();
    messages.forEach((message)=>{
      let dateKey = '';
      dateKey = datepipe.transform(message.timestamp, 'dd-MM-yyyy')!;
      if(dateKey==todayDate){
        dateKey = 'today'
      }else if(dateKey==yesterdayDate){
        dateKey = 'yesterday'
      }else{
        dateKey = datepipe.transform(message.timestamp, 'mediumDate')!;
      }
      if(map.has(dateKey)){
        map.get(dateKey)!.push(message);
      }else{
        map.set(dateKey,[message]);
      }
    })
    return map;
  }

  closeChatWindow(){
    this.subscription.unsubscribe();
    this.hideChatWindow.emit();
  }
  
  fetchChatMessages(){
     this.subscription = this.chatService.getChatById(this.chatId).subscribe((chat)=>{
      console.log("making this seen!");
      this.chatService.MarkChatSeenForUser(chat.chatId,this.user.id);
    });
    let subscription2 = this.chatService.getMessagesByChatId(this.chatId).subscribe(res=>{
      this.messages = res;
      this.messages.sort((x,y)=>new Date(x.timestamp).getTime()-new Date(y.timestamp).getTime());
      this.messagesMap = this.getMessagesMap(this.messages);
    });
    //this.subscription.add(subscription1);
    //this.subscription.add(subscription2);
    console.log(this.subscription);
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.chatId = this.seller.id < this.user.id ? this.ad.adId+"_"+this.seller.id+"_"+this.user.id :  this.ad.adId+"_"+this.user.id+"_"+this.seller.id;
    this.fetchChatMessages();
  }

}
