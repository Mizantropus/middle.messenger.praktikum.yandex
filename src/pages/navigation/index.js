import Handlebars from "handlebars";
import template from "./navigation.hbs";
import './navigation.sass';

export const Navigation = () => Handlebars.compile(template)({});
