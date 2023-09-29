import { defineComponent } from '../vendor/vue.esm-browser.js';

export default defineComponent({
  name: 'MeetupCover',

  props: {
    title: String,
    image: String,
  },

  methods: {
    escapeQuotes(value) {
      if (typeof value !== 'string') return value;

      return value.replaceAll(`'`, `\\'`).replaceAll(`"`, `\\"`);
    },
  },

  computed: {
    escapedImageURL() {
      // Quotes are allowed characters in the file name.
      // They can break the DOM or make the page vulnerable to XSS.
      return this.escapeQuotes(this.image);
    },

    meetupCoverInlineStyles() {
      return this.image ? `--bg-url: url('${this.escapedImageURL}')` : null;
    },
  },

  template: `
    <div class="meetup-cover" :style="meetupCoverInlineStyles">
        <h1 class="meetup-cover__title">{{ title }}</h1>
    </div>`,
});
