<template>
  <div class="toasts">
    <UiToast v-for="[key, toast] of toasts" :key="key" :type="toast.type" :message="toast.message" />
  </div>
</template>

<script>
import UiToast from './UiToast.vue';

export default {
  name: 'TheToaster',

  components: { UiToast },

  data() {
    return {
      nextID: -1,
      toasts: new Map(),
    }
  },

  methods: {
    success(message) {
      this.addToast(message);
    },

    error(message) {
      this.addToast(message, 'error');
    },

    addToast(message, type) {
      const toastID = this.nextID--;
      this.toasts.set(toastID, {
        type,
        message: message,
      });
      this.scheduleRemoval(toastID);
    },

    scheduleRemoval(toastID, duration = 5000) {
      setTimeout(() => {
        this.toasts.delete(toastID);
      }, duration);
    },
  },
};
</script>

<style scoped>
.toasts {
  position: fixed;
  bottom: 8px;
  right: 8px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  white-space: pre-wrap;
  z-index: 999;
}

@media all and (min-width: 992px) {
  .toasts {
    bottom: 72px;
    right: 112px;
  }
}
</style>
