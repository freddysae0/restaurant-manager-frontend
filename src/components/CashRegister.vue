<template>
  <v-container>
    <v-row class="mt-6" justify="center" align="center">
      <v-col cols="12" class="mb-5">
        <v-btn
          color="grey darken-4"
          large
          class="white--text"
          @click="historial()"
          ><v-icon>mdi-history</v-icon> &nbsp; Ver Historial</v-btn
        >
        <v-row
          :class="verhistorial === false ? 'd-none' : ''"
          justify="center"
          class="mt-5 grey lighten-3"
        >
          <h2 class="pa-5">
            <span><v-icon color="black" size="32">mdi-history</v-icon></span>
            Historial de Arqueo de Caja
          </h2>
          <orders-cash-history v-if="cashRegisters.hasItems == true" :cashRegisters="cashRegisters" />
        </v-row>
      </v-col>

      <v-col cols="12" class="elevation-3">
        <v-row class="mb-1 grey lighten-3 pb-5 pt-2">
          <v-col cols="12">
            <h2 class="font-weight-bold text-wrap mb-3">Arqueo de Caja</h2>
            <span class="text-body-1"
              >Fecha de caja Actual:
              <span class="font-weight-black">{{ getFecha() }} </span><br />
              Estado de caja Actual:
              <span
                class="font-weight-bold"
                :class="estado === 'Abierta' ? 'green--text' : 'red--text'"
                >{{ estado }}</span
              ></span
            >
          </v-col>
        </v-row>

        <v-row :class="estado === 'Cerrada' ? 'd-none' : ''">
          <v-col cols="4">
            Efectivo: <br />
            <span class="font-weight-bold text-body-1"
              >${{ efectivo.toFixed(2) }}</span
            >
          </v-col>
          <v-col cols="4">
            Ingresos: <br />
            <span class="font-weight-bold text-body-1 green--text"
              >${{ credito.toFixed(2) }}</span
            >
          </v-col>
          <v-col cols="4">
            Retiros: <br />
            <span class="font-weight-bold text-body-1 red--text"
              >${{ retiros.toFixed(2) }}</span
            >
          </v-col>

          <v-col cols="12" class="d-flex justify-center">
            <v-btn-toggle
              v-model="step"
              group
              mandatory
              color="light-blue darken-3"
              class="justify-center mr-0 pr-0 pl-0 ml-0"
            >
              <v-btn text class="btn1">
                <v-icon
                  size="28"
                  class="mr-1"
                  :color="step === 0 ? 'light-blue darken-3' : 'black'"
                  >mdi-clipboard-list</v-icon
                >
                <span class="hidden-xs-only">Registro de Ordenes</span>
              </v-btn>

              <v-btn class="btn1">
                <v-icon
                  size="28"
                  class="mr-1"
                  :color="step === 1 ? 'light-blue darken-3' : 'black'"
                  >mdi-hand-coin</v-icon
                >
                <span class="hidden-xs-only">Registros Manuales</span>
              </v-btn>
            </v-btn-toggle>
          </v-col>

          <v-col cols="12">
            <v-window v-model="step">
              <v-window-item :value="0">
                <orders-table-cash-orders @totalOrdersEmit="changeCash" />
              </v-window-item>
              <v-window-item :value="1">
                <orders-table-cash-actions
                  @changeExpensesEmit="changeExpenses"
                  @changeExpensesEmitIngresos="changeExpensesIngresos"
                  @GastosValorEmit="changeExpensesIngresosInit"
                  @newBoxActionEmit="newBoxAction"
                  :idCashRegister="IdCashRegister"
                  :boxActions="BoxActions"
                />
              </v-window-item>
            </v-window>
          </v-col>
        </v-row>
        <v-row class="align-center justify-center my-10">
          <!-- CERRAR CAJA -->
          <v-dialog
            v-model="dialogCaja"
            max-width="500px"
            v-if="estado === 'Abierta'"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                x-large
                class="white--text text-h6"
                color="red"
                v-bind="attrs"
                v-on="on"
              >
                Cerrar Caja
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="black">
                <span class="text-h5 white--text">Cierre de Caja</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form v-model="cerrarEnable" ref="form2">
                    <v-row no-gutters>
                      <v-col cols="12" class="mb-2">
                        <span class="text-h6"
                          >Fecha de caja Actual:
                          <span class="font-weight-black"
                            >{{ getFecha() }}
                          </span></span
                        >
                      </v-col>
                      <v-col cols="12">
                        <h3>Informe de saldo final en caja</h3>
                        <v-text-field
                          prepend-inner-icon="mdi-currency-usd"
                          v-model.number="dinerofisico"
                          outlined
                          dense
                          type="number"
                          :rules="rulesCash"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <h3>Saldo totalizado en el sistema</h3>
                        <h4 class="font-weight-bold">
                          $ {{ saldodelsistema.toFixed(2) }}
                        </h4>
                      </v-col>
                      <v-col cols="12">
                        <h3>Diferencia de saldo (faltante)</h3>
                        <h4 class="font-weight-bold">
                          $ {{ diferencia.toFixed(2) }}
                        </h4>
                      </v-col>
                      <v-col cols="12">
                        <h3>Detalles y Obsevaciones</h3>
                        <v-textarea
                          v-model="descripcion"
                          outlined
                          dense
                          rows="3"
                        ></v-textarea>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="orange darken-1"
                  class="white--text"
                  @click="closeCierre"
                >
                  Cancelar
                </v-btn>
                <v-btn
                  :disabled="!cerrarEnable"
                  color="red darken-1"
                  class="white--text"
                  @click="cerrarCaja"
                >
                  Cerrar Caja
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- ABRIR CAJA -->
          <v-dialog
            v-model="dialog"
            max-width="500px"
            v-if="estado === 'Cerrada'"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="green"
                x-large
                class="mb-2 ml-2 mt-2 white--text text-h6"
                v-bind="attrs"
                v-on="on"
              >
                Abrir Caja
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Abrir Caja</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form v-model="accionEnable" ref="form">
                    <v-row>
                      <v-col cols="12" sm="8" md="8">
                        <v-text-field
                          v-model.number="monto"
                          label="Monto"
                          prepend-inner-icon="mdi-currency-usd"
                          single-line
                          outlined
                          type="number"
                          :rules="rulesCash"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="orange darken-1"
                  @click="close"
                  class="white--text"
                >
                  Cancelar
                </v-btn>
                <v-btn
                  :disabled="!accionEnable"
                  color="blue darken-1"
                  class="white--text"
                  @click="save"
                >
                  Guardar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { Rules } from "../helpers/rules.js";
import OrdersTableCashOrders from "./OrdersTableCashOrders.vue";
import OrdersTableCashActions from "./OrdersTableCashActions.vue";
import OrdersCashHistory from "./OrdersCashHistory.vue";

import { toastMessage } from "../helpers/messages";

export default {
  name: "CashRegister",
  components: {
    OrdersTableCashOrders,
    OrdersTableCashActions,
    OrdersCashHistory,
  },
  mounted() {
    this.getOrders();
          this.getAllCashRegisters();

    this.$services.orders
      .getCashRegister()
      .then((response) => {
        
        if (response.data.ok) {
          
          this.estado = "Abierta";
          this.dialogCaja = false;
           console.log(response.data.cashRegister.idCashRegister);

          this.idCashRegister = response.data.cashRegister.idCashRegister;
        }
      })
      .catch((error) => {
        console.log(error);
      });


  },
  data: () => ({
    estado: "Cerrada", //Abierta, Cerrada
    efectivo: 0,
    credito: 0,
    retiros: 0,
    ingresos:0 ,
    step: 0,
    dialog: false,
    accionEnable: false,
    monto: "",
    rulesCash: Rules.decimal2,
    cerrar: false,
    dinerofisico: "",
    descripcion: "",
    diferencia: 0,
    saldodelsistema: 0,
    dialogCaja: false,
    cerrarEnable: false,

    verhistorial: false,
    idCashRegister: -1,
    boxActions: {
      items: [],
      hasItems: false,
    },
    cashRegisters: {
      hasItems: false,
      items: [],
    },
  }),

  computed: {
    IdCashRegister() {
      return this.idCashRegister;
    },
    BoxActions() {
      return this.boxActions;
    },
    CashRegisters() {
      return this.cashRegisters;
    },
  },
  watch: {

    
    dinerofisico(value) {
      const saldo_final = this.efectivo + this.credito - this.retiros;

      this.saldodelsistema = saldo_final;
      this.diferencia = saldo_final - value;
    },
    dialog(val) {
      val || this.close();
    },
    dialogCaja(val) {
      val || this.close();
    },
  },

  methods: {
    getOrders() {
      this.$services.orders
        .getBoxActions()
        .then((response) => {
          if (response.data.ok) {
            this.boxActions = response.data.collection;

            this.boxActions.items = this.boxActions.items.map(
              ({ isInput, fecha, ...props }) => ({
                ...props,
                isInput,
                tipo: isInput ? "Ingreso" : "Gasto",
                fecha: fecha.slice(0, 19).replace("T", " "),
              })
            );



      let ingreso = 0;
      for (let i = 0; i < this.boxActions.items.length; i++) {
          if(this.boxActions.items[i].tipo == 'Ingreso'){
            ingreso += this.boxActions.items[i].monto; 
          }
      }

      
      this.credito = ingreso;
    

            const expenses = this.boxActions.items.filter(
              (boxAction) => !boxAction.isInput
            );

            const totales = expenses.reduce(
              (acc, boxAction) => boxAction.monto + acc,
              0
            );

            this.retiros = totales;
          }
        })
        .catch((error) => {
          console.log(error);
          toastMessage(
            "error",
            "Error :(",
            "No se pudieron cargar las acciones registradas"
          );
        });
    },

    getAllCashRegisters() {
      this.$services.orders
        .getAllCashRegisters()
        .then((response) => {
          console.log(response , 'GetAllCashRegisters')
          if (response.data.ok) {
            console.log(response.data.cashRegister , 'response.data.cashRegister');
            this.cashRegisters.items = response.data.cashRegister;
            this.cashRegisters.hasItems = true;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },


    changeCash(cantidad) {
      this.efectivo += parseFloat(cantidad);
    },

    changeExpenses(cantidad) {
      this.retiros += parseFloat(cantidad);
    },

    changeExpensesIngresos(cantidad) {
      this.credito += parseFloat(cantidad);
    },
    changeExpensesIngresosInit(cantidad) {
      this.credito = parseFloat(cantidad);
    },
    newBoxAction(boxAction) {
      this.boxActions.items = [...this.boxActions.items, { ...boxAction }];
    },

    historial() {
      this.verhistorial = !this.verhistorial;
    },
    close() {
      this.dialog = false;
    },
    save() {
      const dateFull = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")
        .split(" ");
      const fecha = dateFull[0];
      const hora_inicio = dateFull[1];

      const { idComercial } = this.$store.getters.user;

      this.$services.orders
        .createCashRegister({
          idComercial,
          fecha,
          hora_inicio,
          saldo_inicial: this.monto,
        })
        .then((response) => {
          if (response.data.ok) {
            this.idCashRegister = response.data.cashRegister.idCashRegister;
            console.log(response);
            this.estado = "Abierta";
            this.dialogCaja = false;
            this.close();

            toastMessage(
              "success",
              "Exito",
              "Se abrio el arqueo de caja correctamente"
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    closeCierre() {
      this.dialogCaja = false;
    },
    cerrarCaja() {
      const saldo_final = this.efectivo + this.credito - this.retiros;
      const dateFull = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")
        .split(" ");

      const hora_final = dateFull[1];

      const cashRegister = {
        estado: false,
        efectivo: this.efectivo,
        saldo_final,
        dinero_real: this.dinerofisico,
        faltante: saldo_final - this.dinerofisico,
        hora_final,
      };

      this.$services.orders
        .updateCashRegister(this.idCashRegister, cashRegister)
        .then((response) => {
          if (response.data.ok) {
            this.cashRegisters.items = [
              ...this.cashRegisters.items,
              response.data.cashRegister,
            ];

            this.estado = "Cerrada";
            this.efectivo = 0;
            this.dinerofisico = 0;
            this.retiros = 0;
            this.credito = 0;
            this.idCashRegister = -1;
            this.close();

            toastMessage(
              "success",
              "Exito",
              "Se cerro el arqueo de caja correctamente"
            );
          }
        })
        .catch((error) => {
          console.log(error);
          toastMessage(
            "error",
            "Error :(",
            "No se pudo cerrar el arqueo de caja"
          );
        });
    },
    getFechaHora() {
      let currentDate = new Date();
      return currentDate.toLocaleString();
    },
    getFecha() {
      let currentDate = new Date();
      let dias = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
      return (
        dias[currentDate.getDay()] +
        " " +
        currentDate.getDate() +
        "/" +
        currentDate.getMonth() +
        "/" +
        currentDate.getFullYear()
      );
    },
  },
};
</script>