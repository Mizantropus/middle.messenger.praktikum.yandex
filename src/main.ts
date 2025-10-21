import { SimpleCookie } from "./core/cookies";
import ProfileController from "./api/controllers/profile";
import SignInController from "./api/controllers/sign-in";
import store from "./store";
import { AnyProps, Block } from "./core/block";
import { YANDEX_AVA_DOMAIN } from "./core/constants";
import Router from "./core/router";
import { RouteAddresses } from "./core/routes";

export const router = new Router("#app");
let need_to_redirect_to_sign_in = false;

document.addEventListener('DOMContentLoaded', async () => {
  let state = store.getState();
  let simpleCookie = new SimpleCookie();
  let is_auth = simpleCookie.get("is_auth");
  if (!state.user && is_auth) {
    let profileController = new ProfileController();
    let user_data = await profileController.get_user().catch((error) => {
      console.error("Ошибка обращения к серверу:", error);
    });
    if (user_data.avatar) {
      user_data.avatar = `${YANDEX_AVA_DOMAIN}${user_data.avatar}`;      
    }
    store.set('user', user_data);
  } else {
    simpleCookie.delete("is_auth");
    need_to_redirect_to_sign_in = true;
    await new SignInController().logout().catch((error) => {
      console.error("Ошибка обращения к серверу:", error);
    });
  }
});

router
  .use(RouteAddresses.Navigation, async () => {
    const module = await import("./pages/navigation");
    return module.Navigation;
  })
  .use(RouteAddresses.SignIn, async () => {
    const module = await import("./pages/sign-in");
    return module.SignIn;
  })
  .use(RouteAddresses.SignUp, async () => {
    const module = await import("./pages/sign-up");
    return module.SignUp;
  })
  .use(RouteAddresses.Settings, async () => {
    const module = await import("./pages/profile");
    return module.Profile as Block<AnyProps>;
  }, true)
  .use(RouteAddresses.Messenger, async () => {
    const module = await import("./pages/chats");
    return module.Chats;
  }, true)
  .use(RouteAddresses.Error500, async () => {
    const module = await import("./pages/500");
    return module.Page500;
  })
  .use(RouteAddresses.Error404, async () => {
    const module = await import("./pages/404");
    return module.Page404;
  }).start();

if (need_to_redirect_to_sign_in) {
  router.go(RouteAddresses.SignIn);
}
