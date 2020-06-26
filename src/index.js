import "normalize.css";
import "cropperjs/dist/cropper.css";
import "@babel/polyfill";
import Vue from "vue";
import App from "./app.vue";
import "./components";

const imgURL =
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/9674/photo-1501366062246-723b4d3e4eb6.jpg";

let options = {
  el: "#app",
  bindings: {
    crop() {
      console.log("cropped");
      return true;
    }
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

// component.setImage({
//   type: "image/jpg",
//   url: imgURL
// });

// fetch(imgURL)
//   .then(r => r.blob())
//   .then(b => {
//     component.setImage({
//       type: "image/jpg",
//       url: URL.createObjectURL(b)
//     });
//   });

export default component;
