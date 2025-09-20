import { Navigation } from "./pages/navigation";
import { SignIn } from "./pages/sign-in";
import { SignUp } from "./pages/sign-up";
import { Chats } from "./pages/chats";
import { Profile } from "./pages/profile";
import { Page404 } from "./pages/404";
import { Page500 } from "./pages/500";
import { Block } from "./core/block";
import render from "./core/render";

const routes: Record<string, Block> = {
  "/": Navigation,
  "/sign-in": SignIn,
  "/sign-up": SignUp,
  "/profile": Profile,
  "/chats": Chats,
  "/500": Page500,
  "/404": Page404
};

document.addEventListener("DOMContentLoaded", (): void => {
  const getPage = (): Block => {
    return routes[window.location.pathname] ?? Page404;
  };
  render("#app", getPage());
});
