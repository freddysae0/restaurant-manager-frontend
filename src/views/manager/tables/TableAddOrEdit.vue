<template>
  <manager-layout>
    <v-card>
      <v-card-title class="justify-center">
        <router-link to="/manager/tables/"
          ><v-btn>
            <v-icon>mdi-format-list-bulleted-square</v-icon>
          </v-btn>
        </router-link>
        <span class="text-h5 pa-5">Ingresa los datos</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-form v-model="isFormValid" style="max-width: 400px">
            <v-row>
              <v-col cols="12" sm="8" md="8">
                <v-text-field
                  outlined
                  v-model.number="editedItem.numero"
                  label="Numero de Mesa"
                  :rules="ruleInteger"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-text-field
                  outlined
                  v-model.number="editedItem.capacidad"
                  label="Capacidad"
                  :rules="ruleInteger"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-select
                  :items="SelectDispMesa"
                  item-text="title"
                  item-value="value"
                  label="Disponibilidad"
                  outlined
                  v-model="editedItem.disponible"
                  :rules="ruleRequired"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-btn
                  x-large
                  block
                  depressed
                  :disabled="!isFormValid"
                  color="primary"
                  @click="save"
                >
                  Guardar
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
    </v-card>
  </manager-layout>
</template>

<script>
import ManagerLayout from "../../../layout/ManagerLayout.vue";

import { Rules } from "../../../helpers/rules.js";

import { toastMessage } from "../../../helpers/messages";

export default {
  name: "TableAddOrEdit",
  components: {
    ManagerLayout,
  },
  data: () => ({
    isFormValid: false,

    editedItem: {
      numero: "",
      capacidad: "",
      disponible: "",
    },

    SelectDispMesa: [
      { title: "Disponible", value: 1 },
      { title: "No disponible", value: 2 },
    ],

    ruleRequired: Rules.required,
    ruleInteger: Rules.integer,
  }),
  mounted() {
    const { id } = this.$route.params;

    if (id) {
      this.$services.manager.getTable(id).then((response) => {
        if (response.data.ok) {
          const { disponible, ...props } = response.data.table;

          this.editedItem = {
            ...props,
            disponible: disponible ? 1 : 2,
          };
        }
      });
    }
  },
  methods: {
    save() {
      const { id } = this.$route.params;

      const table = {
        ...this.editedItem,
        disponible: this.editedItem.disponible === 1,
        idComercial: this.$store.getters.user.idComercial,
      };

      if (!id) {
        this.$services.manager
          .createTable(table)
          .then((response) => {
            if (response.data.ok) {
              toastMessage("success", "Exito", "Se creo la mesa correctamente");
              this.$router.push("/manager/tables");
            }
          })
          .catch((error) => {
            console.log(error);
            toastMessage("error", "Error :(", "No se pudo actualizar la mesa");
          });
      } else {
        this.$services.manager
          .updateTable(id, table)
          .then((response) => {
            if (response.data.ok) {
              toastMessage(
                "success",
                "Exito",
                "Se actualizo la mesa correctamente"
              );
              this.$router.push("/manager/tables");
            }
          })
          .catch((error) => {
            toastMessage("error", "Error :(", "No se pudo actualizo la mesa");
            console.log(error);
          });
      }
    },
  },
};
</script>
