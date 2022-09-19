<template>
  <manager-layout>
    <v-card>
      <v-card-title>
        <router-link to="/manager/menu-items/"
          ><v-btn>
            <v-icon>mdi-format-list-bulleted-square</v-icon>
          </v-btn>
        </router-link>
        <span class="text-h5">Ingresar los datos</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-form v-model="isFormValid" style="max-width: 650px">
            <v-row>
              <v-col cols="12" sm="7" md="7">
                <v-text-field
                  outlined
                  v-model="editedItem.nombre_item"
                  label="Nombre del Item"
                  :rules="ruleRequired"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="5" md="5">
                <v-select
                  :items="SelectCategorias.items"
                  label="Categorias"
                  outlined
                  item-text="nombreCategoria"
                  item-value="idCategoria"
                  v-model.number="editedItem.idCategoria"
                  :rules="ruleRequired"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  outlined
                  v-model="editedItem.precio"
                  label="Precio del Item"
                  :rules="ruleDecimal"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="6">
                <v-select
                  :items="SelectDisp"
                  label="Disponibilidad"
                  item-text="title"
                  item-value="value"
                  outlined
                  v-model="editedItem.disponibilidad"
                  :rules="ruleRequired"
                ></v-select>
              </v-col>

              <v-col cols="12" sm="12" md="12">
                <v-textarea
                  outlined
                  v-model="editedItem.detalles_item"
                  label="Detalles del item"
                  :rules="ruleRequired"
                  rows="3"
                ></v-textarea>
              </v-col>

              <v-col cols="12">
                <v-subheader class="pl-0">
                  Seleccione el Porcentaje de Descuento:
                  {{ editedItem.descuento }} %
                </v-subheader>
                <v-slider v-model="editedItem.descuento" thumb-label></v-slider>
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
import { Rules } from "../../../helpers/rules";
import ManagerLayout from "../../../layout/ManagerLayout.vue";
import { toastMessage } from "../../../helpers/messages";

export default {
  name: "MenuItemAddOrEdit",
  components: { ManagerLayout },
  mounted() {
    this.$services.shareds
      .getCategories()
      .then((response) => {
        this.SelectCategorias = response.data.collection;
      })
      .catch((error) => {
        error;
      });

    const { id } = this.$route.params;

    if (id) {
      this.$services.manager.getMenuItem(id).then((response) => {
        if (response.data.ok) {
          const {
            descuento,
            disponibilidad,
            ...props
          } = response.data.menuItem;

          this.editedItem = {
            ...props,
            descuento: descuento * 100,
            disponibilidad: disponibilidad ? 1 : 2,
          };
          descuento;
        }
      });
    }
  },
  data: () => ({
    isFormValid: false,
    SelectCategorias: {
      items: [],
      hasItems: false,
    },
    SelectDisp: [
      {
        title: "Disponible",
        value: 1,
      },
      {
        title: "No disponible",
        value: 2,
      },
    ],

    editedItem: {
      nombre_item: "",
      idCategoria: null,
      precio: null,
      detalles_item: "",
      disponibilidad: null,
      descuento: 0.0,
    },
    ruleRequired: Rules.required,
    ruleDecimal: Rules.decimal,
  }),
  methods: {
    save() {
      const menuItem = {
        ...this.editedItem,
        disponibilidad: this.editedItem.disponibilidad === 1,
        descuento: this.editedItem.descuento / 100,
        idComercial: this.$store.getters.user.idComercial,
      };

      const { id } = this.$route.params;

      if (id) {
        this.$services.manager
          .updateMenuItem(id, menuItem)
          .then((response) => {
            if (response.data.ok) {
              toastMessage(
                "success",
                "Exito",
                "Se actualizo el item del menu correctamente"
              );

              this.$router.push("/manager/menu-items");
            }
          })
          .catch((error) => {
            console.log(error);
            toastMessage(
              "error",
              "Error :(",
              "No se pudo actualizar el item correctamente"
            );
          });

        return;
      }

      this.$services.manager
        .createMenuItem(menuItem)
        .then((response) => {
          if (response.data.ok) {
            toastMessage(
              "success",
              "Exito",
              "Se creo el item del menu correctamente"
            );

            this.$router.push("/manager/menu-items");
          }
        })
        .catch((error) => {
          console.log(error);
          toastMessage(
            "error",
            "Error :(",
            "No se pudo crear el item del menu"
          );
        });
    },
  },
};
</script>
