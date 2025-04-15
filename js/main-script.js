import { navigation } from "./navigation/navScript.js";
import "./functions/popperInitialize.js";
import loadUser from "./globals/loadUser.js";

$(function () {
    navigation();
    loadUser();
});