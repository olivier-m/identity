'use strict';

export default {
  methods: {
    getAllCookies: async function(storeId) {
      let b = await browserInfo();
      let params = {
        storeId: storeId
      };

      if (b.majorVersion > 58) {
        params['firstPartyDomain'] = null;
      }

      return browser.cookies.getAll(params);
    },

    deleteCookie: async function(instance) {
      let proto = instance.secure ? 'https' : 'http';
      let domain = instance.domain;

      if (domain[0] == '.') {
        domain = domain.substr(1);
      }

      let params = {
        url: `${proto}://${domain}${instance.path}`,
        name: instance.name,
        storeId: instance.storeId
      };

      let b = await browserInfo();
      if (b.majorVersion > 58 && b.firstPartyIsolate) {
        params['firstPartyDomain'] = instance.firstPartyDomain;
      }

      return browser.cookies.remove(params);
    }
  }
};


const browserInfo = async function() {
  let version = (await browser.runtime.getBrowserInfo()).version;
  let res = {
    'version': version,
    'majorVersion': parseInt(version.split('.')[0], 10),
    'firstPartyIsolate': false
  };

  if (res.majorVersion > 57) {
    let fpi = await browser.privacy.websites.firstPartyIsolate.get({});
    res['firstPartyIsolate'] = fpi.value;
  }

  return res;
};
