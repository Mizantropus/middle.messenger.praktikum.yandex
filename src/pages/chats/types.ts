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
