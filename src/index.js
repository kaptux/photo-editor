import "normalize.css";
import "cropperjs/dist/cropper.css";
import "@babel/polyfill";
import Vue from "vue";
import App from "./app.vue";
import "./components";

let options = {
  el: "#app",
  bindings: {
  }
};

if (window.getPhotoEditorOptions) {
  options = Object.assign({}, options, window.getPhotoEditorOptions());
}

const app = new Vue({
  el: options.el,
  render: createElement => createElement(App)
});

const component = app.$children[0];

Object.keys(options.bindings).forEach(k => {
  component.bind(k, options.bindings[k]);
});

if (options.globalName) {
  window[options.globalName] = component;
}

export default component;
