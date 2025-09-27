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
  userId: string | null;
  contactId: string;
  content: string;
  mediaUrl: string | null;
  mediaType: string | null;
  type: 'CLIENT' | 'USER';
  status: 'SENT' | 'RECEIVED' | 'READ';
  sentAt: string;
  receivedAt: string | null;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface SendMessagePayload {
  content: string;
}