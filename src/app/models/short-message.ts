import { ShortUser } from "./short-user";

export interface ShortMessage {
    id: number;
    username:string;
    sender_id: ShortUser;
    receiver_id: ShortUser;
    content: string;
    timestamp: Date;
}
