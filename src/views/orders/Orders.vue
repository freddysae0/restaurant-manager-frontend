<template>
  <app-layout>
    <v-container v-if="isCashier" fluid style="max-width: 1400px">
      <v-row class="mt-3 align-center justify-center">
        <v-btn-toggle
          v-model="step"
          shaped
          borderless
          mandatory
          color="green accent-4"
          id="toggle1"
          class="justify-center mr-0 pr-0 pl-0 ml-0 green--text"
        >
      

          <v-btn class="btn1">
            <v-icon
              size="28"
              class="mr-1"
              :color="step === 1 ? 'green accent-4' : 'black'"
              >mdi-format-list-bulleted-square</v-icon
            >
            <span class="hidden-xs-only">Ver Ordenes</span>
          </v-btn>
          <v-btn class="btn1">
            <v-icon
              size="28"
              class="mr-1"
              :color="step === 2 ? 'green accent-4' : 'black'"
              >mdi-cash-register</v-icon
            >
            <span class="hidden-xs-only">Opciones de Caja</span>
          </v-btn>
        </v-btn-toggle>
      </v-row>

      <v-row class="align-center justify-center">
        <v-window v-model="step" class="col-12">
        

          <v-window-item v-if="step ==0" :value="0">
            <v-row class="pa-8 fill-height align-center justify-center">
              <v-col class="col-12">
                <app-container-cards-orders :tipoCard="'CajeroPay'" />
              </v-col>

            </v-row>
          </v-window-item>

          <v-window-item v-if="step ==1" :value="1">
            <v-row justify="center" align="center" no-gutters>
              <v-col cols="12">
                <cash-register />
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
      </v-row>
    </v-container>

    <v-container v-else fluid style="max-width: 1400px">
      <v-row class="mt-3 align-center justify-center">
        <v-btn-toggle
          v-model="step"
          shaped
          borderless
          mandatory
          color="green accent-4"
          id="toggle1"
          class="justify-center mr-0 pr-0 pl-0 ml-0 green--text"
        >
          <v-btn v-if="!isCashier" class="btn1">
            <v-icon
              size="28"
              class="mr-1"
              :color="step === 0 ? 'green accent-4' : 'black'"
              >mdi-hamburger-plus</v-icon
            >
            <span class="hidden-xs-only">Nueva Orden</span>
          </v-btn>

          <v-btn class="btn1">
            <v-icon
              size="28"
              class="mr-1"
              :color="step === 1 ? 'green accent-4' : 'black'"
              >mdi-format-list-bulleted-square</v-icon
            >
            <span class="hidden-xs-only">Ver Ordenes</span>
          </v-btn>
          <v-btn v-if="isCashier" class="btn1">
            <v-icon
              size="28"
              class="mr-1"
              :color="step === 2 ? 'green accent-4' : 'black'"
              >mdi-cash-register</v-icon
            >
            <span class="hidden-xs-only">Opciones de Caja</span>
          </v-btn>
        </v-btn-toggle>
      </v-row>

      <v-row class="align-center justify-center">
        <v-window v-model="step" class="col-12">
          <v-window-item  :value="0">
            <orders-create-or-edit />
          </v-window-item>

          <v-window-item :value="1">
            <v-row class="pa-8 fill-height align-center justify-center">
             
              <v-col  class="col-12">
                <app-container-cards-orders
                  :orders="orders.items"
                  :tipoCard="'Mesero'"
                />
              </v-col>
            </v-row>
          </v-window-item>

          <v-window-item v-if="isCashier" :value="2">
            <v-row justify="center" align="center" no-gutters>
              <v-col cols="12">
                <cash-register />
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
      </v-row>
    </v-container>
  </app-layout>
</template>

<script>
import AppLayout from "../../layout/AppLayout.vue";
import OrdersCreateOrEdit from "../../components/OrdersCreateOrEdit.vue";

import AppContainerCardsOrders from "../../components/AppContainerCardsOrders.vue";

import OrdersFormPay from "../../components/OrdersFormPay.vue";
import CashRegister from "../../components/CashRegister.vue";

export default {
  name: "Orders",
  components: {
    AppLayout,
    OrdersCreateOrEdit,
    AppContainerCardsOrders,
    OrdersFormPay,
    CashRegister,
  },

  mounted() {
    this.isCashier =
      this.$store.getters.user.role.user_level.nivel_usuario === 3;
    this.$store.dispatch("itemsMenuSelectAction", []);

    this.step = parseInt(localStorage.getItem(this.$route.name)) || 0;
  },

  data() {
    return {
      isCashier: false,
      switch1: true,
      step: 0,

      orders: {
        items: [],
        hasItems: false,
      },

      show: false,

      //Tipos
      tCocina: "Cocina",
      tMesero: "Mesero",
      tCajero: "Cajero",
      tCajeroPay: "CajeroPay",
    };
  },
  watch: {
    step: function (val) {
      localStorage.setItem(this.$route.name, this.step);
      console.log('ssssssssssss' , val)
    },
  },
};
</script>


<style lang="css" scoped>
@media only screen and (max-width: 600px) {
  .col-menu {
    visibility: hidden;
    height: 0;
    padding: 0;
    margin: 0;
  }
}
#toggle1 {
  width: 700px;
}

.btn1 {
  width: 31%;
}
</style>