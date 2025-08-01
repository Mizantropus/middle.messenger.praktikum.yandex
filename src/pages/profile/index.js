import Handlebars from "handlebars";
import template from "./profile.hbs";
import './profile.sass';

export const Profile = () => Handlebars.compile(template)({
  avatar: "https://url.to.picture/perfect-photo.jpeg",
  first_name: "Mario",
  second_name: "Buanarotti",
  display_name: "It's me, Mario!",
  login: "Mario Buanarotti",
  email: "mario@mushrooms.it",
  phone: "+39 916 777-22-55"
});
