<template>
  <div class="calendar-view">
    <div class="calendar-view__controls">
      <div class="calendar-view__controls-inner">
        <button class="calendar-view__control-left"
                type="button"
                aria-label="Previous month"
                @click="previousMonth"></button>
        <div class="calendar-view__date">Декабрь 2022 г.</div>
        <button class="calendar-view__control-right"
                type="button"
                aria-label="Next month"
                @click="nextMonth"></button>
      </div>
    </div>

    <div class="calendar-view__grid">
      <div v-for="pageDay in pageDays"
           class="calendar-view__cell"
           :class="{ 'calendar-view__cell_inactive': !pageDay.active }"
           tabindex="0">
        <div class="calendar-view__cell-day">{{ pageDay.day }}</div>
        <div class="calendar-view__cell-content"
             v-for="meetup in pageDay.meetups">
          <a :href="`/meetups/${meetup.id}`"
             class="calendar-event">{{ meetup.title }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { tr } from 'date-fns/locale';

export default {
  name: 'MeetupsCalendar',

  props: {
    meetups: {
      type: Array,
      required: true,
    },

    weekStartDay: {
      type: Number,
      default: 1,
      validator(value) {
        return value >= 0 && value <= 6;
      },
    },
  },

  data() {
    return {
      selectedDate: new Date(),
    }
  },

  methods: {
    nextMonth() {
      this.selectedDate = new Date(this.selectedYear, this.selectedMonth + 1, 1);
    },

    previousMonth() {
      this.selectedDate = new Date(this.selectedYear, this.selectedMonth - 1, 1);
    },
  },

  computed: {
    weekEndDay() {
      return this.weekStartDay === 0 ? 6 : this.weekStartDay - 1;
    },

    selectedYear() {
      return this.selectedDate.getFullYear();
    },

    selectedMonth() {
      return this.selectedDate.getMonth();
    },

    previousMonthDates() {
      const dates = [];

      // Start of the month.
      const tmpDate = new Date(this.selectedYear, this.selectedMonth, 1);

      // Until the start of the week.
      while (tmpDate.getDay() !== this.weekStartDay) {
        // Get the previous day.
        tmpDate.setDate(tmpDate.getDate() - 1);

        // Helps us to avoid the reverse operation.
        const idx = tmpDate.getDay() - this.weekStartDay;
        dates[idx] = {
          active: false,
          day: tmpDate.getDate(),
          start: tmpDate.getTime(),
          meetups: [],
        };
      }

      return dates;
    },

    currentMonthDates() {
      const dates = [];

      // Start of the month.
      const tmpDate = new Date(this.selectedYear, this.selectedMonth, 1);

      while (tmpDate.getMonth() === this.selectedMonth) {
        dates.push({
          active: true,
          day: tmpDate.getDate(),
          start: tmpDate.getTime(),
          meetups: [],
        });

        // Get the next day.
        tmpDate.setDate(tmpDate.getDate() + 1);
      }

      return dates;
    },

    nextMonthDates() {
      const dates = [];

      // End of the month.
      const tmpDate = new Date(this.selectedYear, this.selectedMonth + 1, 0);

      // Until the end of the week.
      while (tmpDate.getDay() !== this.weekEndDay) {
        // Get the next day.
        tmpDate.setDate(tmpDate.getDate() + 1);

        dates.push({
          active: false,
          day: tmpDate.getDate(),
          start: tmpDate.getTime(),
          meetups: [],
        });
      }

      return dates;
    },

    pageDays() {
      const MILLISECONDS_IN_DAY = 86400000;

      const pageDays = [
        ...this.previousMonthDates,
        ...this.currentMonthDates,
        ...this.nextMonthDates,
      ];

      let dayIdx = 0;
      let meetupIdx = 0;

      // We assume that the meetup list is ordered.
      while (dayIdx < pageDays.length && meetupIdx < this.meetups.length) {
        const day = pageDays[dayIdx];
        const dayStart = day.start;
        const dayEnd = dayStart + MILLISECONDS_IN_DAY;
        const meetup = this.meetups[meetupIdx];

        if (meetup.date >= dayStart && meetup.date < dayEnd) {
          day.meetups.push(meetup);
          meetupIdx++;
        } else if (meetup.date >= dayEnd) {
          dayIdx++;
        } else {
          meetupIdx++;
        }
      }

      return pageDays;
    },

    // startDate() {
    //   const startDate = new Date(this.selectedDate.getTime());
    //   startDate.setDate(startDate.getDay() - this.weekStartDay);
    //   return startDate;
    // },


  },
};
</script>

<style scoped>
.calendar-view {}

.calendar-view__controls {
  text-align: center;
  font-weight: 700;
  font-size: 24px;
  line-height: 1;
  color: var(--blue);
  background-color: var(--blue-extra);
  padding: 24px;
  display: flex;
  justify-content: center;
}

.calendar-view__controls-inner {
  max-width: 325px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  text-transform: capitalize;
}

.calendar-view__controls-inner button {
  border: none;
  padding: 0;
}

.calendar-view__control-left,
.calendar-view__control-right {
  width: 30px;
  height: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s all;
  background: url('@/assets/icons/icon-pill-active.svg') left center no-repeat;
  background-size: cover;
}

.calendar-view__control-left:hover,
.calendar-view__control-right:hover {
  opacity: 0.8;
}

.calendar-view__control-right {
  transform: rotate(180deg);
}

.calendar-view__grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
}

.calendar-view__grid {
  border: 1px solid var(--grey);
  border-bottom: none;
}

.calendar-view__cell {
  position: relative;
  height: auto;
  padding: 6px 8px;
  background-color: var(--white);
  color: var(--grey-8);
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  border-bottom: 1px solid var(--grey);
  border-left: 1px solid var(--grey);
  text-align: right;
}

.calendar-view__cell.calendar-view__cell_inactive {
  background-color: var(--grey-light);
}

@media all and (max-width: 767px) {
  .calendar-view__cell:nth-child(5n + 1) {
    border-left: none;
  }
}

@media all and (min-width: 767px) {
  .calendar-view__grid {
    grid-template-columns: repeat(7, 1fr);
  }

  .calendar-view__cell {
    height: 144px;
  }

  .calendar-view__cell:nth-child(7n + 1) {
    border-left: none;
  }
}

.calendar-event {
  --max-lines: 2;
  --line-height: 16px;

  display: block;
  text-align: left;
  text-decoration: none;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 14px;
  font-weight: 600;
  line-height: var(--line-height);
  color: var(--white);
  padding: 4px 6px;
  border-radius: 2px;
  background-color: var(--blue);
  margin-top: 4px;
}

@media all and (min-width: 767px) {
  .calendar-event {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    max-height: calc(var(--max-lines) * var(--line-height) + 6px);
  }
}
</style>
