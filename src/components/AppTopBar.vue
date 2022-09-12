<template>
  <div>
    <!--Barra de navegacion superior-->
    <v-app-bar
      color="black"
      dark
      shrink-on-scroll
      src="../assets/background2.png"
    >
      <!--Icono para menu desplegale-->

      <v-toolbar-title>{{ currentRouteName }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <app-menu-bar-user />
    </v-app-bar>
    <!-- SlideBar de navegacion izquierdo -->
  </div>
</template>

<script>
import AppMenuBarUser from "../components/AppMenuBarUser.vue";

import routersInfo from "../router/routers-info";

export default {
  name: "AppTopBar",
  components: {
    AppMenuBarUser,
  },
  data: () => ({
    valuesRouter: Object.values(routersInfo),
  }),
  computed: {
    currentRouteName() {
      const title = this.valuesRouter.find(
        (valueRouter) => valueRouter.name === this.$route.name
      ).title;

      return title;
    },
  },
};
</script>
