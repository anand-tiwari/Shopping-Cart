'use strict';

// the storeController contains two objects:
// - store: contains the product list
// - cart: the shopping cart object
function storeController($scope, $routeParams,$http,$rootScope,Cart) {
    $scope.cart = Cart.getCart("ShoppingCart");
    
    // use routing to pick the selected product
    if ($routeParams.productSku != null) {
        $http({
            method: 'GET',
            url: '../products.json'
            }).then(function successCallback(response) {
            angular.forEach(response.data,function(value,key){
                if(value.imageUrl==$routeParams.productSku){
                    $scope.product = value;
                }
            });
          })
    }
    $scope.initialize = function(){
        $http({
            method: 'GET',
            url: '../products.json'
        }).then(function successCallback(response) {
            $scope.products = response.data;
        })
    };
    
    $scope.send = function(data){
        console.log(data);
        $rootScope.selectedItem = data;
    };
    
    $scope.dvaCaption = [
        "Negligible",
        "Low",
        "Average",
        "Good",
        "Great"
    ];
     $scope.dvaRange = [
        "below 5%",
        "between 5 and 10%",
        "between 10 and 20%",
        "between 20 and 40%",
        "above 40%"
    ];
}
