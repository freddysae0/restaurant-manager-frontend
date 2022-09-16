<template>
  <v-container>
    <v-row no-gutters justify="center" align="center">
      <v-col cols="12" class="elevation-3">
        <v-data-table
          :headers="headers"
          :items="boxActions.items"
          sort-by="fecha"
          :sort-desc="true"
        >
          <template v-slot:top>
            <!-- REGISTRAR ACCION -->
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2 ml-2 mt-2"
                  v-bind="attrs"
                  v-on="on"
                  @click="reset()"
                >
                  Registrar Accion
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">Registrar Nueva Accion</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-form v-model="accionEnable">
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.descripcion"
                            label="Descripcion"
                            :rules="ruleRequired"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-select
                            :items="tipos"
                            label="Tipo"
                            item-text="title"
                            item-value="value"
                            v-model="editedItem.isInput"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model.number="editedItem.monto"
                            label="Monto"
                            prepend-inner-icon="mdi-currency-usd"
                            single-line
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
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script >
import { Rules } from "../helpers/rules.js";
import { toastMessage } from "../helpers/messages";
import { emit } from "process";

export default {
  name: "OrdersTableCashActions",
  props: {
    idCashRegister: {
      type: Number,
      required: true,
    },
    boxActions: {
      type: Object,
      required: true,
    },
  },
  mounted(){
    console.log(this.boxActions.items);
    this.calcIngresosYGastos(this.boxActions.items)
  },

  data: () => ({
    accionEnable: false,

    dialog: false,
    headers: [
      {
        text: "Descripcion",
        align: "start",
        sortable: false,
        value: "descripcion",
      },
      { text: "Monto ($ USD)", value: "monto" },
      { text: "Tipo", value: "tipo" },
      { text: "Fecha", value: "fecha" },
    ],
    editedItem: {
      descripcion: "",
      monto: "",
      isInput: null,
    },
    defaultItem: {
      descripcion: "",
      monto: "",
      isInput: null,
    },

    rulesCash: Rules.decimal2,
    ruleRequired: Rules.required,
    tipos: [
      {
        title: "Ingresos",
        value: true,
      },
      {
        title: "Gastos",
        value: false,
      },
    ],
  }),
  watch: {
   
    dialog(val) {
      val || this.close();
    },
  },
  methods: {
    reset() {
      this.editedItem = this.defaultItem;
    },

    
      calcIngresosYGastos(val){
      let ingreso = 0;
      let gasto = 0;
      for (let i = 0; i < val.length; i++) {
          if(val[i].tipo == 'Ingreso'){
            ingreso += val[i].monto; 
          }
          if(val[i].tipo == 'Gasto'){
            gasto += val[i].monto; 
          }
      }
      this.$emit('IngesosValorEmit', ingreso);
      this.$emit('GastosValorEmit', ingreso);
    
    },
    close() {
      this.dialog = false;
    },
    save() {
      const dateFull = new Date().toISOString().slice(0, 19).replace("T", " ");

      const boxAction = {
        ...this.editedItem,
        fecha: dateFull,
        idCashRegister: this.idCashRegister,
      };

      this.$services.orders
        .createBoxAction(boxAction)
        .then((response) => {
          if (response.data.ok) {
            const { fecha, monto, isInput, ...props } = response.data.boxAction;

            this.$emit("newBoxActionEmit", {
              ...props,
              monto,
                tipo: isInput ? "Ingreso" : "Gasto",
              fecha: fecha.slice(0, 19).replace("T", " "),
            });

            console.log(isInput)
            if (!isInput) {
              this.$emit("changeExpensesEmit", monto);
            }
            else{
              this.$emit("changeExpensesEmitIngresos", monto);

            }

            toastMessage(
              "success",
              "Exito",
              "Se realizo la accion correctamente"
            );
          }
        })
        .catch((error) => {
          console.log(error);
          toastMessage("error", "Error :(", "No se pudo realizar la accion");
        });

      this.close();
    },
  },
};
</script>