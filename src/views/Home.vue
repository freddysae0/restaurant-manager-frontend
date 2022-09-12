<template>
  <v-row align="center" justify="center" class="bg">
    <v-col class="col-12" align="center" justify="center">
      <!--  AQUI PONER EL LOGO -->
      <v-img
        max-height="150"
        max-width="150"
        class="no-gutters"
        width="30%"
        src="../assets/favico.png"
        contain
      ></v-img>
      <v-img
        max-height="400"
        max-width="1200"
        class="no-gutters"
        width="80%"
        src="../assets/logoext.png"
        contain
      ></v-img>
    </v-col>

    <!-- BOTONES-->
    <v-col class="mx-auto zoomInDown btn_home my-auto" cols="12" align="center">
      <v-btn
        min-height="100"
        max-height="100"
        min-width="150px"
        width="80%"
        max-width="450px"
        class="mx-auto rounded-xl no-gutters"
        color="white"
        to="/login"
        outlined
      >
        <v-icon left color="white" size="35"> mdi-login</v-icon>
        <span class="white--text ml-2 txt_btn">{{ txtBtn }}</span>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "Home",

  data() {
    return {
      txtBtn: "Iniciar Sesion",
    };
  },
};
</script>

<style lang="scss" scoped>
.bg {
  background: linear-gradient(rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 1)),
    url("../assets/background2.jpg") repeat-y center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  min-height: 100%;
  margin-right: 1px;
  margin-top: 1px;
}

.btn_home {
  margin-top: -200px;
}

.btn_home .v-btn--outlined {
  border-width: thick;
}

.txt_btn {
  font-size: 13pt;
  white-space: normal;
  width: 50%;
  min-width: 50px;
}

.zoomInDown {
  -webkit-animation-name: zoomInDown;
  animation-name: zoomInDown;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}
@-webkit-keyframes zoomInDown {
  0% {
    opacity: 0;
    -webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0);
    transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0);
    -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  60% {
    opacity: 1;
    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);
    transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);
    -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
  }
}
@keyframes zoomInDown {
  0% {
    opacity: 0;
    -webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0);
    transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0);
    -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  60% {
    opacity: 1;
    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);
    transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);
    -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
  }
}
</style>
