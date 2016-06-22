
'use strict';

/*================================================
Module - for Controllers
================================================ */
angular.module('app.controllers', [])


/*================================================
StockCtrl - Controller
================================================ */
.controller('StockCtrl', function ($scope, $http) {

	$scope.symbol = "";
	$scope.result={};
	$scope.JSONToCSVConvertor = function(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    var CSV = '';
    //Set Report title in first row or line

    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";

        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {

            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";

        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);

        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        alert("Invalid data");
        return;
    }

    //Generate a file name
    var fileName = "";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");

    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
	}

	$scope.getData = function() {

	    var url = "http://query.yahooapis.com/v1/public/yql";
	    var symbol = $scope.symbol;
	    var data = encodeURIComponent("select * from yahoo.finance.quotes where symbol in ('" +$scope.symbol+ "')");


	   	var str1 = url.concat("?q=",data);
	   	str1=str1.concat("&format=json&diagnostics=true&env=http://datatables.org/alltables.env");


	    $http.get(str1)

	    .success(function(res, status, headers, config) {
	    	console.log("success data, status="+ JSON.stringify(res) + status);
	    	if(res.query.results == null) {
	    		console.log("No Valid Results could be Returned!!")
	    	}
	    	else {

					$scope.sumary = [];
					$scope.calls = [];
					$scope.puts = [];

					if(res.query.results.quote instanceof Array ){
						res.query.results.quote.forEach(function(val){
							var data = {};
							var calls = {};
							data.Name = val.Name;
							data.PreviousClose = val.PreviousClose;
							data.Open = val.Open;
							data.Bid = val.Bid;
							data.Ask = val.Ask;
							data.OneyrTargetPrice = val.OneyrTargetPrice;
							data.DaysRange = val.DaysRange;
							data.YearRange = val.YearRange;
							data.Volume = val.Volume;
							data.MarketCapitalization = val.MarketCapitalization;
							data.PERatio = val.PERatio;
							data.EPSEstimateCurrentYear = val.EPSEstimateCurrentYear;
							data.DividendYield = val.DividendYield;
							data.ExDividendDate = val.ExDividendDate;
							data.PercentChange = val.PercentChange;

							$scope.sumary.push(data);
							var dataName = val.symbol + "-" + res.query.created +  "-" + "summary";
							$scope.JSONToCSVConvertor($scope.sumary,dataName,true)

							calls.Name = val.Name;
							calls.PreviousClose = val.PreviousClose;
							calls.Open = val.Open;
							calls.Bid = val.Bid;
							calls.Ask = val.Ask;
							calls.Volume = val.Volume;

							$scope.calls.push(calls);

							var callname = val.symbol + "-" + res.query.created +  "-" + "calls";
							$scope.JSONToCSVConvertor($scope.calls, callname,true);
						});
					}else{
						var data = {};
						var calls = {};
						data.Name = res.query.results.quote.Name;
						data.PreviousClose = res.query.results.quote.PreviousClose;
						data.Open = res.query.results.quote.Open;
						data.Bid = res.query.results.quote.Bid;
						data.Ask = res.query.results.quote.Ask;
						data.OneyrTargetPrice = res.query.results.quote.OneyrTargetPrice;
						data.DaysRange = res.query.results.quote.DaysRange;
						data.YearRange = res.query.results.quote.YearRange;
						data.Volume = res.query.results.quote.Volume;
						data.MarketCapitalization = res.query.results.quote.MarketCapitalization;
						data.PERatio = res.query.results.quote.PERatio;
						data.EPSEstimateCurrentYear = res.query.results.quote.EPSEstimateCurrentYear;
						data.DividendYield = res.query.results.quote.DividendYield;
						data.ExDividendDate = res.query.results.quote.ExDividendDate;

						$scope.sumary.push(data);
						var dataName = res.query.results.quote.symbol + "-" + res.query.created +  "-" + "summary";
						$scope.JSONToCSVConvertor($scope.sumary,dataName,true)

						calls.Name = res.query.results.quote.Name;
						calls.PreviousClose = res.query.results.quote.PreviousClose;
						calls.Open = res.query.results.quote.Open;
						calls.Bid = res.query.results.quote.Bid;
						calls.Ask = res.query.results.quote.Ask;
						calls.Volume = res.query.results.quote.Volume;

						$scope.calls.push(calls);

						var callname = res.query.results.quote.symbol + "-" + res.query.created +  "-" + "calls";
						$scope.JSONToCSVConvertor($scope.calls, callname,true);

					}

		        $scope.result.Name = "Name: " + res.query.results.quote.Name;
		        $scope.result.Exchange = "Exchange: " + res.query.results.quote.StockExchange;
		        $scope.result.MarketCap = "MarketCap: " + res.query.results.quote.MarketCapitalization;
		        $scope.result.LastPrice = "Bid Price: " + res.query.results.quote.LastTradePriceOnly;
		        $scope.result.PercentChange = "% Change: " + res.query.results.quote.PercentChange;
		        $scope.result.YearRange = "Year Range: " + res.query.results.quote.YearRange;
		    }
	    })

	    .error(function(data, status, headers, config) {
	        var err = status + ", " + data;
	            $scope.result = "Request failed: " + err;
	    });
	}
})
