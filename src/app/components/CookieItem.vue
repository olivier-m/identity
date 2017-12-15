<template>
  <div class="cookie-details">
    <div class="cookie-info">
      <strong>{{ cookie.name }}</strong>
      <span class="icon warning" v-if="!cookie.secure" :title="_('cookie_secure_off')"><icon name="unlock"></icon></span>
      <span class="icon" v-if="cookie.secure" :title="_('cookie_secure_on')"><icon name="lock"></icon></span>
      <span class="icon warning" v-if="!cookie.hostOnly" :title="_('cookie_hostonly_off')"><icon name="globe"></icon></span>
      <span class="icon warning" v-if="!cookie.httpOnly" :title="_('cookie_httponly_off')"><icon name="eye"></icon></span>
      <code class="cookie-path" v-if="cookie.path && cookie.path != '/'"
       :title="_('this_path_only')">{{ cookie.path }}</code>
      <em>{{ formatExpirationDate(cookie) }}</em>
    </div>
    <div class="cookie-actions">
      <delete-btn label="" :label-confirm="_('confirm')" :action="remove"></delete-btn>
    </div>
  </div>
</template>

<script>
import DeleteBtn from './DeleteBtn.vue';

export default {
  name: 'cookie-item',

  components: {DeleteBtn},

  props: {
    cookie: {
      type: Object,
      required: true
    }
  },

  computed: {
    fetchProps() {
      let proto = this.cookie.secure ? 'https' : 'http';
      let domain = this.cookie.domain;
      if (domain[0] == '.') {
        domain = domain.substr(1);
      }

      return {
        url: `${proto}://${domain}${this.cookie.path}`,
        name: this.cookie.name,
        storeId: this.cookie.storeId
      };
    }
  },

  methods: {
    formatExpirationDate(cookie) {
      if (cookie.session) {
        return this._('expires_session');
      }
      let date = new Date(cookie.expirationDate * 1000);
      return this._('expires_at_date', date.toDateString());
    },

    remove: async function() {
      return await browser.cookies.remove(this.fetchProps);
    }
  }
};
</script>
