import Handlebars from "handlebars";
import template from "./sign-in.hbs";
import './sign-in.sass';

export const SignIn = () => Handlebars.compile(template)();
