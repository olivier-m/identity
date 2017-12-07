<template>
  <body id="app">
    <div id="page">
      <nav id="nav">
        <ul>
          <router-link tag="li" :to="{name: 'cookie-list-default'}" :exact="false">
            <a>{{ _('cookies') }}</a>
          </router-link>
        </ul>
      </nav>
      <router-view id="main"></router-view>
    </div>
  </body>
</template>
