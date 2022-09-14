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
            Volver
          </v-btn>
          <span>Menú</span>
        </v-card-title>
        <v-window v-model="step">
          <v-window-item :value="1">
            <v-row class="ml-0 ">
              <v-col cols="12">
                <masonry
                  :cols="{ default: 4, 1266: 3, 700: 2, 600: 2 }"
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
                      @click="() => seleccionarCategoria(category.idCategoria)"
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
            <v-row class="ml-2">
              <v-col class="col-12 mx-auto">
                <v-list subheader two-line flat color="rgb(247, 247, 247)">
                  <v-list-item-group v-model="ItemSelectsMenu" multiple>
                    <div v-for="item in items_menu" :key="item.id_menu_item">
                      <v-list-item
                        :value="item"
                        @click="item.disponibilidad = !item.disponibilidad"
                      >
                        <!-- <template v-slot:default="state" @click="active=item.disponibilidad"> -->
                        <v-list-item-title>
                          {{ item.nombre_item }}
                          <!-- {{ state }} -->
                          <!-- {{ item.disponibilidad }} -->
                          <v-list-item-subtitle>
                            {{ item.detalles_item }}
                          </v-list-item-subtitle>
                        </v-list-item-title>

                        <v-list-item-action>
                          <v-checkbox
                            color="primary"
                            :input-value="item.disponibilidad"
                          ></v-checkbox>
                        </v-list-item-action>
                        <!-- </template> -->
                      </v-list-item>
                    </div>
                  </v-list-item-group>
                </v-list>
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
        <v-card-actions> </v-card-actions>
      </v-card>
    </v-row>

    <v-col cols="12" xs="10" md="12" class="mt-5 mx-auto">
      <v-btn
        x-large
        block
        depressed
        color="primary"
        @click="changeItemList"
        :disabled="ItemSelectsMenu.length === 0"
      >
        <v-icon>mdi-content-save</v-icon> Guardar Cambios</v-btn
      >
    </v-col>
  </v-col>
</template>

<script>
import { colors } from "../colors/colors";
import axios from "axios";
export default {
  name: "KitchenItemsState",

  components: {},
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

    this.$services.shareds
      .getMenuItems()
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
  },
  data() {
    return {
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
      cat: "Categorias",

      items_menu: [],
      items_menu_for_filter: this.menuItems,
      itemMenuSelects: [],

      colors,
    };
  },
  computed: {
    ItemSelectsMenu: {
      set(value) {
        this.itemMenuSelects = value;
      },
      get() {
        return this.itemMenuSelects;
      },
    },
  },
  methods: {
    changeItemList() {
      this.itemMenuSelects = this.itemMenuSelects.map(
        (itemMenuSelect) => itemMenuSelect.id_menu_item
      );
      console.log(this.itemMenuSelects);
      this.$services.socketioService.changeStateMenuItems(this.itemMenuSelects);

      const options = {
        method: "PUT",
        url: "http://127.0.0.1:4000/api/menu-items/changeMenu",
        headers: { "Content-Type": "application/json" },
        data: { items: this.itemMenuSelects },
      };
      axios
        .request(options)
        .then(function(response) {
          console.log(response.data);
        })
        .catch(function(error) {
          console.error(error);
        });
      this.clearSelect();
    },

    clearSelect() {
      this.itemMenuSelects = [];
      this.step = 1;
    },

    seleccionarCategoria(idCategory) {
      // var nombre_categoria;

      // this.categories.items.forEach((nombre) => {
      //   if ((nombre = categoria_clickeada)) {
      //     nombre_categoria = categoria_clickeada;
      //   }
      // });

      if (idCategory) {
        this.items_menu = this.menuItems.items.filter(
          (menu_item) => menu_item.idCategoria === idCategory
        );

        this.cat = idCategory;
        this.step++;
      } else if (idCategory === null) {
        this.txt_buscar = "";
        this.step = 1;
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
