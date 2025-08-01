import Handlebars from "handlebars";
import template from "./sign-up.hbs";
import './sign-up.sass';

export const SignUp = () => Handlebars.compile(template)({});
