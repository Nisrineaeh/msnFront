import { User } from "./user";

export interface Message {
    id: number;
    username:string;
    sender_id: User;
    receiver_id: User;
    content: string;
    timestamp: Date;
}
