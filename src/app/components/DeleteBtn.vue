<template>
  <button @click.prevent="onClicked" class="delete-btn" :class="state == 0 ? '' : 'delete-confirm'">
    <icon name="trash-o"></icon>
    {{ state == 0 ? label : labelConfirm }}
  </button>
</template>

<script>
export default {
  name: 'delete-btn',

  data() {
    return {
      state: 0
    };
  },

  props: {
    label: {
      type: String,
      required: false,
      default: 'Delete'
    },
    labelConfirm: {
      type: String,
      required: false,
      default: 'Confirm'
    },
    action: {
      type: Function,
      required: true
    }
  },

  methods: {
    onClicked: function() {
      let timeout = -1;
      if (this.state == 1) {
        window.clearTimeout(timeout);
        this.action();
        return;
      }

      this.state = 1;
      timeout = setTimeout(() => {
        this.state = 0;
      }, 2000);
    }
  }
};
</script>
