import { receiveFromWebView } from "../functions/WebViewInteraction.js";

export default function loadUser() {
  let user = JSON.parse(localStorage.getItem("user"));
  let username = user["Full_Name"];
  let section = user["Section"];

  $("#username").text(username);
  $("#section").text(section);
}