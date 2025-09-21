export interface User {
  id: string;
  username: string;
}

export interface Ticket {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Message {
  id: string;
  ticketId: string;
  content: string;
  createdAt: string;
  userId: string;
  user?: User;
}

export interface SendMessagePayload {
  content: string;
}