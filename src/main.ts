import { SimpleCookie } from "./core/cookies";
import ProfileController from "./api/controllers/profile";
import store from "./store";
import { Block } from "./core/block";
import Router from "./core/router"

export const router = new Router("#app");

router
  .use("/", async () => {
    const module = await import("./pages/navigation");
    return module.Navigation;
  })
  .use("/sign-in", async () => {
    const module = await import("./pages/sign-in");
    return module.SignIn;
  })
  .use("/sign-up", async () => {
    const module = await import("./pages/sign-up");
    return module.SignUp;
  })
  .use("/profile", async () => {
    const module = await import("./pages/profile");
    return module.Profile as Block<any>;
  }, true)
  .use("/chats", async () => {
    const module = await import("./pages/chats");
    return module.Chats;
  }, true)
  .use("/500", async () => {
    const module = await import("./pages/500");
    return module.Page500;
  })
  .use("/404", async () => {
    const module = await import("./pages/404");
    return module.Page404;
  }).start();

document.addEventListener('DOMContentLoaded', async () => {
  let state = store.getState();
  let simpleCookie = new SimpleCookie();
  let is_auth = simpleCookie.get("is_auth");
  if (!state.user && is_auth) {
    let profileController = new ProfileController();
    let user_data = await profileController.get_user();
    store.set('user', user_data);
  }
});
