<template>
  <div class="domain-list">
    <div class="list-actions" v-if="Object.keys(cookies).length > 0">
      <div class="list-action-toggle">
        <button @click.prevent="toogleExpand">
          {{ collapsed ? _('expand_all') : _('collapse_all') }}
        </button>
      </div>
      <div class="list-action-remove">
        <delete-btn :label="_('remove_all_cookied')" :label-confirm="_('click_to_confirm')"
       :action="removeAll" />
     </div>
    </div>
    <cookie-domain v-for="[domain, cookies] of cookies" :key="storeId+domain"
     :domain="domain" :cookies="cookies" ref="domains"></cookie-domain>
  </div>
</template>

<script>
import CookieDomain from './CookieDomain.vue';
import DeleteBtn from './DeleteBtn.vue';

export default {
  components: {CookieDomain, DeleteBtn},
  data() {
    return {
      'cookies': []
    };
  },

  props: {
    storeId: {
      type: String,
      required: true
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  watch: {
    storeId(to, from) {
      if (to != from) {
        this.collapsed = true;
        this.cookies = [];
        this.fetchCookies();
      }
    }
  },

  mounted() {
    browser.cookies.onChanged.addListener(this.onMozCookieChanged);
    this.fetchCookies();
  },

  beforeDestroy() {
    if (browser.cookies.onChanged.hasListener(this.onMozCookieChanged)) {
      browser.cookies.onChanged.removeListener(this.onMozCookieChanged);
    }
  },

  computed: {
    domains() {
      return this.cookies.map(x => x[0]);
    }
  },

  methods: {
    fetchCookies: async function() {
      let cookies = (await this.getAllCookies(this.storeId)).map(cookie => {
        this._addDomain(cookie);
        return cookie;
      });

      this.cookies = cookies.sort((a, b) => {
        return (a.dom + a.name).localeCompare(b.dom + b.name);
      }).reduce((r, a) => {
        let idx = r.map(x => x[0]).indexOf(a.dom);
        if (idx === -1) {
          r.push([a.dom, [a]]);
        }
        else {
          r[idx][1].push(a);
        }
        return r;
      }, []);
    },

    _addDomain(cookie) {
      let dom = cookie.domain;
      if (dom[0] == '.') {
        dom = dom.substr(1);
      }
      cookie.dom = dom;
    },

    _getId(cookie) {
      let proto = cookie.secure ? 'https' : 'http';
      return `${proto}+${cookie.domain}+${cookie.path}+${cookie.name}`;
    },

    _updateList(cookie) {
      let domains = this.domains;
      let idx = domains.indexOf(cookie.dom);
      if (idx !== -1) {
        let pos = this.cookies[idx][1].map(x => x.name).concat([cookie.name]).sort().indexOf(cookie.name);
        this.cookies[idx][1].splice(pos, 0, cookie);
      }
      else {
        let pos = domains.concat([cookie.dom]).sort().indexOf(cookie.dom);
        this.cookies.splice(pos, 0, [cookie.dom, [cookie]]);
      }
    },

    _removeFromList(cookie) {
      let idx = this.domains.indexOf(cookie.dom);
      if (idx === -1) {
        return;
      }
      let dom = this.cookies[idx][1];

      let cookieId = this._getId(cookie);
      dom.forEach((v, i) => {
        if (this._getId(v) == cookieId) {
          dom.splice(i, 1);
        }
      });

      if (dom.length == 0) {
        this.cookies.splice(idx, 1);
      }
    },

    toogleExpand: function() {
      this.collapsed = !this.collapsed;
      for (let domain of this.$refs.domains) {
        domain.show_cookies = !this.collapsed;
      }
    },

    removeAll: function() {
      for (let domain of this.$refs.domains) {
        domain.removeAll(false);
      }
    },

    onMozCookieChanged(changeInfo) {
      if (changeInfo.cookie.storeId != this.storeId) {
        return;
      }

      let cookie = changeInfo.cookie;
      this._addDomain(cookie);

      if (changeInfo.removed) {
        this._removeFromList(cookie);
        return;
      }

      this._updateList(cookie);
    }
  }
};
</script>
