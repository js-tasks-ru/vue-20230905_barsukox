import { createApp, defineComponent } from './vendor/vue.esm-browser.js';

const API_URL = 'https://course-vue.javascript.ru/api';

function fetchMeetupById(meetupId) {
  return fetch(`${API_URL}/meetups/${meetupId}`).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      return response.json().then((error) => {
        throw error;
      });
    }
  });
}

const App = defineComponent({
  name: 'MeetupTitle',

  data() {
      return {
        meetupID: '',
        meetupTitle: '',
      };
  },

  watch: {
    meetupID(newMeetupID, oldMeetupID) {
      fetchMeetupById(newMeetupID).then(meetup => {
        this.meetupTitle = meetup.title;
      });
    },
  },
});

const app = createApp(App);
app.mount('#app');
