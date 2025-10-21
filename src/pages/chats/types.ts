export interface MessageType {
  type: string;
  user_id: number;
  content: string;
  time: string;
}

export interface StateUserModel {
  avatar: string | null;
  display_name: string | null;
  email: string | null;
  first_name: string | null;
  id: number;
  login: string;
  phone: string | null;
  second_name: string | null;
}

export interface StateChatUserModel {
  avatar: string | null;
  display_name: string | null;
  first_name: string | null;
  id: number;
  login: string;
  role: string | null;
  second_name: string | null;
}

export interface SmallUserModel {
  avatar: string | null;
  display_name: string | null;
  first_name: string | null;
  login: string;
  second_name: string | null;
}

export interface LastMessageType {
  type: string;
  user: SmallUserModel;
  content: string;
  time: string;
}

export interface StateChatModel {
  avatar: string | null;
  created_by: number;
  id: number;
  last_message: LastMessageType | null;
  title: string;
  unread_count: number;
}
