<template>
  <v-container>
    <v-row no-gutters justify="center" align="center">
      <v-col cols="12" class="elevation-3">
        <v-data-table
          :headers="headers"
          :items="thisCashRegisters.items"
          sort-by="fecha"
          :sort-desc="true"
        >
          <template v-slot:item.faltante="{ item }">
            <v-chip :color="getColor(item.faltante)" dark>
              {{ item.faltante }}
            </v-chip>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "OrdersCashHistory",
  props: {
    cashRegisters: {
      type: Object,
      required: true,
    },
  },

  mounted() {
    this.thisCashRegisters = this.cashRegisters;
    this.cashRegisters.items.forEach((item) => {
      if (item.faltante >= 0) {
        this.colors[item.idCashRegister] = "red";
      } else {
        this.colors[item.idCashRegister] = "green";
      }
    });

    for (let i = 0; i < this.thisCashRegisters.items.length; i++) {}

    for (let i = 0; i < this.thisCashRegisters.items.length; i++) {
      this.thisCashRegisters.items[i].faltante *= -1;

      this.thisCashRegisters.items[i].faltante = this.thisCashRegisters.items[
        i
      ].faltante.toFixed(2);

      this.thisCashRegisters.items[
        i
      ].saldo_final = this.thisCashRegisters.items[i].saldo_final.toFixed(2);
    }

    console.log(this.colors);
  },
  data: () => ({
    key: null,
    colors: [],
    thisCashRegisters: {},
    headers: [
      {
        text: "Fecha",
        align: "start",
        value: "fecha",
      },
      { text: "Efectivo", value: "efectivo" },
      // { text: "Crédito", value: "credito" },
      { text: "Ingresos", value: "ingresos" },
      { text: "Gastos", value: "gastos" },
      { text: "Total", value: "saldo_final" },
      { text: "Faltante", value: "faltante", class: "faltanteColors" },
    ],
  }),
  methods: {
    getColor(item) {
      if (item < 0) return "red";
      if (item > 0) return "green";
    },
  },
};
</script>
