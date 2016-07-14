'use strict';
var storeApp = angular.module('ShoppingCart', []).
//---------------- $routeProvider bind the connection between view (html) and controller(.js) -----//
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/store', {
        templateUrl: 'partials/store.htm',
        controller: storeController
      }).
      when('/products/:productSku', {
        templateUrl: 'partials/product.htm',
        controller: storeController
      }).
      when('/cart', {
        templateUrl: 'partials/shoppingCart.htm',
        controller: storeController
      }).
      otherwise({
        redirectTo: '/store'
      });
}])
//---------- contails all operational function of cart ---------------------------------------- //
.service('Cart', ['$rootScope', function ($rootScope) {
    
    //--------------- Initialize shopping cart ----------------------//
      this.getCart = function(cartName){
            this.cartName = cartName;
            this.clearCart = false;
            this.checkoutParameters = {};
            this.items = [];
            // load items from local storage when initializing
            this.loadItems();
            // save items to local storage when unloading
            var self = this;
            $(window).unload(function () {
                if (self.clearCart) {
                    self.clearItems();
                }
                self.saveItems();
                self.clearCart = false;
            });
              return this;
        };
    
    //------ load data from localStorage of Browser --------------------------------------------//
        this.loadItems = function(){
            var items = localStorage != null ? localStorage[this.cartName + "_items"] : null;
            if (items != null && JSON != null) {
                try {
                    var items = JSON.parse(items);
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        if (item.sku != null && item.name != null && item.price != null && item.quantity != null) {
                            item = new cartItem(item.sku, item.name, item.price, item.quantity);
                            this.items.push(item);
                        }
                    }
                }
                catch (err) {
                    // ignore errors while loading...
                }
            }
        };
    
    
    //----- Add new item /(increase/decrease) already selected  item to cart -----------------------------//
        this.addItem = function (sku, name, price, quantity) {
            quantity = this.toNumber(quantity);
            if (quantity != 0) {

                // update quantity for existing item
                var found = false;
                for (var i = 0; i < this.items.length && !found; i++) {
                    var item = this.items[i];
                    if (item.sku == sku) {
                        found = true;
                        item.quantity = this.toNumber(item.quantity) + quantity;
                        if (item.quantity <= 0) {
                            this.items.splice(i, 1);
                        }
                    }
                }

                // new item, add now
                if (!found) {
                    var item = new cartItem(sku, name, price, quantity);
                    this.items.push(item);
                }

                // save changes
                this.saveItems();
            }
        };
        
    
    // ----  number converter function ------------------------------------//
        this.toNumber = function (value) {
            value = value * 1;
            return isNaN(value) ? 0 : value;
        };
    
    
    
    //--------------- save item to localStorage ---------------------------//
        this.saveItems = function() {
             if (localStorage != null && JSON != null) {
                 localStorage[this.cartName + "_items"] = JSON.stringify(this.items);
             }
        };
    
    //--------------------clear the localStorage and cart --------------------------//
        this.clearItems = function() {
             this.items = [];
             this.saveItems();
        };
    
    //--- get total price of products--------------------------------//
        this.getTotalPrice = function (sku) {
            var total = 0;
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                if (sku == null || item.sku == sku) {
                    total += this.toNumber(item.quantity * item.price);
                }
            }
            return total;
        }

        //-----------get total Quantity of products---------------------//
        this.getTotalCount = function (sku) {
            var count = 0;
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                if (sku == null || item.sku == sku) {
                    count += this.toNumber(item.quantity);
                }
            }
            return count;
        };
    
        //----- create a new cartItem to store in localStorage --------------//
        function cartItem(sku, name, price, quantity) {
            this.sku = sku;
            this.name = name;
            this.price = price * 1;
            this.quantity = quantity * 1;
        };
 }]);