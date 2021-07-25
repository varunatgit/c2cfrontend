import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { combineLatest, forkJoin, Subscription } from 'rxjs';
import { User } from 'src/models/User';
import { AdService } from 'src/services/ad.service';
import { ChatService } from 'src/services/chat.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  user!:User;
  chats:any[] = [];
  currentChat!:any;
  message!:string;
  chatCount!:number;
  isLoaded:boolean = false;
  isError:boolean = false;
  subscriptions:Subscription = new Subscription();

  constructor(private chatService:ChatService,private adService:AdService,private userService:UserService) {
    this.user = JSON.parse(localStorage.getItem('user')!) as User;
  }

  setCurrentChat(chat:any){
    this.currentChat = chat;
    if(!this.isChatSeenByUser(chat)){
      chat.seenBy.push(this.user.id);
      this.chatService.MarkChatSeenForUser(chat.chatId,this.user.id);
    }
  }

  isChatSeenByUser(chat:any){
    return chat.seenBy.findIndex((item:any)=>item==this.user.id)!=-1;
  }

  addMessage(){
    let receiverId = this.user.id==this.currentChat.sellerId?this.currentChat.buyerId:this.currentChat.sellerId;
    
    const chatMessage = {
      message : this.message,
      senderId : this.user.id,
      receiverId : receiverId,
      timestamp : new Date()+""
    };

    this.currentChat.messages.push(chatMessage);
    this.currentChat.messagesMap = this.getMessagesMap(this.currentChat.messages);
    this.chatService.addMessage(this.currentChat.adId,this.currentChat.buyerId,this.currentChat.sellerId,chatMessage);
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

  fetchChats(){
    this.chatService.getChatsByUserId(this.user.id+""
    ).subscribe((chatIdList)=>{
      this.chats = [];
      this.isLoaded=false;
      this.chatCount = chatIdList.length;
      if(this.chatCount ==0){
        this.isLoaded = true;
      }
      var itemsProcessed = 0;
      chatIdList.forEach(item=>{

        const subscription = this.chatService.getChatById(item.chatId).subscribe((chat)=>{

          const chat1:any = this.chats.find(c=>c.chatId==chat.chatId);

          if(chat1!=null){
            //update the chat
            chat1.lastMessage = chat.lastMessage;
            chat1.lastUpdated = chat.lastUpdated;
            chat1.seenBy = chat.seenBy;  

            if(this.currentChat.chatId==chat1.chatId){
              this.setCurrentChat(chat1);
            }
          }

          combineLatest([
            this.userService.getUserById(chat.buyerId),
            this.userService.getUserById(chat.sellerId),
            this.adService.getAdById(chat.adId),
            this.chatService.getMessagesByChatId(chat.chatId)
          ])
          .subscribe(([buyer,seller,ad,messages])=>{
            chat.buyer = buyer;
            chat.seller = seller;
            chat.ad = ad;
            messages = messages.sort((c1:any,c2:any)=>new Date(c1.timestamp).getTime()-new Date(c2.timestamp).getTime());
            chat.messages = messages;
            chat.messagesMap = this.getMessagesMap(messages);

            if(!this.chats.find(c=>c.chatId==chat.chatId)){
              this.chats.push(chat);
              itemsProcessed++;
            }else{                 
              if(chat.messages.length>chat1.messages.length){
                chat1.messages = chat.messages;
                chat1.messagesMap = chat.messagesMap;
              }
              chat1.ad = ad;

              this.chats.sort((c1,c2)=>new Date(c2.lastUpdated).getTime()-new Date(c1.lastUpdated).getTime()); 
            }
            
            if(itemsProcessed == this.chatCount){
              this.chats.sort((c1,c2)=>new Date(c2.lastUpdated).getTime()-new Date(c1.lastUpdated).getTime());
              setTimeout(()=>{ 
                this.setCurrentChat(this.chats[0]);
                this.isLoaded = true;
                itemsProcessed = 0;
              }, 3000);
            }
            
          },(error)=>{
            console.log(error);
          })
          this.subscriptions.add(subscription);
        });
      });
    },(err)=>{
      console.log(err);
      this.isError = true;
    });
  }

  ngOnInit(): void {
    this.fetchChats();
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }
}
