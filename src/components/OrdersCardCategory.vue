<template>
  <v-col class="col-12 ml-0 mr-0 pl-0 pr-0">
    <v-row style="margin-bottom: -40px" class="col-12 ml-0 mr-0 pl-0 pr-0">
      <v-col class="col-12 pl-0 pr-0 d-inline-flex textBuscar">
        <v-text-field
          label="Buscar"
          outlined
          clearable
          v-model="txt_buscar"
          class="rounded-r-0 rounded-l-lg mr-1"
          color="teal darken-2"
        ></v-text-field>
        <v-btn
          color="teal darken-2"
          depressed
          min-height="65%"
          class="rounded-l-0 rounded-r-lg btnBuscar"
          @click="filterMenuByName()"
        >
          <v-icon size="30" color="white">mdi-magnify</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="col-12 ml-0 mr-0 pl-0 pr-0">
      <v-card class="col-12" color="rgb(247, 247, 247)">
        <v-card-title class="text-h6 font-weight-regular justify-space-between">
          <v-btn
            :disabled="step === 1"
            text
            @click="seleccionarCategoria(null)"
          >
            Back
          </v-btn>
          <span>{{ cat }}</span>
        </v-card-title>
        <v-window v-model="step">
          <v-window-item :value="1">
            <v-row class="ml-1 mr-1 pt-5">
              <v-col cols="12">
                <masonry
                  :cols="{ default: 3, 1266: 3, 850: 2, 600: 3, 425: 2 }"
                  :gutter="{ default: '10px', 700: '10px' }"
                >
                  <div
                    v-for="(category, index) in categories.items"
                    :key="category.idCategoria"
                    class="mb-4 mt-1 zoomInUp"
                    id="items"
                  >
                    <v-btn
                      min-height="120"
                      min-width="100%"
                      max-width="100%"
                      class="caption mx-auto"
                      :color="colors[index]"
                      id="boton_categoria"
                      :disabled="step === 2"
                      depressed
                      @click="() => seleccionarCategoria(category)"
                    >
                      <span class="boton_a">{{
                        category.nombreCategoria
                      }}</span>
                    </v-btn>
                  </div>
                </masonry>
              </v-col>
            </v-row>
          </v-window-item>
          <v-window-item :value="2">
            <v-row class="ml-n4">
              <v-col class="col-12 mx-auto">
                <v-list subheader two-line flat color="rgb(247, 247, 247)">
                  <v-list-item-group v-model="ItemSelectsMenu" multiple>
                    <template v-for="item in items_menu">
                      <v-list-item
                        :key="item.id_menu_item"
                        :value="item"
                        class="mb-1 mr-n3"
                      >
                        <template>
                          <v-list-item-action>
                            <v-checkbox
                              color="primary"
                              :input-value="
                                ItemSelectsMenu.some(
                                  (itemSelect) =>
                                    itemSelect.id_menu_item ===
                                    item.id_menu_item
                                )
                              "
                            ></v-checkbox>
                          </v-list-item-action>
                          <v-list-item-title class=" ml-n5 text-wrap">
                            {{ item.nombre_item }}
                            <v-list-item-subtitle class=" text-wrap">
                              {{ item.detalles_item }}
                            </v-list-item-subtitle>
                          </v-list-item-title>
                          <v-list-item-action-text>
                            <span
                              class=" green--text text-body-2 font-weight-bold text-no-wrap"
                            >
                              $ {{ item.precio }}
                            </span>
                          </v-list-item-action-text>
                        </template>
                      </v-list-item>
                    </template>
                  </v-list-item-group>
                </v-list>
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
        <v-card-actions> </v-card-actions>
      </v-card>
    </v-row>
  </v-col>
</template>

<script>
import EventBus from "../event-bus";
import { colors } from "../colors/colors";
import axios from "axios";
export default {
  name: "OrdersCardCategory",
  watch: {
    txt_buscar: function() {
      this.filterMenuByName();
    },
  },
  mounted() {
    this.$services.shareds
      .getCategories()
      .then((response) => {
        if (response.data.ok) {
          this.categories = response.data.collection;
        } else {
          console.log("El servidor revento");
        }
      })
      .catch((error) => {
        console.log(error);
      });

    this.$services.orders
      .getMenuItemsAvailable()
      .then((response) => {
        if (response.data.ok) {
          this.menuItems = response.data.collection;
        } else {
          console.log("El servidor revento");
        }
      })
      .catch((error) => {
        console.log(error);
      });

    this.$services.socketioService.getChangeMenuItems(
      (menuItemsChangedState) => {
        menuItemsChangedState.forEach((menuItemChangedState) => {
          if (menuItemChangedState.disponibilidad) {
            this.menuItems.items = [
              ...this.menuItems.items,
              menuItemChangedState,
            ];
          } else {
            this.menuItems.items = this.menuItems.items.filter(
              (menuItem) =>
                menuItem.id_menu_item !== menuItemChangedState.id_menu_item
            );
          }
        });
        this.step = 1;
      }
    );

    EventBus.$on("clean", (data) => {
      this.itemMenuSelects = data;
    });
    EventBus.$on("clean2", (data) => {
      this.step = data;
    });
  },
  data() {
    return {
      menu: [],
      id_menu_item: null,
      categories: {
        hasItems: false,
        items: [],
        total: 0,
      },
      menuItems: {
        hasItems: false,
        items: [],
        total: 0,
      },
      txt_buscar: "",

      step: 1,
      message4: "Buscar",
      message_comentarios: "Comentarios",
      total_sample: "0.00",
      c1: "rgb(52, 166, 186)",
      icon1: "mdi-arrow-right-box",
      cat: "Menu",

      items_menu: [],
      items_menu_for_filter: this.menuItems,
      // itemMenuSelects: [],

      colors,
    };
  },
  created() {
    this.loadMenu();
  },
  computed: {
    ItemSelectsMenu: {
      set(values) {
        const lastIdItem = values[values.length - 1].id_menu_item;

        if (
          this.$store.getters.itemsMenuSelect.some(
            (item) => item.id_menu_item === lastIdItem
          )
        ) {
          values = values.filter((item) => item.id_menu_item !== lastIdItem);

          this.$store.dispatch("itemsMenuSelectAction", [...values]);

          return;
        }

        values = values.map(({ cantidad, comentario, ...itemMenu }) => ({
          ...itemMenu,
          cantidad: cantidad ? cantidad : 1,
          comentario: comentario ? comentario : "",
        }));

        this.$store.dispatch("itemsMenuSelectAction", [...values]);
      },
      get() {
        return this.$store.getters.itemsMenuSelect;
      },
    },
  },

  methods: {
    loadMenu() {
      const options = {
        method: "GET",
        url: "http://127.0.0.1:4000/api/menu-items/",
      };

      axios
        .request(options)
        .then((response) => {
          this.menu = response.data.collection.items;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    clearSelect() {
      this.itemMenuSelects = [];
      this.step = 1;

      EventBus.$emit("clearSelect");
    },

    seleccionarCategoria(category) {
      // var nombre_categoria;

      // this.categories.items.forEach((nombre) => {
      //   if ((nombre = categoria_clickeada)) {
      //     nombre_categoria = categoria_clickeada;
      //   }
      // });

      if (category) {
        this.items_menu = this.menuItems.items.filter(
          (menu_item) => menu_item.idCategoria === category.idCategoria
        );

        this.cat = category.nombreCategoria;
        this.step++;
      } else if (!category) {
        this.txt_buscar = "";
        this.step = 1;
        this.cat = "Menu";
      } else {
        this.cat = "Categorías";
        this.step--;
      }
    },
    filterMenuByName() {
      if (
        this.txt_buscar === "" ||
        this.txt_buscar === null ||
        this.txt_buscar.value === 0 ||
        this.txt_buscar.value === ""
      ) {
        this.step--;
        return;
      } else {
        const search = this.txt_buscar.toLowerCase().trim();
        this.items_menu = this.menuItems.items.filter(
          (f) => f.nombre_item.toLowerCase().indexOf(search) > -1
        );
        this.step = 2;
        return this.items_menu;
      }
    },
  },
};
</script>

<style lang="css" scoped>
@media only screen and (max-width: 600px) {
  .btnBuscar {
    margin-right: 25px;
  }
  .textBuscar {
    margin-left: 12px;
  }
}

#boton_categoria .boton_a {
  font-size: 2ch;
  white-space: normal;
  word-wrap: break-word;
  width: 60%;
  min-width: 100px;
  align-content: center;
  color: white;
  padding: 10px;
}
</style>
