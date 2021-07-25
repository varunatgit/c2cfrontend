export class ChatMessage{
    message : string;
    senderId : number;
    receiverId : number;
    timestamp : string;

    constructor(args:any){
        this.message = args.message;
        this.senderId = args.senderId;
        this.receiverId = args.receiverId;
        this.timestamp = args.timestamp;
    }
}