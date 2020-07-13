var app = angular.module('admin', []);
app.controller('adminCtrl', function($scope) {
    // $scope.reports =[{name: 'Daily Activity Report', id: 10}, {name: 'Intrusion Report', id: 20}, {name: 'Entry & Exit report', id:30} ];
    $scope.reports =['Daily Activity Report', 'Intrusion Report', 'Entry & Exit report', 'Agent Activity Report', 'Supervisor Activity Report', 'Vehicle report', 'Visitor demographic Report'];
    $scope.removeList=[];
    $scope.addReport = function(list) {
        var pos = $scope.removeList.indexOf(list);
        if(pos < 0) {
            $scope.removeList.push(list);
        } else {
            $scope.removeList.splice(pos, 1);
        }       
    }

    $scope.deleteReport = function(list) {
    var removeListPos = $scope.removeList.indexOf(list);
    // var reportsPos =  $scope.reports.indexOf(list);
      $scope.removeList.splice(removeListPos, 1);
    //   $scope.reports.splice(reportsPos, 1);
    }

    $scope.isExists= function(list) {
        return $scope.removeList.indexOf(list) > -1;
    }

     $scope.optionNames = [
    {id:1, name: 'Sterile Zone Monitoring 1', menuset: ['Vehicle Count1', 'Vehicle Number', 'Vehicle Make and Model', 'People Count',
    'Dress & Accessories'
    ] },
    {id:2, name: 'Sterile Zone Monitoring 2', menuset: ['Vehicle Count2', 'Vehicle Number', 'Vehicle Make and Model', 'People Count',
    'Dress & Accessories']},
    {id:3, name: 'Sterile Zone Monitoring 3', menuset: ['Vehicle Count3', 'Vehicle Number', 'Vehicle Make and Model', 'People Count',
    'Dress & Accessories']},
    {id:3, name: 'Sterile Zone Monitoring 4', menuset: ['Vehicle Count4', 'Vehicle Number', 'Vehicle Make and Model', 'People Count',
    'Dress & Accessories']},
    {id:3, name: 'Sterile Zone Monitoring 5', menuset: ['Vehicle Count5', 'Vehicle Number', 'Vehicle Make and Model', 'People Count',
    'Dress & Accessories']}
    ];   


    $scope.selectedarea = function(val) {
        $scope.menu = val.menuset;
    }

    $scope.menu = ['Vehicle Count1', 'Vehicle Number', 'Vehicle Make and Model', 'People Count',
    'Dress & Accessories'];

    $scope.handlerightclick = function(event) {
        $scope.value="inline-block";
    }
    $scope.default = function() {
        console.log('avoid');
        $scope.value="none";
    }

    $scope.value="none";
    $scope.popupdisplay = "false";
    $scope.showpopup = function() {
        $scope.value="none";
        $scope.popupdisplay = "true";
    }

     $scope.firstblock = true;
     $scope.secondblock = true;
     $scope.thirdblock = true;

$scope.togglecontainers = function(id) {
    if(id == 10) {
        $scope.firstblock = true;
        $scope.secondblock = false;
        $scope.thirdblock = false;
    } else if(id == 20){

         $scope.firstblock = false;
        $scope.secondblock = true;
        $scope.thirdblock = false;

    } else{ 
 $scope.firstblock = false;
        $scope.secondblock = false;
        $scope.thirdblock = true;

    }
    
}
    

}).directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
});

function makeedit(elem) {
    var parentrow = elem.parentElement.parentElement.parentElement;
    var tds = parentrow.getElementsByTagName('td');

        if(elem.checked) {
         tds[4].style.display = "none"; 
         tds[5].style.display = "block";      
        } else {
                tds[4].style.display = "block"; 
                tds[5].style.display = "none";
        }

    }