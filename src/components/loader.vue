<template>
  <div class="photo-editor-loader" @change="change" @dragover="dragover" @drop="drop">
    <div class="photo-galery">
      <div v-for="photo in data.galery">
        <img :src="photo.url" @click="loadImg(photo)" />
        <button type="button" title="Delete (Delete)" class="delete" @click="deleteImg(photo)">
          <font-awesome-icon icon="trash" />
        </button>
      </div>
    </div>
    <div class="loader">
      <p>
        Drop image here or
        <label class="photo-editor-browse">
          browse...
          <input id="file" class="photo-editor-sr-only" type="file" accept="image/*" />
        </label>
      </p>
    </div>
  </div>
</template>

<script>
const URL = window.URL || window.webkitURL;

export default {
  name: "Loader",
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    deleteImg(photo) {
      this.$emit("deleteImg", photo);
    },
    loadImg(photo) {
      Object.assign(this.data, {
        loaded: true,
        modified: false,
        remoteImg: photo,
        name: "",
        type: "",
        url: photo.url
      });
    },

    read(files) {
      return new Promise((resolve, reject) => {
        if (!files || files.length === 0) {
          resolve();
          return;
        }

        const file = files[0];

        if (/^image\/\w+$/.test(file.type)) {
          if (URL) {
            resolve({
              loaded: true,
              name: file.name,
              type: file.type,
              url: URL.createObjectURL(file)
            });
          } else {
            reject(new Error("Your browser is not supported."));
          }
        } else {
          reject(new Error("Please choose an image file."));
        }
      });
    },

    change({ target }) {
      this.read(target.files)
        .then(data => {
          target.value = "";
          this.update(data);
        })
        .catch(e => {
          target.value = "";
          this.alert(e);
        });
    },

    dragover(e) {
      e.preventDefault();
    },

    drop(e) {
      e.preventDefault();

      this.read(e.dataTransfer.files)
        .then(data => {
          this.update(data);
        })
        .catch(this.alert);
    },

    alert(e) {
      window.alert(e && e.message ? e.message : e);
    },

    update(data) {
      Object.assign(this.data, data);
    }
  }

};
</script>

<style scoped>
.photo-editor-loader {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  height: 100%;
  width: 100%;
  position: relative;

  & > .loader {
    flex: 1;
    align-self: center;

    & > p {
      display: block;
      color: #999;
      text-align: center;
    }
  }

  & > .photo-galery {
    display: table-cell;
    height: 100%;
    width: 250px;
    overflow-y: auto;
    overflow-x: hidden;
    box-shadow: inset 2px 2px 10px #000;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track { }

    &::-webkit-scrollbar-thumb {
      background-color: #666;
    }

    & > div {
      position: relative;

      & > img {
        display: block;
        max-width: 230px;
        width: auto;
        height: auto;
        margin: 10px;
        cursor: pointer;
      }

      & > button.delete {
        position: absolute;
        right: 20px;
        top: 5px;
        width: 32px;
        height: 32px;
        border-radius: 16px;
        color: white;
        background-color: #888;
        border-width: 0;
        cursor: pointer;
      }
    }
  }
}



.photo-editor-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.photo-editor-browse {
  color: #0074d9;
  cursor: pointer;
  margin-left: 0.25rem;

  &:hover {
    color: #08f;
    text-decoration: underline;
  }
}
</style>
