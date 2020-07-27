import "normalize.css";
import "cropperjs/dist/cropper.css";
import "@babel/polyfill";
import Vue from "vue";
import App from "./app.vue";
import "./components";

// const images = [
//   {url: "https://firebasestorage.googleapis.com/v0/b/svgedito.appspot.com/o/fFjPV0RE4kc05RlIo8qc%2FGclY4u7GzA9bzZwCTHVn%2FcTHks3Jf8qbrHDSxj4pT.jpg?alt=media&amp;token=65243109-4eef-4b99-8d0a-7cb6275dd5d3"},
//   {url: "https://firebasestorage.googleapis.com/v0/b/svgedito.appspot.com/o/fFjPV0RE4kc05RlIo8qc%2FGclY4u7GzA9bzZwCTHVn%2FSF0waXIJCKvOSOKoyvTK.jpg?alt=media&amp;token=4df427d6-4098-4390-9114-c15b8d9354c3"},
//   {url: "https://firebasestorage.googleapis.com/v0/b/svgedito.appspot.com/o/fFjPV0RE4kc05RlIo8qc%2FGclY4u7GzA9bzZwCTHVn%2FTkCYkyBQ4CixcWSrZARX.jpg?alt=media&amp;token=9a3a809c-7a63-4be6-af6c-4408e7a73bc2"}
// ];


let options = {
  el: "#app",
  bindings: {
    // getImgGalery(cb) {
    //   cb(null, images);
    // },
    // deleteImg(img, cb) {
    //   console.log(img);
    //   cb();
    // },
    // crop(info) {
    //   console.log(info);
    //   return true;
    // }
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
