<template>
  <div class="photo-editor-navbar">
    <nav class="photo-editor-nav" @click="click">
      <button
        v-if="data.cropped"
        type="button"
        class="photo-editor-nav__button"
        data-action="restore"
        title="Undo (Ctrl + Z)"
      >
        <span class="fa fa-undo" />
      </button>
      <button
        v-if="data.loaded"
        type="button"
        class="photo-editor-nav__button nav__button--danger"
        data-action="remove"
        title="Delete (Delete)"
      >
        <span class="fa fa-trash" />
      </button>
      <button
        v-if="data.loaded"
        type="button"
        class="photo-editor-nav__button nav__button--success"
        data-action="crop"
        title="OK (Enter)"
      >
        <span class="fa fa-check" />
      </button>
    </nav>
  </div>
</template>

<script>
export default {
  name: "Navbar",

  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      downloadable: typeof document.createElement("a").download !== "undefined"
    };
  },

  methods: {
    click({ target }) {
      const action =
        target.getAttribute("data-action") ||
        target.parentElement.getAttribute("data-action");

      if (action) {
        this.$emit("change", action);
      }
    }
  }
};
</script>

<style scoped>
.photo-editor-navbar {
  float: right;
}

.photo-editor-nav__button {
  background-color: transparent;
  border-width: 0;
  color: #fff;
  cursor: pointer;
  display: block;
  float: left;
  height: 3rem;
  line-height: 3rem;
  text-align: center;
  width: 3rem;

  &:focus {
    outline: none;
  }

  &:hover {
    background-color: #0074d9;
    color: #fff;
  }
}

.photo-editor-nav--success:hover {
  background-color: #2ecc40;
}

.photo-editor-nav--danger:hover {
  background-color: #ff4136;
}
</style>
