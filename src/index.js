import "normalize.css";
import "cropperjs/dist/cropper.css";
import "@babel/polyfill";
import Vue from "vue";
import App from "./app.vue";
import "./components";

export default new Vue({
  el: "#app",
  render: createElement => createElement(App)
});
