import Vue from 'vue';
import Editor from './editor.vue';
import Loader from './loader.vue';
import Navbar from './navbar.vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faTrash, faHandPaper, faExpandAlt, faSearchPlus, faSearchMinus, faUndo, faRedo, faArrowsAltH, faArrowsAltV, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(
  faCheck,
  faTrash,
  faHandPaper,
  faExpandAlt,
  faSearchPlus,
  faSearchMinus,
  faUndo,
  faRedo,
  faArrowsAltH,
  faArrowsAltV,
  faArrowLeft,
);

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.component(Editor.name, Editor);
Vue.component(Loader.name, Loader);
Vue.component(Navbar.name, Navbar);
