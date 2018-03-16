const CART_KEY = 'TEEPUBLIC_CART_ITEMS';
export default class CartHelper {
  addToCart(design, sku, quantity = 1) {
    const addedCartItem = {
      design: design,
      sku: sku,
      quantity: quantity
    };

    var itemAlreadyExists = false;
    const cartItems = this.getCartItems();
    cartItems.forEach(
      function(cartItem) {
        if (this._areSameItems(cartItem, addedCartItem)) {
          cartItem.quantity += addedCartItem.quantity;
          itemAlreadyExists = true;
        }
      }.bind(this)
    );

    if (!itemAlreadyExists) {
      cartItems.push(addedCartItem);
    }

    this.setCartItems(cartItems);
  }

  updateCartItem(updatedCartItem) {
    const cartItems = this.getCartItems();
    cartItems.forEach(
      function(cartItem) {
        if (this._areSameItems(cartItem, updatedCartItem)) {
          cartItem.design = updatedCartItem.design;
          cartItem.sku = updatedCartItem.sku;
          cartItem.quantity = parseInt(updatedCartItem.quantity, 10);
        }
      }.bind(this)
    );
    this.setCartItems(cartItems);
  }

  deleteCartItem(deletedCartItem) {
    const cartItems = this.getCartItems();
    cartItems.forEach(
      function(cartItem, index, object) {
        if (this._areSameItems(cartItem, deletedCartItem)) {
          object.splice(index, 1);
        }
      }.bind(this)
    );
    this.setCartItems(cartItems);
  }

  getCartItems() {
    const cartItems = localStorage.getItem(CART_KEY);
    if (cartItems) {
      return JSON.parse(cartItems);
    } else {
      return [];
    }
  }

  setCartItems(cartItems) {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }

  _areSameItems = (item1, item2) => {
    return item1.design.id === item2.design.id && item1.sku.id === item2.sku.id;
  };
}
