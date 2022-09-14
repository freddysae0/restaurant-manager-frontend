import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    isLoggedIn: false,
    orderSelect: {
      nombreCliente: "",
      idMesa: null,
    },
    itemsMenuSelect: [],
    itemsMenuSelectEdit: [],
    itemsMenuSelectRemove: [],
    isValidEditForm: false,
  },
  mutations: {
    loginSign(state) {
      state.isLoggedIn = !state.isLoggedIn;
    },

    setIsValidFormEdit(state, value) {
      state.isValidEditForm = value;
    },

    setUser(state, userData) {
      state.user = userData;
    },

    setItemsMenuSelect(state, items) {
      state.itemsMenuSelect = items;
    },

    setItemMenuField(state, { payload: { field, value }, index }) {
      state.itemsMenuSelect[index][field] = value;
    },

    setItemsMenuSelectEdit(state, items) {
      state.itemsMenuSelectEdit = items;
    },

    setItemsMenuSelectRemove(state, items) {
      state.itemsMenuSelectRemove = items;
    },

    setOrderSelect(state, order) {
      state.orderSelect = order;
    },
  },
  actions: {
    setUserAction(context, userData) {
      context.commit("setUser", userData);
    },

    setLoginSignAction(context) {
      context.commit("loginSign");
    },

    setIsValidEditFormAction(context, value) {
      context.commit("setIsValidFormEdit", value);
    },
    itemsMenuSelectAction(context, items) {
      context.commit("setItemsMenuSelect", items);
    },
    setItemMenuFieldAction(context, payload) {
      context.commit("setItemMenuField", payload);
    },

    setItemsMenuSelectEditAction(context, items) {
      context.commit("setItemsMenuSelectEdit", items);
    },
    setItemsMenuSelectRemoveAction(context, items) {
      context.commit("setItemsMenuSelectRemove", items);
    },
    setOrderSelectAction(context, order) {
      context.commit("setOrderSelect", order);
    },
  },
  getters: {
    user(state) {
      return state.user;
    },
    isLoggedIn(state) {
      return state.isLoggedIn;
    },
    isValidEditForm(state) {
      return state.isValidEditForm;
    },

    itemsMenuSelect(state) {
      return state.itemsMenuSelect;
    },

    itemsMenuSelectEdit(state) {
      return state.itemsMenuSelectEdit;
    },

    itemsMenuSelectRemove(state) {
      return state.itemsMenuSelectRemove;
    },

    orderSelect(state) {
      return state.orderSelect;
    },
  },

  modules: {},
});
