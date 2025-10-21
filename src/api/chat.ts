import { fetchWithRetry, RequestOptions, METHODS } from "../core/ajax";
import { YANDEX_DOMAIN } from "../core/constants";
import { BaseAPI } from "./base-api";

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
      `${YANDEX_DOMAIN}/chats`,
      METHODS.POST,
      data
    );
  }

  public async getChats(): Promise<XMLHttpRequest> {
    return await fetchWithRetry(
      `${YANDEX_DOMAIN}/chats`,
      METHODS.GET,
      {}
    );
  }

  public async inviteUserToChat(data: RequestOptions<InviteUserToChatModel>): Promise<XMLHttpRequest> {
    return await fetchWithRetry(
      `${YANDEX_DOMAIN}/chats/users`,
      METHODS.PUT,
      data
    );
  }

  public async getChatUsers(chatId: number): Promise<XMLHttpRequest> {
    return await fetchWithRetry(
      `${YANDEX_DOMAIN}/chats/${chatId}/users`,
      METHODS.GET,
      {}
    );
  }

  public async searchUser(data: RequestOptions<SearchUserModel>): Promise<XMLHttpRequest> {
    return await fetchWithRetry(
      `${YANDEX_DOMAIN}/user/search`,
      METHODS.POST,
      data
    );
  }

  public async deleteUserFromChat(data: RequestOptions<InviteUserToChatModel>): Promise<XMLHttpRequest> {
    return await fetchWithRetry(
      `${YANDEX_DOMAIN}/chats/users`,
      METHODS.DELETE,
      data
    );
  }

  public async deleteChat(data: RequestOptions<{ chatId: number }>): Promise<XMLHttpRequest> {
    return await fetchWithRetry(
      `${YANDEX_DOMAIN}/chats`,
      METHODS.DELETE,
      data
    );
  }

  public async getToken(chatId: number): Promise<XMLHttpRequest> {
    return await fetchWithRetry(
      `${YANDEX_DOMAIN}/chats/token/${chatId}`,
      METHODS.POST,
      {}
    );
  }

}
