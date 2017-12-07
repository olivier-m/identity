<template>
  <div>
    <h2>{{ _('cookies') }}</h2>
    <div class="containers-wrapper">
      <ul class="container-list">
        <router-link v-for="item in containers" :key="item.name" tag="li"
         :to="{name: 'cookie-list', params: {storeId: item.storeId}}">
          <a :style="`color: ${item.color}; border-color: ${item.color};`">
            <span class="container-icon"
             :style="`background-color: ${item.color};`">
             <img v-if="item.icon" :src="item.icon" alt="" />
             <icon v-else name="firefox"></icon>
           </span>
          {{ item.name }}</a>
        </router-link>
      </ul>

      <cookie-list :storeId="$route.params.storeId"></cookie-list>
    </div>
  </div>
</template>

<script>
import CookieList from '../components/CookieList.vue';

export default {
  components: {CookieList},

  data() {
    return {
      'containers': [{
        'name': 'Default',
        'storeId': 'firefox-default',
        'color': '#363959',
        'icon': null
      }]
    };
  },

  mounted: async function() {
    let containers = await browser.contextualIdentities.query({});
    for (let container of containers) {
      this.containers.push({
        'name': container.name,
        'storeId': container.cookieStoreId,
        'color': container.colorCode,
        'icon': container.iconUrl
      });
    }
  }
};
</script>
