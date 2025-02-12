import { navigation } from "./navigation/navScript.js";
import modalAriaFix from "./functions/modalAriaFix.js";
import "./functions/popperInitialize.js";

$(function () {
    navigation();
    modalAriaFix();
});