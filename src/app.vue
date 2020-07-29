<template>
  <div class="photo-editor-app">
    <header class="photo-editor-header">
      <span class="photo-editor-title">Image Editor</span>
      <navbar :data="data" @change="change" />
    </header>
    <main class="photo-editor-main">
      <editor v-if="data.loaded" ref="editor" :data="data" />
      <loader v-else ref="loader" :data="data" @deleteImg="deleteImg" />
    </main>
  </div>
</template>

<script>
const noBinding = () => true;
export default {
  data() {
    return {
      data: {
        croppedData: null,
        cropped: false,
        cropping: false,
        loaded: false,
        name: "",
        previousUrl: "",
        type: "",
        url: "",
        galery: [],
        loadingGalery: false,
        remoteImg: null,
      },
      bindings: {}
    };
  },
  methods: {
    bind(action, fn) {
      this.bindings[action] = fn;
    },
    reset() {
      const { editor } = this.$refs;
      if (editor) {
        editor.reset();
      }
    },
    loadRemoteGallery() {
      const getImgGalery = this.bindings["getImgGalery"];
      if (getImgGalery) {
        Object.assign(this.data, {
          galery: [],
          loadingGalery: true,
        });
        getImgGalery((err, res) => {
          Object.assign(this.data, {
            galery: err ? [] : res,
            loadingGalery: false,
          });
        });
      }
    },
    setImage({ type, url }) {
      Object.assign(this.data, {
        loaded: true,
        type,
        url
      });
    },
    deleteImg(url) {
      const onDeleteImg = this.bindings["deleteImg"];
      if (onDeleteImg) {
        onDeleteImg(url, err => {
          if (!err) {
            Object.assign(this.data, {
              galery: this.data.galery.filter(p => p.url != url),
            });
          }
        });
      }
    },
    change(action) {
      const { editor } = this.$refs;
      const binding = this.bindings[action] || noBinding;

      switch (action) {
        case "crop":
          const { remoteImg,} = this.data;
          const croppedInfo = { ...editor.crop(), remoteImg };
          if (binding(croppedInfo)) {
            const { croppedCanvas } = croppedInfo;
            editor.update({
              cropped: true,
              cropping: false,
              previousUrl: this.data.url,
              url: croppedCanvas.toDataURL(this.data.type)
            });
          }
          break;

        case "clear":
          editor.clear();
          break;

        case "restore":
          editor.restore();
          break;

        case "remove":
          editor.reset();
          break;

        default:
      }
    }
  }
};
</script>

<style>
.photo-editor-header {
  background-color: #666;
  height: 3rem;
  overflow: hidden;
  padding-left: 1rem;
  padding-right: 1rem;
  position: relative;
  z-index: 1;
}

@media (min-width: 768px) {
  .photo-editor-header {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

.photo-editor-title {
  color: #fff;
  display: block;
  float: left;
  font-size: 1.125rem;
  line-height: 3rem;
}

.photo-editor-main {
  background-color: #333;
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 3rem;
}
</style>
