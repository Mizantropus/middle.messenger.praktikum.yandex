import { Navigation } from './pages/navigation';
import { SignIn } from './pages/sign-in';
import { SignUp } from './pages/sign-up';
import { Chats } from './pages/chats';
import { Profile } from './pages/profile';
import { Page404 } from './pages/404';
import { Page500 } from './pages/500';
import componentButton from "./components/button";
import componentMainMenu from "./components/main_menu";

componentButton();
componentMainMenu();

document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector('#app');
  const getPage = () => {
    switch (window.location.pathname) {
      case '/': return Navigation();
      case '/sign-in': return SignIn();
      case '/sign-up': return SignUp();
      case '/profile': return Profile();
      case '/chats': return Chats();
      case '/500': return Page500();
      default: return Page404();
    }
  }
  app.innerHTML = getPage();
});
