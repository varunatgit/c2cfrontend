import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { Ad } from 'src/models/Ad';
import { ChatMessage } from 'src/models/ChatMessage';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  chatsCollection!: AngularFirestoreCollection<any>;
  usersCollection!:AngularFirestoreCollection<any>;
  chats!:any[];
  
  constructor(private afs: AngularFirestore) { 
    this.chatsCollection = this.afs.collection<any>('chats');
    this.chatsCollection.valueChanges().subscribe((res)=>{
      this.chats = res;
    });
    this.usersCollection = this.afs.collection<any>('users');
  }

  getChatById(chatId:string){
    return this.chatsCollection.doc(chatId).valueChanges();
  }

  getChatsByUserId(userId:string){
    return this.usersCollection.doc(userId).collection<any>('chats').valueChanges();
  }

  getMessagesByChatId(chatId:string):Observable<any>{
    return this.chatsCollection.doc(chatId).collection<any>('messages').valueChanges();
  }
  
  MarkChatSeenForUser(chatId:any,userId:any){
    this.chatsCollection.doc(chatId).get().subscribe((chat)=>{
      let seenBy:any[]=chat.data().seenBy as any[];
      let index = seenBy.findIndex(s=>s==userId);
      if(index==-1){
        seenBy.push(userId);
        this.chatsCollection.doc(chatId).update({seenBy:seenBy});
      }
    });
  }

  addMessage(adId:any,buyerId:any,sellerId:any,message:any){
    let chatId = ""+adId;
    if(buyerId<sellerId){
      chatId = chatId+"_"+buyerId+"_"+sellerId;
    }else{
      chatId = chatId+"_"+sellerId+"_"+buyerId;
    }

    const chat = {
      chatId:chatId,
      adId:adId,
      lastUpdated:new Date()+"",
      lastMessage:message,
      buyerId : buyerId,
      sellerId : sellerId,
      seenBy : [message.senderId],
    }

    const chat1:any = this.chats.find(c=>c.chatId==chatId);

    if(chat1 == null){
      this.usersCollection.doc(message.senderId+"").collection<any>('chats').doc(chatId).set({chatId:chatId});
      this.usersCollection.doc(message.receiverId+"").collection<any>('chats').doc(chatId).set({chatId:chatId});
      this.chatsCollection.doc(chatId).set(chat).then((res)=>{
        this.chatsCollection.doc(chatId).collection<any>('messages').add(message);
      });
    }else{
      this.chatsCollection.doc(chatId).update(chat).then((res)=>{
        this.chatsCollection.doc(chatId).collection<any>('messages').add(message);
      });
    }
  }
}
