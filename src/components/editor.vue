<template>
  <div class="photo-editor-editor">
    <div class="photo-editor-canvas" @dblclick="dblclick">
      <img ref="image" :alt="data.name" :src="data.url" @loadstart="start" @load="start" />
    </div>
    <div v-if="cropper" class="photo-editor-toolbar" @click="click">
      <button class="photo-editor-toolbar__button" data-action="move" title="Move (M)">
        <font-awesome-icon icon="hand-paper" />
      </button>
      <button class="photo-editor-toolbar__button" data-action="expand" title="Crop (C)">
        <font-awesome-icon icon="expand-alt" />
      </button>
      <button class="photo-editor-toolbar__button" data-action="zoom-in" title="Zoom In (I)">
        <font-awesome-icon icon="search-plus" />
      </button>
      <button class="photo-editor-toolbar__button" data-action="zoom-out" title="Zoom Out (O)">
        <font-awesome-icon icon="search-minus" />
      </button>
      <button
        class="photo-editor-toolbar__button"
        data-action="rotate-left"
        title="Rotate Left (L)"
      >
        <font-awesome-icon icon="undo" />
      </button>
      <button
        class="photo-editor-toolbar__button"
        data-action="rotate-right"
        title="Rotate Right (R)"
      >
        <font-awesome-icon icon="redo" />
      </button>
      <button
        class="photo-editor-toolbar__button"
        data-action="flip-horizontal"
        title="Flip Horizontal (H)"
      >
        <font-awesome-icon icon="arrows-alt-h" />
      </button>
      </button>
      <button
        class="photo-editor-toolbar__button"
        data-action="flip-vertical"
        title="Flip Vertical (V)"
      >
        <font-awesome-icon icon="arrows-alt-v" />
      </button>
    </div>
  </div>
</template>

<script>
import Cropper from "cropperjs";

export default {
  name: "Editor",

  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      canvasData: null,
      cropBoxData: null,
      croppedData: null,
      cropper: null,
      modified: false,
    };
  },

  mounted() {
    // window.addEventListener(
    //   "keydown",
    //   (this.onKeydown = this.keydown.bind(this))
    // );
  },

  beforeDestroy() {
    window.removeEventListener("keydown", this.onKeydown);
    this.stop();
  },

  methods: {
    setModified() {
      this.update({
        modified: true,
      });
    },

    click({ target }) {
      const { cropper } = this;
      const action =
        target.getAttribute("data-action") ||
        target.parentElement.getAttribute("data-action");

      switch (action) {
        case "move":
          cropper.setDragMode(action);
          break;
        case "expand":
          cropper.reset();
          break;

        case "zoom-in":
          cropper.zoom(0.1);
          break;

        case "zoom-out":
          cropper.zoom(-0.1);
          break;

        case "rotate-left":
          cropper.rotate(-90);
          break;

        case "rotate-right":
          this.setModified();
          cropper.rotate(90);
          break;

        case "flip-horizontal":
          this.setModified();
          cropper.scaleX(-cropper.getData().scaleX || -1);
          break;

        case "flip-vertical":
          this.setModified();
          cropper.scaleY(-cropper.getData().scaleY || -1);
          break;

        default:
      }
    },

    keydown(e) {
      switch (e.key) {
        // Undo crop
        case "z":
          if (e.ctrlKey) {
            e.preventDefault();
            this.restore();
          }

          break;

        // Delete the image
        case "Delete":
          this.reset();
          break;

        default:
      }

      const { cropper } = this;

      if (!cropper) {
        return;
      }

      switch (e.key) {
        // Crop the image
        case "Enter":
          this.crop();
          break;

        // Clear crop area
        case "Escape":
          this.clear();
          break;

        // Move to the left
        case "ArrowLeft":
          e.preventDefault();
          cropper.move(-1, 0);
          break;

        // Move to the top
        case "ArrowUp":
          e.preventDefault();
          cropper.move(0, -1);
          break;

        // Move to the right
        case "ArrowRight":
          e.preventDefault();
          cropper.move(1, 0);
          break;

        // Move to the bottom
        case "ArrowDown":
          e.preventDefault();
          cropper.move(0, 1);
          break;

        // Enter crop mode
        case "c":
          cropper.setDragMode("crop");
          break;

        // Enter move mode
        case "m":
          cropper.setDragMode("move");
          break;

        // Zoom in
        case "i":
          cropper.zoom(0.1);
          break;

        // Zoom out
        case "o":
          cropper.zoom(-0.1);
          break;

        // Rotate left
        case "l":
          cropper.rotate(-90);
          break;

        // Rotate right
        case "r":
          cropper.rotate(90);
          break;

        // Flip horizontal
        case "h":
          cropper.scaleX(-cropper.getData().scaleX || -1);
          break;

        // Flip vertical
        case "v":
          cropper.scaleY(-cropper.getData().scaleY || -1);
          break;

        default:
      }
    },

    dblclick(e) {
      if (e.target.className.indexOf("cropper-face") >= 0) {
        e.preventDefault();
        e.stopPropagation();
        this.crop();
      }
    },

    start() {
      const { data } = this;

      if (data.cropped || this.cropper) {
        return;
      }

      this.cropper = new Cropper(this.$refs.image, {
        autoCrop: true,
        autoCropArea: 0.999,
        dragMode: "move",
        background: false,
        movable: false,

        ready: () => {
          if (this.croppedData) {
            this.cropper
              .crop()
              .setData(this.croppedData)
              .setCanvasData(this.canvasData)
              .setCropBoxData(this.cropBoxData);

            this.croppedData = null;
            this.canvasData = null;
            this.cropBoxData = null;
          }
        },

        cropstart: () => {
          this.update({
            modified: true
          });
        },

        crop: ({ detail }) => {
          if (detail.width > 0 && detail.height > 0 && !data.cropping) {
            this.update({
              cropping: true
            });
          }
        }
      });
    },

    stop() {
      if (this.cropper) {
        this.cropper.destroy();
        this.cropper = null;
      }
    },

    crop() {
      const { cropper, data } = this;
      const { modified } = data;

      if (data.cropping) {
        this.croppedData = cropper.getData();
        this.canvasData = cropper.getCanvasData();
        this.cropBoxData = cropper.getCropBoxData();
        const croppedCanvas = cropper.getCroppedCanvas(
          data.type === "image/png"
            ? {}
            : {
                fillColor: "#fff"
              }
        );
        this.stop();
        return {
          ...this.croppedData,
          croppedCanvas,
          modified
        };
      }
    },

    clear() {
      if (this.data.cropping) {
        this.cropper.clear();
        this.update({
          cropping: false
        });
      }
    },

    restore() {
      if (this.data.cropped) {
        this.update({
          cropped: false,
          modified: false,
          previousUrl: "",
          url: this.data.previousUrl
        });
      }
    },

    reset() {
      this.stop();
      this.update({
        cropped: false,
        cropping: false,
        loaded: false,
        modified: false,
        name: "",
        previousUrl: "",
        type: "",
        url: ""
      });
    },

    update(data) {
      Object.assign(this.data, data);
    }
  }
};
</script>

<style scoped>
.photo-editor-editor {
  height: 100%;
}

.photo-editor-canvas {
  align-items: center;
  display: flex;
  height: 99%;
  justify-content: center;

  & > img {
    max-height: 100%;
    max-width: 100%;
  }
}

.photo-editor-toolbar {
  background-color: rgba(0, 0, 0, 0.5);
  bottom: 1rem;
  color: #fff;
  height: 2rem;
  left: 50%;
  margin-left: -8rem;
  position: absolute;
  width: 16rem;
  z-index: 2015;
  border-radius: 4px;
}

.photo-editor-toolbar__button {
  background-color: transparent;
  border-width: 0;
  color: #fff;
  cursor: pointer;
  display: block;
  float: left;
  font-size: 0.875rem;
  height: 2rem;
  text-align: center;
  width: 2rem;

  &:focus {
    outline: none;
  }

  &:hover:first-child {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  &:hover {
    background-color: #0074d9;
    color: #fff;
  }
  &:hover:last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
}
</style>
