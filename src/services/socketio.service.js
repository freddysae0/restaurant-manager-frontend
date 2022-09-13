import { io } from "socket.io-client";

class SocketioService {
  socket;
  constructor(url) {
    this.url = url;
    this.setupSocketConnection();
  }

  setupSocketConnection() {
    this.socket = io(this.url, {
      extraHeaders: {
        idComercial: 1,
      },
    });
  }

  sendOrderKitchroom(order) {
    this.socket.emit("/sockets/orders/sendOrderKitchroom", order);
  }

  doneOrder(order) {
    this.socket.emit("/sockets/orders/doneOrder", order);
  }
  deliveryOrder(order) {
    this.socket.emit("/sockets/orders/deliveryOrder", order);
  }

  paidoutOrder(order) {
    this.socket.emit("/sockets/orders/paidoutOrder", order);
  }

  getSendOrder(callback) {
    this.socket.on("/sockets/orders/sendNewOrder", (payload) => {
      callback(payload);
    });
  }

  getDoneOrder(callback) {
    this.socket.on("/sockets/orders/sendDoneOrder", (payload) => {
      callback(payload);
    });
  }

  getDeliveryOrder(callback) {
    this.socket.on("/sockets/orders/sendDeliveryOrder", (payload) => {
      callback(payload);
    });
  }

  getPaidoutOrder(callback) {
    this.socket.on("/sockets/orders/sendPaidoutOrder", (payload) => {
      callback(payload);
    });
  }

  getChangeMenuItems(callback) {
    this.socket.on("/sockets/menu-items/changeState", (payload) => {
      callback(payload);
    });
  }

  changeDoneOrderDetail(id) {
    this.socket.emit("/sockets/order-details/changeDoneOrderDetail", id);
  }

  changeStateMenuItems(menuItems = []) {
    console.log("esta funcion se ejecuta");
    this.socket.emit("/sockets/menu-items/update", menuItems);
  }
}

export default SocketioService;
