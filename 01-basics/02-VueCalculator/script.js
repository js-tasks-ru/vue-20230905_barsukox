import { createApp, defineComponent } from './vendor/vue.esm-browser.js';

const App = defineComponent({
  name: 'VueCalculator',

  data() {
    return {
      left: '',
      right: '',
      operator: '',
    };
  },

  computed: {
    result() {
      // Don't proceed if the values are not valid floating point numbers.
      if (typeof this.left !== 'number' || typeof this.right !== 'number') {
        return '';
      }

      let rawResult;

      if (this.operator === 'sum') {
        rawResult = this.left + this.right;
      } else if (this.operator === 'subtract') {
        rawResult = this.left - this.right;
      } else if (this.operator === 'multiply') {
        rawResult = this.left * this.right;
      } else if (this.operator === 'divide') {
        if (this.right === 0) {
          return 'Divide by zero error encountered';
        }
        rawResult = this.left / this.right;
      } else {
        return '';
      }

      // toFixed to fix precision losses.
      // parseFloat to remove trailing zeros.
      return parseFloat(rawResult.toFixed(5));
    },
  },
});

const app = createApp(App);
app.mount('#app');
