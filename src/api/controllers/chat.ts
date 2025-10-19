import { ChatAPI, InviteUserToChatModel, SearchUserModel } from '../chat';
import {
  validateLogin,
} from "../../core/validation";

function validateChatTitle(title: string): boolean {
  return typeof title === 'string' && title.trim().length > 0;
}

function validate(_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function(title: string) {
    if (!validateChatTitle(title)) {
      throw new Error("Validation error");
    }
    return originalMethod.call(this, title);
  }
}

function validate_search_user(_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function(data: SearchUserModel) {
    if (!validateLogin(data.login)) {
      throw new Error("Validation error");
    }
    return originalMethod.call(this, data);
  }
}

function handleError(_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = async function(...args: any[]) {
    try {
      return await originalMethod.apply(this, args);
    } catch (error) {
      console.error(error);
    }
  }
}

const chatAPI = new ChatAPI();

export default class ChatsController {
  @handleError
  @validate
  public async createChat(title: string) {
    const response = await chatAPI.create({
      data: { title }
    });
    return JSON.parse(response.response);
  }

  @handleError
  public async getChats() {
    const response = await chatAPI.getChats();
    return JSON.parse(response.response);
  }

  @handleError
  public async inviteUserToChat(data: InviteUserToChatModel) {
    await chatAPI.inviteUserToChat({
      data
    });
  }

  @handleError
  public async getChatUsers(chatId: number) {
    const response = await chatAPI.getChatUsers(chatId);
    return JSON.parse(response.response);
  }

  @handleError
  @validate_search_user
  public async searchUser(data: SearchUserModel) {
    const response = await chatAPI.searchUser({data});
    return JSON.parse(response.response);
  }

  @handleError
  public async deleteUserFromChat(data: InviteUserToChatModel) {
    await chatAPI.deleteUserFromChat({ data });
  }

  @handleError
  public async deleteChat(chatId: number) {
    await chatAPI.deleteChat({ data: { chatId } });
  }

  @handleError
  public async getChatToken(chatId: number) {
    const resp = await chatAPI.getToken(chatId);
    return JSON.parse(resp.response);
  }

}
