<template>
  <masonry
    :cols="{ default: 3, 1266: 2, 700: 1 }"
    :gutter="{ default: '10px', 700: '10px' }"
  >
    <div
      v-for="order in orders.items"
      :key="order.idOrden"
      class="mb-10 mt-1 zoomInUp"
      id="items"
    >
      <app-card-order
        :order="order"
        :tipoCard="tipoCard"
        @doneOrderEmit="doneOrder"
        @paymentOrderEmit="paymentOrder"
        @deliveryOrderEmit="deliveryOrder"
      />
    </div>
    <!-- modal para imprimir ticket -->

    <template>
      <v-dialog
        v-model="dialogPrint"
        transition="dialog-top-transition"
        max-width="600px"
        persistent
      >
        <template>
          <v-row class="justify-center grey darken-4" dense>
            <v-btn
              depressed
              color="grey darken-4"
              class="white--text my-3"
              width="100%"
              @click="dialogPrint = false"
              ><v-icon style="margin-left: 95%" size="35"
                >mdi-close</v-icon
              ></v-btn
            >
            <v-col class="col-12 grey darken-4">
              <iframe
                title="Ticket"
                type="application/pdf"
                style="width: 100%; height: 800px"
                class="grey darken-4"
                :src="doc"
              ></iframe>
            </v-col>
          </v-row>
        </template>
      </v-dialog>
    </template>
  </masonry>
</template>

<script>
import AppCardOrder from "./AppCardOrder.vue";
import { toastMessage } from "../helpers/messages";
//import { printTicket } from "../helpers/printticket";

export default {
  name: "AppContainerCardsOrders",
  components: {
    AppCardOrder,
  },
  props: {
    tipoCard: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    orders: {
      items: [],
      hasItems: false,
    },
    dialogPrint: false,
    doc: "",
  }),
  mounted() {
    this.$services.shareds.getOrders().then((response) => {
      if (response.data.ok) {
        this.orders = response.data.collection;
      }
    });

    if (this.tipoCard === "Cocina") {
      this.$services.socketioService.getSendOrder((payload) => {
        this.orders.items = [...this.orders.items, payload];
      });
    } else if (this.tipoCard === "Mesero") {
      this.$services.socketioService.getDoneOrder((payload) => {
        this.orders.items = [...this.orders.items, payload];
      });
    } else if (this.tipoCard === "CajeroPay") {
      this.$services.socketioService.getDeliveryOrder((payload) => {
        this.orders.items = [...this.orders.items, payload];
      });
    }
  },
  methods: {
    doneOrder(id) {
      this.$services.shareds
        .changeStateOrder(id)
        .then((response) => {
          if (response.data.ok) {
            this.isCashier = response.data.isCashier
              console.log(response.data)
              this.$services.socketioService.doneOrder(response.data.order);
            

            this.orders.items = this.orders.items.filter(
              (order) => order.idOrden !== id
            );

            toastMessage(
              "success",
              "Exito",
              "Se realizo la orden correctamente"
            );
          }
        })
        .catch((error) => {
          console.log(error);

          toastMessage("error", "Error :(", "No se pudo realizar la orden");
        });
    },

    paymentOrder(id, order, subTotal, impuestos, total) {
      this.$services.socketioService.paidoutOrder(order);

      const numeroMesa = order.table ? order.table.numero : "Orden para llevar";

      // this.doc = printTicket(
      //   order.nombreCliente,
      //   order.employee.nombre,
      //   numeroMesa,
      //   subTotal,
      //   impuestos,
      //   total,
      //   order.order_details,
      //   this.$store.getters.user.commercial
      // );

      // this.dialogPrint = true;

      this.orders.items = this.orders.items.filter(
        (order) => order.idOrden !== id
      );
      toastMessage(
        "success",
        "Exito",
        "El pago de la orden se realizo correctamente"
      );
    },
    deliveryOrder(id) {
      this.$services.shareds
        .changeStateOrder(id)
        .then((response) => {
          if (response.data.ok) {
            this.$services.socketioService.deliveryOrder(response.data.order);
            this.orders.items = this.orders.items.filter(
              (order) => order.idOrden !== id
            );

            toastMessage(
              "success",
              "Exito",
              "Se entrego la orden correctamente"
            );
          }
        })
        .catch((error) => {
          console.log(error);

          toastMessage("error", "Error :(", "No se pudo realizar la orden");
        });
    },
  },
};
</script>

<style scoped>
.zoomInUp {
  -webkit-animation-name: zoomInUp;
  animation-name: zoomInUp;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}
@-webkit-keyframes zoomInUp {
  0% {
    opacity: 0;
    -webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(0, 1000px, 0);
    transform: scale3d(0.1, 0.1, 0.1) translate3d(0, 1000px, 0);
    -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  60% {
    opacity: 1;
    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0);
    transform: scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0);
    -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
  }
}
@keyframes zoomInUp {
  0% {
    opacity: 0;
    -webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(0, 1000px, 0);
    transform: scale3d(0.1, 0.1, 0.1) translate3d(0, 1000px, 0);
    -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  60% {
    opacity: 1;
    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0);
    transform: scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0);
    -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
  }
}

.orders {
  min-width: 500px;
}
</style>
