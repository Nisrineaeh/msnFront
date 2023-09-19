import { Message } from "./message";

export interface User {
    id:number;
    username: string;
    password: string;
    sentMessages: Message[];
    receivedMessage: Message[];
}
