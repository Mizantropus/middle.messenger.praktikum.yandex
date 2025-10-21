import SignUpAPI from "../sign-up"
import { SignUpFormModel } from "../types"
import { RequestOptions } from '../../core/ajax';
import { validateLogin, validatePassword } from "../../core/validation"


const signUpAPI = new SignUpAPI();

function validate (
  _target: typeof SignUpController.prototype,
  _propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  descriptor.value = function(data: SignUpFormModel) {
    if (!validateLogin(data.login) || !validatePassword(data.password)) {
      throw new Error("Validation error");
    }
    return originalMethod(data);
  }
}

function handleError (
  _target: typeof SignUpController.prototype,
  _propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  descriptor.value = function(data: SignUpFormModel) {
    try {
      return originalMethod(data);
    } catch (error) {
      console.error(error);
    }
  }
}

function prepareDataToRequest(data: SignUpFormModel): RequestOptions<SignUpFormModel> {
  return {
    method: "POST",
    data
  };
}

export default class SignUpController {
  @validate
  @handleError
  public async login(sign_up_data: SignUpFormModel) {
    const data: RequestOptions<SignUpFormModel> = prepareDataToRequest(sign_up_data);
    signUpAPI.create(data);
  }
}
