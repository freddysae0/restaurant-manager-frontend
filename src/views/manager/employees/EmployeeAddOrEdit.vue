<template>
  <manager-layout>
    <v-card>
      <v-card-title class="justify-center">
        <router-link to="/manager/employees/"
          ><v-btn>
            <v-icon>mdi-format-list-bulleted-square</v-icon>
          </v-btn>
        </router-link>
        <span class="text-h5 pa-5">Ingresa los datos</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-form
            v-model="isFormValid"
            class="mx-auto"
            style="max-width: 600px"
          >
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  outlined
                  v-model="editedItem.nombre"
                  label="Nombres"
                  :rules="ruleOnlyAlpha"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  outlined
                  v-model="editedItem.apellido"
                  label="Apellidos"
                  :rules="ruleOnlyAlpha"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  outlined
                  v-model="editedItem.email"
                  label="Email"
                  :rules="ruleEmail"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  outlined
                  v-model="editedItem.username"
                  label="Nombre de usuario"
                  :rules="ruleRequired"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  v-if="!$route.params.id"
                  type="password"
                  outlined
                  v-model="editedItem.password"
                  label="Contraseña"
                  :rules="rulePass"
                  @change="setRule()"
                ></v-text-field>
                <v-text-field
                  v-else
                  type="password"
                  outlined
                  v-model="editedItem.password"
                  label="Contraseña"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  v-if="!$route.params.id"
                  type="password"
                  outlined
                  v-model="editedItem.passwordVerify"
                  label="Verificar Contraseña"
                  :rules="ruleVePass"
                ></v-text-field>
                <v-text-field
                  v-else
                  type="password"
                  outlined
                  v-model="editedItem.passwordVerify"
                  label="Verificar Contraseña"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="5" md="5">
                <v-select
                  :items="SelectRol.items"
                  label="Rol"
                  outlined
                  item-text="nombreRol"
                  item-value="idRol"
                  v-model.number="editedItem.idRol"
                  :rules="ruleRequired"
                  single-line
                ></v-select>
              </v-col>

              <v-col cols="12" sm="5" md="5">
                <v-text-field
                  outlined
                  v-model="editedItem.telefono"
                  label="Numero de Telefono"
                  v-mask="'####-####'"
                  :rules="rulePhoneS"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="2" md="2">
                <v-text-field
                  outlined
                  v-model.number="editedItem.edad"
                  label="Edad"
                  :rules="ruleAge"
                  v-mask="'##'"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  rows="2"
                  outlined
                  v-model="editedItem.direccion"
                  label="Dirección"
                  :rules="ruleRequired"
                ></v-textarea>
              </v-col>

              <v-col cols="12" sm="12" md="12">
                <v-btn
                  x-large
                  block
                  depressed
                  :disabled="
                    !isFormValid ||
                      editedItem.password !== editedItem.passwordVerify
                  "
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
  components: { ManagerLayout },
  name: "EmployeeAddOrEdit",
  mounted() {
    const { id } = this.$route.params;

    if (id) {
      this.$services.shareds
        .getEmployee(id)
        .then((response) => {
          this.editedItem = response.data.employee;
          this.editedItem.password = "";
          this.editedItem.passwordVerify = "";
        })
        .catch((error) => {
          console.log(error);
        });
    }

    this.$services.manager
      .getRoles()
      .then((response) => {
        this.SelectRol = response.data.collection;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  data: () => ({
    isFormValid: false,
    editedItem: {
      nombre: "",
      apellido: "",
      idRol: "",
      username: "",
      password: "",
      passwordVerify: "",
      edad: "",
      telefono: "",
      direccion: "",
      email: "",
    },

    SelectRol: {
      items: [],
      hasItems: false,
    },

    ruleRequired: Rules.required,
    ruleAge: Rules.integer,
    ruleOnlyAlpha: Rules.alpha,
    rulePass: Rules.password,
    ruleEmail: Rules.email,
    rulePhoneS: Rules.phonesize,
    ruleVePass: [],
  }),
  methods: {
    //regla para verificar la contraseña
    setRule() {
      this.ruleVePass = Rules.verificarpass(this.editedItem.password);
      // console.log(this.editedItem.password);
    },

    save() {
      if (!this.$route.params.id) {
        const { passwordVerify, ...props } = this.editedItem;

        const employee = { ...props };

        employee.idComercial = this.$store.getters.user.idComercial;

        this.$services.manager
          .createEmployee(employee)
          .then((response) => {
            if (response.data.ok) {
              toastMessage(
                "success",
                "Exito",
                "Se creo el empleado correctamente"
              );

              this.$router.push("/manager/employees");
            }
          })
          .catch((error) => {
            console.log(error);
            toastMessage("error", "Error :(", "No se pudo crear el empleado");
          });
      } else {
        const { passwordVerify, role, ...props } = this.editedItem;

        const employee = { ...props };

        employee.idComercial = this.$store.getters.user.idComercial;

        if (employee.password.trim() === "") {
          delete employee.password;
        }

        this.$services.manager
          .updateEmployee(this.$route.params.id, employee)
          .then((response) => {
            if (response.data.ok) {
              toastMessage(
                "success",
                "Exito",
                "Se actualizo el empleado correctamente"
              );

              this.$router.push("/manager/employees");
            }
          })
          .catch((error) => {
            console.log(error);
            toastMessage(
              "error",
              "Error :(",
              "No se pudo actualizar el empleado"
            );
          });
      }
    },
  },
};
</script>
