'use strict';
function storeController($scope, $routeParams,$http,Cart) {
    $scope.cart = Cart.getCart("ShoppingCart");
    //----------------------------when we click on name of product to see the detail then using $rootParams get the data from url and display ---------------------------------//
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
    //------------------ display all the product in store.htm  page -------------------------------------//
    $scope.initialize = function(){
        $http({
            method: 'GET',
            url: '../products.json'
        }).then(function successCallback(response) {
            $scope.products = response.data;
        })
    };
    
    //---------------------------------used for displaying the detail of product ----------------//
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
