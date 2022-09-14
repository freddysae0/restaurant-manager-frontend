<template>
  <v-card class="ma-3" elevation="10">
    <v-card-title class="pt-8">
      Pagar orden de
      <span class="red--text ml-2">Mesa #{{ order.nombreCliente }}</span>
      <br />
    </v-card-title>
    <v-row class="ma-1">
      <v-card-text>
        <!-- ITEMS SELECCIONADOS -->
        <v-row class="overflow-x-auto " align="center" justify="center">
          <v-col cols="12" sm="10" md="8" class="pa-5 grey lighten-3">
            <h3>Items:</h3>
            <v-list class="grey lighten-3">
              <template v-for="item in order.order_details">
                <v-list-item :key="item.OrderDetial">
                  <!-- Cantidad -->
                  <v-list-item-action>
                    <v-list-item-title class="font-weight-bold">
                      {{ item.cantidad }}
                    </v-list-item-title>
                  </v-list-item-action>

                  <!-- Titulo -->
                  <v-list-item-content>
                    <v-list-item-title
                      style="
                        white-space: normal;
                        word-wrap: break-word;
                        width: 60px;
                        font-weight: bold;
                      "
                    >
                      {{
                        item.menu_item
                          ? item.menu_item.nombre_item
                          : item.nombre_item
                      }}
                    </v-list-item-title>
                  </v-list-item-content>

                  <!-- SubTotal -->
                  <v-list-item-action>
                    <span class="font-weight-bold"
                      >$ {{ parseFloat(item.importe).toFixed(2) }}</span
                    >
                  </v-list-item-action>
                </v-list-item>
              </template>
            </v-list>
          </v-col>
        </v-row>
        <v-row class="justify-center ma-2 pa-5">
          <v-col cols="12" sm="6" md="4">
            <h3>Sub Total:</h3>
            <h4>$ {{ subTotal }}</h4>
          </v-col>
          <v-col cols="12" sm="12" md="4">
            <h3>Total:</h3>
            <h4>$ {{ total }}</h4>
          </v-col>
        </v-row>

        <v-row class="align-center justify-center">
          <v-col cols="12">
            <v-row class="">
              <v-form v-model="btnPayEnableCash" class="col-12" ref="form">
                <v-row dense class="ma-0 pa-0">
                  <v-col cols="12" class="green white--text title py-4 pl-5">
                    Detalles del Pago en Efectivo <br />
                  </v-col>
                </v-row>
                <v-row dense class="ma-0 pa-5">
                  <v-col cols="12" sm="6" md="5">
                    <v-subheader class="grey--text text--lighten-1 pl-0"
                      >IMPORTE REALIZADO</v-subheader
                    >
                    <v-text-field
                      prepend-inner-icon="mdi-currency-usd"
                      single-line
                      outlined
                      :rules="ruleTest"
                      v-model="cashAmount"
                      placeholder="##.##"
                      @keypress.enter="Calculate()"
                    />
                  </v-col>
                  <v-col cols="12" sm="4" md="5" class=" ml-sm-5">
                    <p :hidden="!valid" class="red--text">Monto insuficiente</p>
                    <v-subheader class="grey--text text--lighten-1 pl-0"
                      >CAMBIO</v-subheader
                    >
                    <h3 class="mt-4 font-weight-bold">$ {{ cashBack }}</h3>
                  </v-col>
                </v-row>
              </v-form>
            </v-row>
            <v-row>
              <v-col>
                <v-btn
                  :disabled="!btnPayEnableCash"
                  color="green"
                  class="white--text"
                  block
                  x-large
                  @click="save"
                >
                  <v-icon>mdi-cash-check</v-icon>
                  <span class="hidden-xs-only ml-1">Pagar</span>
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-row>
  </v-card>
</template>

<script>
import { Rules } from "../helpers/rules.js";
import store from "../store";

export default {
  name: "OrdersFormPay",
  props: {
    order: {
      type: Object,
      required: true,
    },
    total: {
      type: String,
      required: true,
    },
    subTotal: {
      type: String,
      required: true,
    },

    createOrder: {
      type: Function,
    },
    changeState: {
      type: Function,
    },
  },
  data() {
    return {
      empleado: "",
      mesa: "",

      form: true, //true Form, false Card

      btnPayEnable: false,
      btnPayEnableCash: false,
      valid: false,

      ruleRequired: Rules.required,
      ruleOnlyAlpha: Rules.alpha,
      ruleDecimal: Rules.decimal,

      ruleTest: "",

      //Pago en efectivo

      cashName: "",
      cashAmount: "",
      cashBack: "",
    };
  },
  created() {
    this.setRule();
  },
  mounted() {
    if (this.deDonde === "from") {
      this.form = true;
    } else {
      this.form = false;
    }
  },
  watch: {
    cashAmount: {
      handler: function(value, oldVal) {
        const amount = value - this.total;
        this.cashBack =
          amount >= 0 ? amount.toFixed(2) : (amount * -1).toFixed(2);
      },
    },
  },
  methods: {
    setRule() {
      this.ruleTest = Rules.test(this.total);
    },
    save() {
      store.state.efectivo += this.total;
      if (typeof this.createOrder === "function") {
        const order = {
          ...this.order,
          importe: this.cashAmount,
        };
        this.createOrder(order);
      } else if (typeof this.changeState === "function") {
        this.changeState(this.cashAmount);
      }
    },

    Calculate() {
      const value = parseFloat(this.cashAmount) - parseFloat(this.total);

      if (isNaN(value)) {
        this.cashBack = "";
      } else {
        if (value.toFixed(2) < 0) {
          this.valid = true;
          this.cashBack = "";
        } else {
          this.valid = false;
          this.cashBack = value.toFixed(2);
        }
      }
    },
  },
};
</script>
