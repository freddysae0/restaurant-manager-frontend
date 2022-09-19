<template>
  <v-card class="pb-2 ma-3" elevation="10">
    <v-card-title class="justify-center pt-8">
      Mesas del Restaurante
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        outlined
        clearable
        color="orange"
        label="Buscar"
        single-line
        hide-details
        class="mr-2"
      ></v-text-field>
      <router-link to="/manager/tables/create">
        <v-btn>
          <v-icon color="blue"> mdi-plus-box</v-icon>
        </v-btn>
      </router-link>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="tables.items"
      :search="search"
      :height="500"
      class="justify-center ma-3 elevation-1"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          class="mr-4"
          color="indigo accent-3"
          @click="editItem(item.idMesa)"
        >
          mdi-pencil
        </v-icon>
        <v-icon @click="deleteItem(item.idMesa)" color="deep-orange accent-3">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { deleteMessage } from "../helpers/messages";

export default {
  name: "ManagerTableMesas",
  mounted() {
    this.$services.manager
      .getTables()
      .then((response) => {
        if (response.data.ok) {
          this.tables = response.data.collection;

          this.tables.items = this.tables.items.map(
            ({ disponible, ...item }) => ({
              ...item,
              disponible: disponible ? "Disponible" : "No disponible",
            })
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  data: () => ({
    search: "",
    headers: [
      {
        text: "Numero de Mesa",
        align: "start",
        sortable: true,
        value: "numero",
      },
      { text: "Capacidad (Personas)", value: "capacidad" },
      { text: "Disponibilidad", value: "disponible" },
      { text: "Acciones", value: "actions", sortable: false, width: "100px" },
    ],
    tables: {
      items: [],
      hasItems: false,
    },
    editedIndex: -1,
  }),
  methods: {
    editItem(id) {
      this.$router.push(`/manager/tables/${id}/edit`);
    },
    deleteItem(id) {
      deleteMessage(() => {
        this.$services.manager
          .deleteTable(id)
          .then((response) => {
            if (response.data.ok) {
              this.tables.items = this.tables.items.filter(
                (item) => item.idMesa !== id
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
