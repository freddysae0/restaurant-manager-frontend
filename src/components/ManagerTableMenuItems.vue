<template>
  <v-card class="pb-2 ma-3" elevation="10">
    <v-card-title class="justify-center pt-8">
      Items del Menu
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Buscar"
        outlined
        clearable
        color="brown"
        single-line
        hide-details
        class="mr-2"
      ></v-text-field>
      <router-link to="/manager/menu-items/create">
        <v-btn>
          <v-icon color="blue"> mdi-plus-box</v-icon>
        </v-btn>
      </router-link>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="menuItems.items"
      :search="search"
      :height="500"
      class="justify-center ma-3 elevation-1"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          class="mr-4"
          color="indigo accent-3"
          @click="editItem(item.id_menu_item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          @click="deleteItem(item.id_menu_item)"
          color="deep-orange accent-3"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { deleteMessage } from "../helpers/messages";
export default {
  name: "ManagerTableMenuItems",
  data: () => ({
    slider: 0,
    search: "",
    headers: [
      {
        text: "Nombre",
        align: "start",
        sortable: true,
        value: "nombre_item",
      },
      { text: "Categoria", value: "nombreCategoria" },
      { text: "Precio", value: "precio", width: "90px" },
      { text: "Detalles", value: "detalles_item" },
      { text: "Disponibilidad", value: "disponibilidad" },
      { text: "Descuento (%)", value: "descuento" },

      { text: "Acciones", value: "actions", sortable: false, width: "100px" },
    ],
    menuItems: {
      items: [],
      hasItems: false,
    },
  }),
  mounted() {
    this.$services.shareds
      .getMenuItems()
      .then((response) => {
        this.menuItems = response.data.collection;
        this.menuItems.items = this.menuItems.items.map(
          ({ disponibilidad, category, descuento, ...props }) => ({
            ...props,
            disponibilidad: disponibilidad ? "Disponible" : "No Disponible",
            nombreCategoria: category.nombreCategoria,
            descuento: descuento * 100,
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Item" : "Editar Item";
    },
  },
  methods: {
    editItem(id) {
      this.$router.push(`/manager/menu-items/${id}/edit`);
    },
    deleteItem(id) {
      deleteMessage(() => {
        this.$services.manager
          .deleteMenuItem(id)
          .then((response) => {
            if (response.data.ok) {
              this.menuItems.items = this.menuItems.items.filter(
                (item) => item.id_menu_item !== id
              );
            }
          })
          .catch((error) => {
            console.log(error);
          });
      });
    },
  },
};
</script>

<style scoped></style>
