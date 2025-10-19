import ProfileAPI from "../profile"
import { RequestOptions } from '../../core/ajax';
import { ProfileFormModel, ProfilePasswordModel } from '../types';
import {
  validateLogin,
  validateName,
  validateEmail,
  validatePhone,
  validatePassword,
  validateFullName,
  validateAvatar
} from "../../core/validation";
import store from "../../store";


const profileAPI = new ProfileAPI();

function handleErrorSaveUser (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function(data: ProfileFormModel) {
    try {
      return originalMethod(data);
    } catch (error) {
      console.error(error);
    }
  }
}

function handleErrorChangePassword (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function(data: ProfilePasswordModel) {
    try {
      return originalMethod(data);
    } catch (error) {
      console.error(error);
    }
  }
}

function handleError (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function() {
    try {
      return originalMethod();
    } catch (error) {
      console.error(error);
    }
  }
}

function handleErrorSaveAvatar (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function(data: FormData) {
    try {
      return originalMethod(data);
    } catch (error) {
      console.error(error);
    }
  }
}

function validate (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function(data: ProfileFormModel) {
    if (
        !validateLogin(data.login) ||
        !validateName(data.first_name) ||
        !validateName(data.second_name) ||
        !validateEmail(data.email) ||
        !validatePhone(data.phone) ||
        !validateFullName(data.display_name)
    ) {
      throw new Error("Validation error");
    }
    return originalMethod(data);
  }
}

function validatePasswordDecorator (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function(data: ProfilePasswordModel) {
    if (
        !validatePassword(data.oldPassword) ||
        !validatePassword(data.newPassword)
    ) {
      throw new Error("Validation error");
    }
    return originalMethod(data);
  }
}

function validateAvatarDecorator (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function(data: FormData) {
    let file: any = data.get('avatar');
    if (file instanceof File) {
      if (
          !validateAvatar(file)
      ) {
        throw new Error("Validation error");
      }
    } else {
      throw new Error("Validation error");
    }
    return originalMethod(data);
  }
}

function prepareDataToRequest(): RequestOptions {
  return {
    method: "GET",
  };
}

function prepareDataToSaveUser(data: ProfileFormModel): RequestOptions<ProfileFormModel> {
  return {
    method: "PUT",
    data
  };
}

function prepareDataToSaveAvatar(data: FormData): RequestOptions<FormData> {
  return {
    method: "PUT",
    data
  };
}

function prepareDataToChangePassword(data: ProfilePasswordModel): RequestOptions<ProfilePasswordModel> {
  return {
    method: "PUT",
    data
  };
}

export default class ProfileController {
  @handleError
  public async get_user() {
    const data: RequestOptions = prepareDataToRequest();
    let user_data = await profileAPI.request(data);
    return JSON.parse(user_data.response);
  }

  @handleErrorSaveUser
  @validate
  public async save_user(user_data: ProfileFormModel) {
    const data: RequestOptions<ProfileFormModel> = prepareDataToSaveUser(user_data);
    let new_user_data = await profileAPI.edit(data);
    store.set('user', JSON.parse(new_user_data.response));
  }

  @handleErrorChangePassword
  @validatePasswordDecorator
  public async change_password(data_passwd: ProfilePasswordModel) {
    const data: RequestOptions<ProfilePasswordModel> = prepareDataToChangePassword(data_passwd);
    await profileAPI.change_password(data);
  }

  @handleErrorSaveAvatar
  @validateAvatarDecorator
  public async save_avatar(form_data: FormData) {
    const data: RequestOptions<FormData> = prepareDataToSaveAvatar(form_data);
    let new_user_data = await profileAPI.save_avatar(data);
    store.set('user', JSON.parse(new_user_data.response));
  }
}
