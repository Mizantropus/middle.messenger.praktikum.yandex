import SignInAPI from "../sign-in";
import { router } from "../../main";
import { SignInFormModel } from "../types";
import { RequestOptions } from '../../core/ajax';
import { validateLogin, validatePassword } from "../../core/validation";
import { SimpleCookie, CookieOptions } from "../../core/cookies";
import { RouteAddresses } from "../../core/routes";

let options: CookieOptions = {
  path: "localhost",
  maxAge: 100500,
  secure: true,
}

const signInAPI = new SignInAPI();

function validate (
  _target: typeof SignInController.prototype,
  _propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  descriptor.value = function(data: SignInFormModel) {
    if (!validateLogin(data.login) || !validatePassword(data.password)) {
      throw new Error("Validation error");
    }
    return originalMethod(data);
  }
}

function handleError (
  _target: typeof SignInController.prototype,
  _propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  descriptor.value = function(data: SignInFormModel) {
    try {
      return originalMethod(data);
    } catch (error) {
      console.error(error);
    }
  }
}

function handleErrorLogout (
  _target: typeof SignInController.prototype,
  _propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  descriptor.value = function() {
    try {
      return originalMethod();
    } catch (error) {
      console.error(error);
    }
  }
}

function prepareDataToRequest(data: SignInFormModel): RequestOptions<SignInFormModel> {
  return {
    method: "POST",
    data
  };
}

function saveUserLoginStatus () {
  let simpleCookie = new SimpleCookie();
  simpleCookie.set("is_auth", "111111", options);
  router.go(RouteAddresses.Messenger);
}

function postLogoutHandler () {
  let simpleCookie = new SimpleCookie();
  simpleCookie.delete("is_auth", options);
}

export default class SignInController {
  @validate
  @handleError
  public async login(sign_in_data: SignInFormModel) {
    const data: RequestOptions<SignInFormModel> = prepareDataToRequest(sign_in_data);
    await signInAPI.request(data).then(saveUserLoginStatus);
  }

  @handleErrorLogout
  public async logout() {
    await signInAPI.logout({ method: "POST" }).then(postLogoutHandler);
  }
}
