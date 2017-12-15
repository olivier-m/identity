<template>
  <div class="domain">
    <div class="domain-info">
      <h3 @click.prevent="show_cookies = !show_cookies">
         <icon class="opener" :name="show_cookies ? 'minus-square' : 'plus-square'"></icon>
         <strong>{{ domain }}</strong> <span class="pill">{{ cookies.length }}</span>
       </h3>
      <div class="domain-actions">
        <delete-btn label="" :action="removeAll"></delete-btn>
      </div>
    </div>
    <div class="cookie-list" v-show="show_cookies">
      <cookie-item v-for="(cookie, index) in cookies"
       :cookie="cookie" :key="cookie" ref="cookies">
      </cookie-item>
    </div>
  </div>
</template>

<script>
import CookieItem from './CookieItem.vue';
import DeleteBtn from './DeleteBtn.vue';

export default {
  name: 'cookie-domain',
  components: {CookieItem, DeleteBtn},

  props: {
    domain: {
      type: String,
      required: true
    },
    cookies: {
      type: Object,
      required: true
    },
    show_cookies: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    removeAll: function() {
      for (let cookie of this.$refs.cookies) {
        cookie.remove(false);
      }
    }
  }
};
</script>
