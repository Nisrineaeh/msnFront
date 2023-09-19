import { User } from "./user";

export interface Message {
    id: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    timestamp: Date;
}
