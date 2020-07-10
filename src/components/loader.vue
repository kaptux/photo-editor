<template>
  <div class="photo-editor-loader" @change="change" @dragover="dragover" @drop="drop">
    <div class="photo-galery">
      <img src="https://firebasestorage.googleapis.com/v0/b/svgedito.appspot.com/o/-MB6M2KEqb9faqdVmsW4%2F-MB6N95HOCKsAeHuJddE.jpg?alt=media&token=cb583662-2e51-44bf-897b-90019ab7cee9" />
      <img src="https://firebasestorage.googleapis.com/v0/b/svgedito.appspot.com/o/-MB6M2KEqb9faqdVmsW4%2F-MB6NFMgFmqWibWX3F0n.jpg?alt=media&token=eb406381-e8ac-48ab-934f-22b8038c9c55" />
    </div>
    <p>
      Drop image here or
      <label class="photo-editor-browse">
        browse...
        <input id="file" class="photo-editor-sr-only" type="file" accept="image/*" />
      </label>
    </p>
  </div>
</template>

<script>
const URL = window.URL || window.webkitURL;

export default {
  name: "Loader",

  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },

  methods: {
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
  display: table;
  height: 100%;
  overflow: hidden;
  width: 100%;
  position: relative;

  & > .photo-galery {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 300px;
    overflow-y: auto;

    box-shadow: inset 2px 2px 10px #000;

    & > img {
      display: block;
      max-width: 280px;
      width: auto;
      height: auto;
      margin: 10px;
    }
  }

  & > p {
    color: #999;
    display: table-cell;
    text-align: center;
    vertical-align: middle;
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
