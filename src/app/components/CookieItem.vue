<template>
  <div class="cookie-details">
    <div class="cookie-info">
      <strong class="cookie-name">{{ cookie.name }}</strong>
      <span class="icon warning" v-if="!cookie.secure" :title="_('cookie_secure_off')"><icon name="unlock"></icon></span>
      <span class="icon" v-if="cookie.secure" :title="_('cookie_secure_on')"><icon name="lock"></icon></span>
      <span class="icon warning" v-if="!cookie.hostOnly" :title="_('cookie_hostonly_off')"><icon name="globe"></icon></span>
      <span class="icon warning" v-if="!cookie.httpOnly" :title="_('cookie_httponly_off')"><icon name="eye"></icon></span>

      <div class="cookie-limits" v-if="has_limits">
        <span v-if="has_fpd_limits"
         v-html="_('this_domain_only', [cookie.firstPartyDomain, 'strong'])">
       </span>
       <span v-if="has_path_limits"
        v-html="_('this_path_only', [cookie.path, 'strong'])"></span>
      </div>

      <div class="cookie-expires">{{ formatedExpirationDate }}</div>
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
    formatedExpirationDate() {
      if (this.cookie.session) {
        return this._('expires_session');
      }
      let date = new Date(this.cookie.expirationDate * 1000);
      return this._('expires_at_date', date.toDateString());
    },

    has_path_limits() {
      return this.cookie.path && this.cookie.path != '/';
    },

    has_fpd_limits() {
      return this.cookie.firstPartyDomain;
    },

    has_limits() {
      return this.has_path_limits || this.has_fpd_limits;
    }
  },

  methods: {
    remove: async function() {
      return await this.deleteCookie(this.cookie);
    }
  }
};
</script>
