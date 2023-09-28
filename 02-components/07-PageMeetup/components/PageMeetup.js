import { defineComponent } from '../vendor/vue.esm-browser.js';
import UiContainer from './UiContainer.js';
import UiAlert from './UiAlert.js';
import MeetupView from '../../../02-components/06-MeetupView/components/MeetupView.js';
import { fetchMeetupById } from '.././meetupService.js';

export default defineComponent({
  name: 'PageMeetup',

  props: {
    meetupId: {
      type: Number,
      required: true,
    },
  },

  components: {
    UiAlert,
    UiContainer,
    MeetupView,
  },

  data() {
    return {
      meetup: null,
      isLoading: true,
      errMsg: '',
    }
  },

  methods: {
    async getMeetup(id) {
      this.isLoading = true;
      try {
        this.meetup = await fetchMeetupById(id);
        this.errMsg = '';
      } catch(e) {
        this.errMsg = e.message;
      }
      this.isLoading = false;
    },
  },

  watch: {
    meetupId: {
      handler(newMeetupId) {
        this.getMeetup(newMeetupId);
      },
      immediate: true,
    },
  },

  template: `
    <div class="page-meetup">
      <UiContainer v-if="isLoading">
        <UiAlert>Загрузка...</UiAlert>
      </UiContainer>
      <UiContainer v-else-if="errMsg">
        <UiAlert>{{ errMsg }}</UiAlert>
      </UiContainer>
      <MeetupView v-else :meetup="meetup"/>
    </div>`,
});
