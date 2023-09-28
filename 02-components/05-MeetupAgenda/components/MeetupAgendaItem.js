import { defineComponent } from '../vendor/vue.esm-browser.js';
import { agendaItemIcons, agendaItemDefaultTitles } from '../meetupService.js';

export default defineComponent({
  name: 'MeetupAgendaItem',

  props: {
    agendaItem: {
      type: Object,
      required: true,
    },
  },

  computed: {
    agendaItemIcon() {
      const agendaType = this.agendaItem.type;
      return agendaItemIcons[agendaType] || agendaItemIcons.opening;
    },

    agendaItemTitle() {
      const agendaType = this.agendaItem.type;
      const agendaItemTitle = this.agendaItem.title;
      return agendaItemTitle || agendaItemDefaultTitles[agendaType];
    },
  },

  template: `
    <div class="agenda-item">
      <div class="agenda-item__col">
        <img :src="\`/assets/icons/icon-\${agendaItemIcon}.svg\`" class="icon" alt="key" />
      </div>
      <div class="agenda-item__col">
        <time :datetime="agendaItem.startsAt">{{ agendaItem.startsAt }}</time>
          -
        <time :datetime="agendaItem.endsAt">{{ agendaItem.endsAt }}</time>
      </div>
      <div class="agenda-item__col">
        <h3 class="agenda-item__title">{{ agendaItemTitle }}</h3>
        <p class="agenda-item__talk" v-if="agendaItem.type == 'talk'">
          <span>{{ agendaItem.speaker }}</span>
          <span class="agenda-item__dot"></span>
          <span class="agenda-item__lang">{{ agendaItem.language }}</span>
        </p>
        <p v-if="agendaItem.description">{{ agendaItem.description }}</p>
      </div>
    </div>`,
});
