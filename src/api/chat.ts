import { fetchWithRetry, RequestOptions } from '../core/ajax';
import { BaseAPI } from './base-api';

export interface CreateChatModel {
  title: string;
}

export interface InviteUserToChatModel {
  users: number[];
  chatId: number;
}

export interface SearchUserModel {
  login: string;
}

export class ChatAPI extends BaseAPI<XMLHttpRequest, RequestOptions<CreateChatModel>> {
  public async create(data: RequestOptions<CreateChatModel>): Promise<XMLHttpRequest> {
    return await fetchWithRetry(
      "https://ya-praktikum.tech/api/v2/chats",
      'POST',
      data
    );
  }

  public async getChats(): Promise<XMLHttpRequest> {
    return await fetchWithRetry(
      "https://ya-praktikum.tech/api/v2/chats",
      'GET',
      {}
    );
  }

  public async inviteUserToChat(data: RequestOptions<InviteUserToChatModel>): Promise<XMLHttpRequest> {
    return await fetchWithRetry(
      "https://ya-praktikum.tech/api/v2/chats/users",
      'PUT',
      data
    );
  }

  public async getChatUsers(chatId: number): Promise<XMLHttpRequest> {
    return await fetchWithRetry(
      `https://ya-praktikum.tech/api/v2/chats/${chatId}/users`,
      'GET',
      {}
    );
  }

  public async searchUser(data: RequestOptions<SearchUserModel>): Promise<XMLHttpRequest> {
    return await fetchWithRetry(
      `https://ya-praktikum.tech/api/v2/user/search`,
      'POST',
      data
    );
  }

  public async deleteUserFromChat(data: RequestOptions<InviteUserToChatModel>): Promise<XMLHttpRequest> {
    return await fetchWithRetry(
      "https://ya-praktikum.tech/api/v2/chats/users",
      'DELETE',
      data
    );
  }

  public async deleteChat(data: RequestOptions<{ chatId: number }>): Promise<XMLHttpRequest> {
    return await fetchWithRetry(
      "https://ya-praktikum.tech/api/v2/chats",
      'DELETE',
      data
    );
  }

  public async getToken(chatId: number): Promise<XMLHttpRequest> {
    return await fetchWithRetry(
      `https://ya-praktikum.tech/api/v2/chats/token/${chatId}`,
      'POST',
      {}
    );
  }

}
