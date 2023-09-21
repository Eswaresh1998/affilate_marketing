this.populate = populate;
this.hideValuesForEmptyInput = hideValuesForEmptyInput;
this.searchFunction = searchFunction;
this.openTab = openTab;
this.generateNodes = generateNodes;
this.emptyAllTabs = emptyAllTabs;
this.searchAndHighlight = searchAndHighlight;
this.bindClickEventForQuote = bindClickEventForQuote;
this.callData = callData;
this.callPolicyData = callPolicyData;
this.callQuoteData = callQuoteData;
this.callCustomerData = callCustomerData;
this.callCustData = callCustData;
this.callClaimsData = callClaimsData;
this.printPolicy = printPolicy;
let srchInput = document.getElementById("searchInput").value;
let actuallData = [];
let actualQuoteData = [];
let actualCustData = [];
let actualClaimsData = [];
let parsedOutputData = [];
let quoteOutputData = [];
let custOutputData = [];
let claimsOutputData = [];
let searchDiv = [];
let openedTabValue;
let oldTabName = "Policies";
let custDatas = "";
let updatable = this.widgetInputData.widgetProperties["UPDATABLE"];
let showOnlyClients = this.widgetInputData.widgetProperties["SHOW_ONLY_CLIENTS"];
let widgetWidth = this.widgetInputData.widgetProperties["WIDTH"];
this.uhei = this.widgetInputData.uniqueHTMLElementId;
this.resultcontainer = document.getElementById(this.uhei + "_result-container");
const viewallcontainer = document.getElementById(this.widgetInputData.uniqueHTMLElementId + "_view-section"); //new
const viewsection  = document.getElementById(this.uhei + "_view-section");//new

var entityReferenceArray;
//START|Code for claim handler
 let isclaimuser = this.widgetInputData.widgetProperties["CLAIM_USER"]; 
//END|Code for claim handler


// Functions for handling the snowflake code - Workaround until BSP-27040 is fixed
this.listenForSnowflakeChanges = listenForSnowflakeChanges;
this.setHiddenOnWidget = setHiddenOnWidget;
this.setUpdatableOnWidget = setUpdatableOnWidget;

//this.tabs = ['Policies', 'Clients', 'Quotes'];
this.tabs = ['Producers','Claims'];

let tempObj = {
    "pol": []
};
let quoteObj = {
    "quote": []
};
let custObj = {
    "customer": []
};
let claimsObj = {
    "claims": []
};
let dataLoadFlag = "NotLoaded";
function callData(tabName) {
	console.log("callData =", tabName);
	
    let searchInput = document.getElementById("searchInput").value;
    let polSearchBody = {
        'Search': 
            {'DBSearchInput': searchInput}
        };
    let producerSearch = {
        'sourceSystemUserId': 'admin@majesco.com',
        'searchType': 'CONTAINS',
        'searchEntityId': 'PRODUCER',
        'searchText': searchInput,
        'sortOrder': 'DESC',
        'sortColumn': 'producerCode',
        'startIndex': '1',
        'endIndex': '5'
    };
        let spromise = widgetInputData.httpAPIService.get({
        url: "/mic/api/oas/policy-distribution/v2/producers?pageSize=150",
        /* url: "/rest/api/unifiedsearchpolicies", */
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'NoClientIdentifier':'true' },
        //body: producerSearch
        /* body: polSearchBody */
    });
    console.log("spromise");
    
    //let spromise = widgetInputData.httpAPIService.post({
      //  url: "/rest/execute/api/quote-api-ph/customer-search",
        /* url: "/rest/api/unifiedsearchpolicies", */
        //headers: { 'Content-Type': 'application/json; charset=utf-8', 'NoClientIdentifier':'true' },
        //body: policySearch
        /* body: polSearchBody */
    //});
    spromise.then(function (response) {
        actuallData = [];
        tempObj.pol = [];
        if(response.data){
		console.log("response data = ", response.data);
            if (Array.isArray(response.data) === true){
                actuallData = response.data;
            }else{
                actuallData.push(response.data);
            }
            if (Array.isArray(response.data) === true){
                tempObj.pol = response.data;
            }else{
                tempObj.pol.push(response.data);
            }
            var reA = /[^a-zA-Z]/g;
            var reN = /[^0-9]/g;
            actuallData = actuallData.sort(function(a,b) {
                let full1 = a.producerCode.replace(reA, ""),
                    full2 = b.producerCode.replace(reA, "");
                if(full1 === full2) {
                    var aN = parseInt(a.producerCode.replace(reN, ""), 10);
                    var bN = parseInt(b.producerCode.replace(reN, ""), 10);
                    return aN === bN ? 0 : aN > bN ? 1 : -1;
                } else {
                    return full1 > full2 ? 1 : -1;
                }
            });
            tempObj.pol = tempObj.pol.sort(function(a,b) {
                let full1 = a.producerCode.replace(reA, ""),
                    full2 = b.producerCode.replace(reA, "");
                if(full1 === full2) {
                    var aN = parseInt(a.producerCode.replace(reN, ""), 10);
                    var bN = parseInt(b.producerCode.replace(reN, ""), 10);
                    return aN === bN ? 0 : aN > bN ? 1 : -1;
                } else {
                    return full1 > full2 ? 1 : -1;
                }
            });
        }


        /* if(response.Search){
            if (Array.isArray(response.Search) === true){
                actuallData = response.Search;
            }else{
                actuallData.push(response.Search);
            }
            if (Array.isArray(response.Search) === true){
                tempObj.pol = response.Search;
            }else{
                tempObj.pol.push(response.Search);
            }
            var reA = /[^a-zA-Z]/g;
            var reN = /[^0-9]/g;
            actuallData = actuallData.sort(function(a,b) {
                let full1 = a.PolicyNumber.replace(reA, ""),
                    full2 = b.PolicyNumber.replace(reA, "");
                if(full1 === full2) {
                    var aN = parseInt(a.PolicyNumber.replace(reN, ""), 10);
                    var bN = parseInt(b.PolicyNumber.replace(reN, ""), 10);
                    return aN === bN ? 0 : aN > bN ? 1 : -1;
                } else {
                    return full1 > full2 ? 1 : -1;
                }
            });
            tempObj.pol = tempObj.pol.sort(function(a,b) {
                let full1 = a.PolicyNumber.replace(reA, ""),
                    full2 = b.PolicyNumber.replace(reA, "");
                if(full1 === full2) {
                    var aN = parseInt(a.PolicyNumber.replace(reN, ""), 10);
                    var bN = parseInt(b.PolicyNumber.replace(reN, ""), 10);
                    return aN === bN ? 0 : aN > bN ? 1 : -1;
                } else {
                    return full1 > full2 ? 1 : -1;
                }
            });
        } */
        
        generateNodes($("#" + tabName), concatObjectValues(actuallData));
    }.bind(this));
}


function callCustData(clickedCustomer, polNumber) {
   console.log("callCustData, clickedCustomer  =", clickedCustomer,  polNumber); 
    let clickedCustomerN = clickedCustomer.split("  ").join(" ");
    
    let searchInput = document.getElementById("searchInput").value;
    let customerSearchBody = {
        'Search': 
            {'DBSearchInput': clickedCustomer}
        };
    let customerSearch = {
        'sourceSystemUserId': 'admin@majesco.com',
        'searchType': 'CONTAINS',
        'searchEntityId': 'CUSTOMER',
        'searchText': clickedCustomerN,
        'sortOrder': 'DESC',
        'sortColumn': 'customerNumber',
        'startIndex': '1',
        'endIndex': '5'
    };
    let spromise = widgetInputData.httpAPIService.post({
        //url: "/rest/execute/api/quote-api-ph/customer-search",
        /* url: "/rest/api/unifiedsearchpolicies", */
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'NoClientIdentifier':'true' },
        //body: customerSearch
        /* body: polSearchBody */
    });
    spromise.then(function (response) {
        actuallData = [];
        custObj.customer = [];
        
        if(response.data){
            if (Array.isArray(response.data) === true){
                actuallData = response.data;
            }else{
                actuallData.push(response.data);
            }
            if (Array.isArray(response.data) === true){
                custObj.customer = response.data;
            }else{
                custObj.customer.push(response.data);
            }
            var reA = /[^a-zA-Z]/g;
            var reN = /[^0-9]/g;
            actuallData = actuallData.sort(function(a,b) {
                    if(a.customerSearch!= null && a.customerSearch!= undefined){
                            let full1 = a.customerSearch.replace(reA, ""),
                    full2 = b.customerSearch.replace(reA, "");
                if(full1 === full2) {
                    var aN = parseInt(a.customerSearch.replace(reN, ""), 10);
                    var bN = parseInt(b.customerSearch.replace(reN, ""), 10);
                    return aN === bN ? 0 : aN > bN ? 1 : -1;
                } else {
                    return full1 > full2 ? 1 : -1;
                }
                    }
                
            });
            // custObj.customer = custObj.customer.sort(function(a,b) {
            //     let full1 = a.customerSearch.replace(reA, ""),
            //         full2 = b.customerSearch.replace(reA, "");
            //     if(full1 === full2) {
            //         var aN = parseInt(a.customerSearch.replace(reN, ""), 10);
            //         var bN = parseInt(b.customerSearch.replace(reN, ""), 10);
            //         return aN === bN ? 0 : aN > bN ? 1 : -1;
            //     } else {
            //         return full1 > full2 ? 1 : -1;
            //     }
            // });
        }

        /* if(response.Search){
            if (Array.isArray(response.Search) === true){
                actuallData = response.Search;
            }else{
                actuallData.push(response.Search);
            }
            if (Array.isArray(response.Search) === true){
                tempObj.pol = response.Search;
            }else{
                tempObj.pol.push(response.Search);
            }
            var reA = /[^a-zA-Z]/g;
            var reN = /[^0-9]/g;
            actuallData = actuallData.sort(function(a,b) {
                let full1 = a.PolicyNumber.replace(reA, ""),
                    full2 = b.PolicyNumber.replace(reA, "");
                if(full1 === full2) {
                    var aN = parseInt(a.PolicyNumber.replace(reN, ""), 10);
                    var bN = parseInt(b.PolicyNumber.replace(reN, ""), 10);
                    return aN === bN ? 0 : aN > bN ? 1 : -1;
                } else {
                    return full1 > full2 ? 1 : -1;
                }
            });
            tempObj.pol = tempObj.pol.sort(function(a,b) {
                let full1 = a.PolicyNumber.replace(reA, ""),
                    full2 = b.PolicyNumber.replace(reA, "");
                if(full1 === full2) {
                    var aN = parseInt(a.PolicyNumber.replace(reN, ""), 10);
                    var bN = parseInt(b.PolicyNumber.replace(reN, ""), 10);
                    return aN === bN ? 0 : aN > bN ? 1 : -1;
                } else {
                    return full1 > full2 ? 1 : -1;
                }
            });
        } */
        // generateNodes($("#" + tabName), concatObjectValues(actuallData));
        if(actuallData.length>1){
            document.getElementById('demo').innerHTML = '';
            let mainTable = document.createElement("table");
                mainTable.className = 'main-table';
            document.getElementById('demo').appendChild(mainTable);
            let mainTableTH = document.createElement('tr');
                mainTableTH.className = 'main-headrow';
                mainTable.appendChild(mainTableTH);
                var firstTh = document.createElement('th');
                firstTh.className = 'nameTh newcol';
                mainTableTH.appendChild(firstTh );
                firstTh.innerHTML = 'Customer Names';
                 var secondTh = document.createElement('th');
                secondTh.className = 'numberTh newcol';
                mainTableTH.appendChild(secondTh );
                secondTh.innerHTML = 'Customer Ids';
            var count = 0;
            for(i=0; i<actuallData.length; i++){
                console.log(" 298 Actual Data =  ",actuallData);
                let mainTableTD = document.createElement('tr');
                mainTableTD.className = 'main-row';
                mainTable.appendChild(mainTableTD);
                var firstTd = document.createElement('td');
                firstTd.className = 'nameTd newcol';
                mainTableTD.appendChild(firstTd );
                firstTd.innerHTML = actuallData[i].customerName;
                var secondTd = document.createElement('td');
                secondTd.className = 'numberTd newcol';
                mainTableTD.appendChild(secondTd);
                secondTd.innerHTML = actuallData[i].customerNumber;
                
				 var thirdTd = document.createElement('td');
                thirdTd.className = 'numberTd newcol';
                mainTableTD.appendChild(thirdTd);
                thirdTd.innerHTML = actuallData[i].customerNumber;
				
                count++;
                 $("#myModal").modal('show');
            }
        }else{
            
            let custNumber = actuallData[0].customerNumber;
            let custName = actuallData[0].customerName;

            // widgetInputData.printPolicy('customer'+"~"+ custName +"~"+ polNumber+"~"+custNumber);
            let data = 'customer'+"~"+ custName +"~"+ polNumber+"~"+custNumber;
            widgetInputData.eventAPIService.dispatchClickEvent(widgetInputData.mountPointElement, {dataValue: data});
            // $("#myModal").modal('hide');
            
        }
        document.getElementById('custCount').innerHTML = count;
        
        $( ".main-row" ).on( "click", function() {
            let custNumber = $(this).find('.numberTd').text();
                let custName = $(this).find('.nameTd').text();
            // widgetInputData.printPolicy('customer'+"~"+ custName +"~"+ polNumber+"~"+custNumber);
            let data = 'customer'+"~"+ custName +"~"+ polNumber+"~"+custNumber;
            
            widgetInputData.eventAPIService.dispatchClickEvent(widgetInputData.mountPointElement, {dataValue: data});
            $("#myModal").modal('hide');
        });
        
    }.bind(this));
}




function callPolicyData(tabName) {
    let searchInput = document.getElementById("searchInput").value;
    
    let spromise = widgetInputData.httpAPIService.get({
        //url: "/rest/execute/api/quote-api-ph/customer-search",
        headers: { 'Content-Type': 'application/json; charset=utf-8'},
        //body: quoteSearch
    });
    spromise.then(function (response) {
        actuallData = [];
        tempObj.pol = [];
        if(response.searchResults){
            if (Array.isArray(response.searchResults) === true){
                actuallData = response.searchResults;
            }else{
                actuallData.push(response.searchResults);
            }
            if (Array.isArray(response.searchResults) === true){
                tempObj.pol = response.searchResults;
            }else{
                tempObj.pol.push(response.searchResults);
            }
            var reA = /[^a-zA-Z]/g;
            var reN = /[^0-9]/g;
            actuallData = actuallData.sort(function(a,b) {
                let full1 = a.policyNumber.replace(reA, ""),
                    full2 = b.policyNumber.replace(reA, "");
                if(full1 === full2) {
                    var aN = parseInt(a.policyNumber.replace(reN, ""), 10);
                    var bN = parseInt(b.policyNumber.replace(reN, ""), 10);
                    return aN === bN ? 0 : aN > bN ? 1 : -1;
                } else {
                    return full1 > full2 ? 1 : -1;
                }
            });
            tempObj.pol = tempObj.pol.sort(function(a,b) {
                let full1 = a.policyNumber.replace(reA, ""),
                    full2 = b.policyNumber.replace(reA, "");
                if(full1 === full2) {
                    var aN = parseInt(a.policyNumber.replace(reN, ""), 10);
                    var bN = parseInt(b.policyNumber.replace(reN, ""), 10);
                    return aN === bN ? 0 : aN > bN ? 1 : -1;
                } else {
                    return full1 > full2 ? 1 : -1;
                }
            });
        }
        
        generateNodes($("#" + tabName), concatObjectValues(actuallData));
    }.bind(this));
}

function callQuoteData(tabName){
	  console.log("callQuoteData, tabName =", tabName); 
    let searchInput = document.getElementById("searchInput").value;
    let quoteSearchBody = {
        'Search': 
            {'DBSearchInput': searchInput}
        };
    let quoteSearch = {
        'sourceSystemUserId': 'admin@majesco.com',
        'searchType': 'CONTAINS',
        'searchEntityId': 'POLICY',
        'searchText': searchInput,
        'sortOrder': 'DESC',
        'sortColumn': 'policyNumber',
        'startIndex': '1',
        'endIndex': '5'
    };
    let spromise = widgetInputData.httpAPIService.post({
       // url: "/rest/execute/api/quote-api-ph/customer-search",
       /*  url: "/rest/api/unifiedsearchquotes", */
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'NoClientIdentifier':'true' },
        //body: quoteSearch
        /* body: quoteSearchBody */
    });

    spromise.then(function (response) {
        actualQuoteData = [];
        quoteObj.quote = [];
        if(response.data){
            if (Array.isArray(response.data) === true){
                actualQuoteData = response.data;
            }else{
                actualQuoteData.push(response.data);
            }
            if (Array.isArray(response.data) === true){
                quoteObj.quote = response.data;
            }else{
                quoteObj.quote.push(response.data);
            }
            var reA = /[^a-zA-Z]/g;
            var reN = /[^0-9]/g;
            actualQuoteData = actualQuoteData.sort(function(a,b) {
                let full1 = a.policyNumber.replace(reA, ""),
                    full2 = b.policyNumber.replace(reA, "");
                if(full1 === full2) {
                    var aN = parseInt(a.policyNumber.replace(reN, ""), 10);
                    var bN = parseInt(b.policyNumber.replace(reN, ""), 10);
                    return aN === bN ? 0 : aN > bN ? 1 : -1;
                } else {
                    return full1 > full2 ? 1 : -1;
                }
            });
            quoteObj.quote = quoteObj.quote.sort(function(a,b) {
                let full1 = a.policyNumber.replace(reA, ""),
                    full2 = b.policyNumber.replace(reA, "");
                if(full1 === full2) {
                    var aN = parseInt(a.policyNumber.replace(reN, ""), 10);
                    var bN = parseInt(b.policyNumber.replace(reN, ""), 10);
                    return aN === bN ? 0 : aN > bN ? 1 : -1;
                } else {
                    return full1 > full2 ? 1 : -1;
                }
            });
        }
    

        /* if(response.Search){
            if (Array.isArray(response.Search) === true){
                actualQuoteData = response.Search;
            }else{
                actualQuoteData.push(response.Search);
            }
            if (Array.isArray(response.Search) === true){
                quoteObj.quote = response.Search;
            }else{
                quoteObj.quote.push(response.Search);
            }
            var reA = /[^a-zA-Z]/g;
            var reN = /[^0-9]/g;
            actualQuoteData = actualQuoteData.sort(function(a,b) {
                let full1 = a.PolicyNumber.replace(reA, ""),
                    full2 = b.PolicyNumber.replace(reA, "");
                if(full1 === full2) {
                    var aN = parseInt(a.PolicyNumber.replace(reN, ""), 10);
                    var bN = parseInt(b.PolicyNumber.replace(reN, ""), 10);
                    return aN === bN ? 0 : aN > bN ? 1 : -1;
                } else {
                    return full1 > full2 ? 1 : -1;
                }
            });
            quoteObj.quote = quoteObj.quote.sort(function(a,b) {
                let full1 = a.PolicyNumber.replace(reA, ""),
                    full2 = b.PolicyNumber.replace(reA, "");
                if(full1 === full2) {
                    var aN = parseInt(a.PolicyNumber.replace(reN, ""), 10);
                    var bN = parseInt(b.PolicyNumber.replace(reN, ""), 10);
                    return aN === bN ? 0 : aN > bN ? 1 : -1;
                } else {
                    return full1 > full2 ? 1 : -1;
                }
            });
        } */
        
        generateNodes($("#" + tabName), concatQuoteObjectValues(actualQuoteData));
    }.bind(this));
}

function callCustomerData(tabName){
	
	  console.log("callQuoteData, tabName =", tabName); 
	  
    let searchInput = document.getElementById("searchInput").value;
    let custSearchBody = {
        'Search': 
            {'DBSearchInput': searchInput}
        };
    let custSearch = {
        'sourceSystemUserId': 'admin@majesco.com',
        'searchType': 'CONTAINS',
        'searchEntityId': 'POLICY',
        'searchText': searchInput,
        'sortOrder': 'DESC',
        'sortColumn': 'policyNumber',
        'startIndex': '1',
        'endIndex': '5'
    };
    let spromise = widgetInputData.httpAPIService.post({
        //url: "/rest/execute/api/quote-api-ph/customer-search",
        /* url: "/rest/api/unifiedsearchcustomers", */
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'NoClientIdentifier':'true' },
        //body: custSearch
        /* body: custSearchBody */
    });
    spromise.then(function (response) {
        actualCustData = [];
        custObj.customer = [];
        if(response.data){
            if (Array.isArray(response.data) === true){
                actualCustData = response.data;
            }else{
                actualCustData.push(response.data);
            }
            if (Array.isArray(response.data) === true){
                custObj.customer = response.data;
            }else{
                custObj.customer.push(response.data);
            }
        }
        /* if(response.Search){
            if (Array.isArray(response.Search) === true){
                actualCustData = response.Search;
            }else{
                actualCustData.push(response.Search);
            }
            if (Array.isArray(response.Search) === true){
                custObj.customer = response.Search;
            }else{
                custObj.customer.push(response.Search);
            }
        } */
        
        //actualCustData = response.Search;
        /* if(actualCustData !== undefined){
            custObj.customer = actualCustData;
            generateNodes($("#" + tabName), concatCustomerObjectValues(actualCustData));
        }else{
            actualCustData = [];
            custObj.customer = [];
            generateNodes($("#" + tabName), concatCustomerObjectValues(actualCustData));
        } */
        generateNodes($("#" + tabName), concatCustomerObjectValues(actualCustData));
    }.bind(this));
}
function callClaimsData(tabName){
	  console.log("callClaimsData, tabName =", tabName); 
    let searchInput = document.getElementById("searchInput").value;
	let claimSearch = {
        "sourceSystemCode": "MIC",
        "sourceSystemRequestNo": "0",
        "additionalFilters": [      
         {
            "filterColumn": "searchText",
            "filterValue": searchInput,
            "filterFormat": "STRING"
        }
        ]
    };
    
    let spromise = widgetInputData.httpAPIService.post({
        // url: "/rest/execute/api/quote-api-ph/customerPoliciesQuotesReport?countOnly=N",
        //headers: { 'Content-Type': 'application/json; charset=utf-8' },
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'NoClientIdentifier':'true' },
        //body: claimSearch
	});
   spromise.then(function (response) {
       console.log("Claim data",response.reportData);
        actualClaimsData = [];
        claimsObj.claims = [];
        if(response.reportData){
            if (Array.isArray(response.reportData) === true){
                actualClaimsData = response.reportData;
            }else{
                actualClaimsData.push(response.reportData);
            }
            if (Array.isArray(response.reportData) === true){
                claimsObj.claims = response.reportData;   
            }else{
                claimsObj.claims.push(response.reportData);  
            }
            var reA = /[^a-zA-Z]/g;
            var reN = /[^0-9]/g;
	        actualClaimsData = actualClaimsData.sort(function(a,b) {
               let full1 = a.PolicyNumber.replace(reA, ""),
                    full2 = b.PolicyNumber.replace(reA, "");
                if(full1 === full2) {
                    var aN = parseInt(a.PolicyNumber.replace(reN, ""), 10); 
                    var bN = parseInt(b.PolicyNumber.replace(reN, ""), 10); 
                    return aN === bN ? 0 : aN > bN ? 1 : -1;
                } else {
                    return full1 > full2 ? 1 : -1;
                }
            });
	        claimsObj.claim = claimsObj.claims.sort(function(a,b) {
                let full1 = a.PolicyNumber.replace(reA, ""),
                    full2 = b.PolicyNumber.replace(reA, "");
                if(full1 === full2) {
                    var aN = parseInt(a.PolicyNumber.replace(reN, ""), 10);  
                    var bN = parseInt(b.PolicyNumber.replace(reN, ""), 10);  
                    return aN === bN ? 0 : aN > bN ? 1 : -1;
                } else {
                    return full1 > full2 ? 1 : -1;
                }
            });
        }
    generateNodes($("#" + tabName), concatClaimsObjectValues(actualClaimsData));
    
    }.bind(this));
    
}

function connect() {
    this.widgetInputData.printPolicy = this.printPolicy;
    const scriptId = '83c4d5cf-8fac-4fe8-b0e2-64d6cea64b16';
    const jsUrl = this.widgetInputData.imageLobService.getImageLobURL(scriptId);
    $.ajaxSetup({
        cache: true,
        NoClientIdentifier: 'true'
    });
    $.getScript(jsUrl, function (data, textStatus, jqxhr) {
        this.paint();
    }.bind(this));
}
function generateNodes(baseNode, referenceNumberArray) {
	console.log("generateNodes ",baseNode);
	console.log("referenceNumberArray ",referenceNumberArray);
    // navigationLink
    // let entity = referenceNumberArray.navigationLink;
    //
//debugger;
entityReferenceArray = referenceNumberArray[5];
    // let entityArray = entity.split('&');
    // var entityreference = entityArray[2];
    if (baseNode){
        //alert("in generateNodes");
         $("#dropValues a").remove();
    }
    let outputTabName = baseNode[0].id;
    //alert(outputTabName);
    let refArr = [];
        refArr = referenceNumberArray;
    //$("#dropValues").empty();
    let aNode;
    let dNode;
    let sNode;
    if (aNode){
            aNode = "";
        }
        if (dNode){
            dNode = "";
        }
        if (sNode){
            sNode = "";
        }
    //$(baseNode).empty();
	if(outputTabName &&  (outputTabName === 'Claims')){
    
	for (let i = 0; i < referenceNumberArray.length; i++) {
		let polNumber = referenceNumberArray[i].split("~")[0];
        let polRefNumber = referenceNumberArray[i].split("~")[5];
		let claimNumber = referenceNumberArray[i].split("~")[1];
	        let lossDate = "";
	        if (referenceNumberArray[i].split("~")[2] === "undefined"){
			lossDate = "";
		}
		else{
			lossDate=referenceNumberArray[i].split("~")[2];
		}
		
		let claimStatus = referenceNumberArray[i].split("~")[3];
		let firstName = referenceNumberArray[i].split("~")[4];
		let lastName = referenceNumberArray[i].split("~")[5];
        let insuredFullName=referenceNumberArray[i].split("~")[6];
        if (polNumber !== "undefined" && claimNumber !== "undefined"){
            
            	aNode = $('<a id = "myAnchorTag" class="exclude" href="javascript:void(0)"> </a>');	
                // $(aNode).click(widgetInputData.printPolicy("Policies"+"~"+insuredFullName));
                // $(aNode).click(widgetInputData.printPolicy(outputTabName+"~"+insuredFullName+"~"+claimNumber));
		        dNode = $('<div class="info"> </div>');
                pNode = $('<p> </p>');
                sNode = $('<div>'
                                +   '<div>'
                                +       '<span>'+ polNumber +'</span>'
                                +   '</div>'
                                +   '<div>'
				                +       '<div class="flex-end">'
                                +           '<div>'
                                +               '<span>'+ claimNumber +'</span>'
                                +           '</div>'
                                /*+           '<div>'
                                +               '<span>'+ lossDate +'</span>'
                                +           '</div>'
                                +           '<div>'
                                +               '<span>'+ claimStatus +'</span>'
                                +           '</div>'
                                +           '<div>'
                                +               '<span>'+ firstName +'</span>'
				                +           '</div>'						
                                +           '<div>'
                                +               '<span>'+ lastName +'</span>'
                                +           '</div>'	*/					
                                +       '</div>'
                                +   '</div>'    
                                +'</div>');
                		$(pNode).append(sNode);
                		$(dNode).append(pNode);
                		$(aNode).append(dNode);
		        	    $(baseNode).append(aNode);
	  }//end of if
	}//end of for
	}//end of if tabname === 'Claims'
	else{
        aNode = $('<a id = "myAnchorTag" class="exclude" href="javascript:void(0)"> </a>');
        $(baseNode).append(aNode);
    	for (let i = 0; i < referenceNumberArray.length; i++) {

            let polNumber = referenceNumberArray[i].split("~")[0];
            let insuredName = referenceNumberArray[i].split("~")[1];
            let insuredAddress = "";

            if (referenceNumberArray[i].split("~")[2] === "undefined"){
                insuredAddress = "";
            }else{
                insuredAddress = referenceNumberArray[i].split("~")[2];
            }

            let postCode = "";
            if (referenceNumberArray[i].split("~")[3] === "undefined"){
                postCode = "";
            }else{
                postCode = referenceNumberArray[i].split("~")[3];
            }

            let revisionNo = "";
            if (referenceNumberArray[i].split("~")[4] === "undefined"){
                revisionNo = "";
            }else{
                revisionNo = referenceNumberArray[i].split("~")[4];
            }

            let entityReference = referenceNumberArray[i].split("~")[5];
            let polStatus = referenceNumberArray[i].split("~")[6];
            

            if (polNumber !== "undefined" && insuredName !== "undefined" && entityReference !== "undefined"){
                
				console.log("774");
                if(outputTabName && outputTabName === 'Producers'){
                    
                        // let customerele = secondTD.firstElementChild;
                        // let customername = customerele.innerHTML;
                        // let polnumber = thirdTD.firstElementChild.innerHTML;
                        // $(customerele).click(widgetInputData.printPolicy('customer'+"~"+customername+"~"+polnumber));



                    // $(aNode).click(widgetInputData.printPolicy(outputTabName+"~"+insuredName+"~"+polNumber));



                }
                // if(outputTabName &&  (outputTabName === 'Clients')){
                //     $(aNode).click(widgetInputData.printPolicy(outputTabName+"~"+insuredName+"~"+polNumber));
                // }
                if(outputTabName && (outputTabName === 'Quotes')){
                    // if (isclaimuser!== "Y" && !polNumber.includes("P")){
                    // $(aNode).click(widgetInputData.printPolicy(outputTabName+"~"+polNumber+"~"+entityReference+"~"+polStatus));
                    // }
                    // $(aNode).click(widgetInputData.printPolicy(outputTabName+"~"+insuredName+"~"+polNumber));
                }
                if(outputTabName &&  (outputTabName === 'Claims')){
                    // $(aNode).click(widgetInputData.printPolicy(outputTabName+"~"+insuredName+"~"+polNumber));
                }
                            
                dNode = $('<div class="info"> </div>');
                pNode = $('<p> </p>');
                sNode = $('<div>'+   '<div>'
                                +       '<span>'+ polNumber+'</span>'
                                +   '</div>'
                                +   '<div>'
                                +       '<div class="flex-end">'
                                +           '<div>'
                                +               '<span>'+ insuredName +'</span>'
                                +           '</div>'
                                +           '<div>'
                                +               '<span>'+ insuredAddress +'</span>'
                                +           '</div>'
                                +           '<div>'
                                +               '<span>'+ postCode +'</span>'
                                +           '</div>'
                                +           '<div>'
                                +               '<span>'+ revisionNo +'</span>'
                                +           '</div>'						
                                +           '<div>'
                                +               '<span>'+ entityReference +'</span>'
                                +           '</div>'						
                                +           '<div>'
                                +               '<span>'+ polStatus +'</span>'
                                +           '</div>'
                                +       '</div>'
                                +   '</div>'    
                                +'</div>');
                $(pNode).append(sNode);
                $(dNode).append(pNode);
                $(aNode).append(dNode);
            }
	    }
        
    }
    searchAndHighlight(outputTabName, refArr);
}


function printPolicy(pol){
    return function(e) {
        widgetInputData.eventAPIService.dispatchClickEvent(widgetInputData.mountPointElement, {dataValue: pol});
    }.bind(this);
}
function paint() {
    

    if (updatable && updatable === 'N'){
        document.getElementById("searchInput").disabled = true;
    }

    if (showOnlyClients && showOnlyClients === 'Y') {
        document.getElementById("btn").style.display = "none";
        document.getElementById("btn2").style.display = "none";
        document.getElementById("btn3").style.display = "none";
        document.getElementById("searchInput").placeholder = "Search for clients...";
        document.getElementById("enter-message-label").innerHTML = "After keying value to Search, press Enter."
        document.getElementById("empty-message-label").innerHTML = "No items found. Please check your spelling.";
        document.getElementById("empty-message-label-or").innerHTML = "";
        document.getElementById(widgetInputData.uniqueHTMLElementId + "_new-quote").style.display = "none";    
    }

    if (widgetWidth != null && widgetWidth != ""){
        document.getElementById("customSearchID").style.width = widgetWidth;
    }
        
    //Next part on clicking close button
    var closebuttons = document.getElementsByClassName("closeButton");
    var closetheicon = document.getElementById("closeIcon");
    var j;
    var x = document.getElementById("dropDown");
    var scrollContainer = document.getElementById("_slimscroll-container");
    // $(scrollContainer).slimScroll({ width: '100%' });
    var closeTabs = document.getElementById("butns");
    var xyz = document.getElementById("searchImage");
    const lwidgetInputData = this.widgetInputData;
    
    for (j = 0; j < closebuttons.length; j++) {
        closebuttons[j].addEventListener("click", function (event) {
            document.getElementById('searchInput').value = ''; //onclick empty the input
            event.target.nextElementSibling.style.display = 'none'; //onclick hide the dropdown
            x.style.display = "none";
            closeTabs.style.display = "none";
            xyz.style.display = "inline-block";
            searchFunction(this.widgetInputData); //as input is empty, search should also get updated(search executes only on keydown)
            closetheicon.style.display = "none";
            viewallcontainer.style.display = "none"; //new
            if (widgetWidth != null && widgetWidth != ""){
                document.getElementById("customSearchID").style.width = "50%"
            }
        }.bind(this));
    }
//Jaya changed
    var tabs = ['Producers','Claims'];
    document.getElementById("searchInput").onclick = function () {
        if (widgetWidth != null && widgetWidth != ""){
            document.getElementById("customSearchID").style.width = "100%"
        }
        
        if(!document.getElementById("searchInput").value){
            emptyAllTabs(this.tabs);
            $("#enter-message").show();
           
            $("#searching-message").hide();
            
        }   
        populate();
    }.bind(this);

    
    document.getElementById("searchInput").onkeyup = function (event) {
		
        let timer;
        emptyAllTabs(this.tabs);
        clearTimeout(timer);
        timer = setTimeout(()=>{
         //if (event.keyCode === 13){
            // $("#enter-message").hide();
            // $("#searching-message").show();
            let searchval = document.getElementById('searchInput').value;//new
            if (searchval.length>=3){ //new
                /*if (event.keyCode === 13)
                   { */
                    console.log("in length check");
                    x.style.display = "block"; //new-to display dropdown when data is entered
                    closeTabs.style.display = "block"; //new-to display dropdown when data is entered
                    closetheicon.style.display = "inline-block"; //new
                    viewallcontainer.style.display = "block"; //new
                    searchFunction(this.widgetInputData);
                    openedTabValue = "Producers";
                    openTab(event, openedTabValue, concatObjectValues(tempObj.pol), this.tabs, this.widgetInputData);
                    hideValuesForEmptyInput();
                  // } 
            }
            else{
            event.target.nextElementSibling.style.display = 'none'; //onclick hide the dropdown
            x.style.display = "none";
            closeTabs.style.display = "none";
            xyz.style.display = "inline-block";
            viewallcontainer.style.display = "none";
            }
             
         //}
        },1000)
         
        //hideValuesForEmptyInput();
    }.bind(this);

    //new-for searching on click of search icon
    document.getElementById("searchImage").onclick = function (event) {
        let timer1;
        emptyAllTabs(this.tabs);
        clearTimeout(timer1);
        timer1 = setTimeout(()=>{
         //if (event.keyCode === 13){
            // $("#enter-message").hide();
            // $("#searching-message").show();

            searchFunction(this.widgetInputData);
            openedTabValue = "Producers";
            openTab(event, openedTabValue, concatObjectValues(tempObj.pol), this.tabs, this.widgetInputData);
            hideValuesForEmptyInput();
         //}
        },1000)
         
        //hideValuesForEmptyInput();
    }.bind(this);

//Jaya changed
    document.getElementById("btn").onclick = function (event) {
        openedTabValue = "Producers";
        openTab(event, openedTabValue, concatObjectValues(tempObj.pol), this.tabs, this.widgetInputData);
        hideValuesForEmptyInput();
    }.bind(this);
    // document.getElementById("btn1").onclick = function () {
    //     openedTabValue = "Clients";
    //     openTab(event, openedTabValue, concatCustomerObjectValues(custObj.customer), this.tabs, this.widgetInputData);
    //     hideValuesForEmptyInput();
    // }.bind(this);
	//Jaya commented
   /* document.getElementById("btn2").onclick = function (event) {
        openedTabValue = "Quotes";
        openTab(event, openedTabValue, concatQuoteObjectValues(quoteObj.quote), this.tabs, this.widgetInputData);
        hideValuesForEmptyInput();
    }.bind(this);*/
     document.getElementById("btn3").onclick = function (event) {
        openedTabValue = "Claims";
        openTab(event, openedTabValue, concatClaimsObjectValues(claimsObj.claims), this.tabs, this.widgetInputData);
        hideValuesForEmptyInput();
    }.bind(this); 

    if (showOnlyClients && showOnlyClients === 'Y') {
        document.getElementsByClassName("eachTab")[1].click();     
    } else {
        document.getElementsByClassName("eachTab")[0].click();
    }
    //new
    $(viewsection).click(function(){
        console.log("VIEW clicked.....",openedTabValue);
        if(openedTabValue==="Producers")
        {
            openedTabValue= "Policies";
        }
        widgetInputData.eventAPIService.dispatchClickEvent(widgetInputData.mountPointElement, {dataValue: document.getElementById("searchInput").value+"~"+openedTabValue});		
	});
    //Claim handler changes|Start
 if (isclaimuser !== "Y"){
    bindClickEventForQuote();
}
else{
    document.getElementById(widgetInputData.uniqueHTMLElementId + "_new-quote").disabled = true;
} 
 //Claim handler changes|End
}


/* below function will open empty DIV and values will be hidden initially */
function populate() {
    var x = document.getElementById("dropDown");
    var w = document.getElementById("dropValues");
    var z = document.getElementById("butns");
    var y = document.getElementById("empty-message");
    var searching = document.getElementById("searching-message");
    var enter = document.getElementById("enter-message");
    var abc = document.getElementById("closeIcon");
    var slimscroll = document.getElementById("_slimscroll-container");
    
    x.style.display = "block"; // to open empty container
    z.style.display = "block";
    slimscroll.style.display = "block";
    abc.style.display = "inline-block";
    viewallcontainer.style.display = "block"; //new
    
    //y.style.display = "none"; //Initially hide this message
    //searching.style.display = "none";

    if (!document.getElementById('searchInput').value) {
        console.log("INput is empty");
        w.style.display = "none"; // to hide values
        //y.style.display = "none";
        enter.style.display = "block";
        searching.style.display = "none";
        x.style.display = "none"; //new-to hide the dropdown
        z.style.display = "none"; //new-to hide the dropdown
       viewallcontainer.style.display = "none"; //new
       abc.style.display = "none"; //new
    }
}
/*hideValuesForEmptyInput- when the search input is less than 3, values should be hidden*/
function hideValuesForEmptyInput() {
    var w = document.getElementById("dropValues");
    var y = document.getElementById('searchInput').value;
    var x = y.length;
    var slimscroll = document.getElementById("_slimscroll-container");

    if (y.length >= 3) {
        $("#enter-message").hide();
        $("#searching-message").show();
        if(w & slimscroll){
            w.style.display = "block";
         
            slimscroll.style.display = "block";
        }
        
        if (openedTabValue && openedTabValue === 'Producers'){
            //callData(openedTabValue);
            callData(openedTabValue);
            //callClaimsData(openedTabValue);
        }
/*if (openedTabValue && openedTabValue === 'Quotes'){
            callQuoteData(openedTabValue);
        }*/
        if (openedTabValue && openedTabValue === 'Claims'){
            callClaimsData(openedTabValue);
        }
    } else {
        w.style.display = "block";
        slimscroll.style.display = "block";
    }
}

function searchFunction(widgetInputData) {
    var input, inputValue, upperCaseValue, ele, arr, i, stringlength;
    input = document.getElementById("searchInput");
    inputValue = input.value;
    stringlength = inputValue.length;
}

function openTab(event, tabName, mockDataArray, tabs, widgetInputData) {
    emptyAllTabs(tabs);
    tab = document.getElementsByClassName("eachTab");
    for (i = 0; i < tab.length; i++) {
        tab[i].className = tab[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    if(tabName === 'Producers'){
        document.getElementById('btn').className += " active";
    }else{
        event.currentTarget.className += " active";
    }
}

function searchAndHighlight(tabName, arrayList) {
     
    searchDiv = [];
    let mainDiv;
    const value = $("#searchInput").val();
    if (value && value.length > 0) {
            if(arrayList){
                let mainDiv = document.createElement('div');
                mainDiv.className = 'full-width';
                let mainTable = document.createElement('table');
                mainTable.className = 'full-width-table';
                mainDiv.appendChild(mainTable);

                let mainTableTH = document.createElement('tr');
                //To Analyse
                mainTableTH.className = 'headrow';mainTableTH.className = 'headrow';
                mainTable.appendChild(mainTableTH);
                let firstTh = document.createElement('td');
                firstTh.className = 'firsttd gridHead';
                mainTableTH.appendChild(firstTh );
                firstTh.innerHTML = 'Customer';
                let secondTh = document.createElement('td');
                secondTh.className = 'secondtd gridHead';
                mainTableTH.appendChild(secondTh);
                secondTh.innerHTML = 'Number';
				
				let thirdTh = document.createElement('td');
                thirdTh.className = 'secondtd gridHead';
                mainTableTH.appendChild(thirdTh);
                thirdTh.innerHTML = 'Type';
                
                for(let i=0;i<arrayList.length;i++){
                    // Splitting each string
                    let listPolNo = arrayList[i].split("~");
                    
                    let mainTableTR = document.createElement('tr');
                        mainTableTR.className = 'bodyrow';
                        mainTable.appendChild(mainTableTR);
                            let imgTD = document.createElement('td');
                            imgTD.className = 'img-td-width';
                            let imgTag = document.createElement('img');
                            imgTag.src = "/rest/download/byid/largeObjectContent/db648449-8a2a-4e62-a8ae-c62663cbd9c8";
                            imgTag.alt = "PolicyImg";
                            imgTD.appendChild(imgTag);
                            mainTableTR.appendChild(imgTD);
                    
                    let secondTD = document.createElement('td');
                        secondTD.className = 'second-td-width text-align-table';
                    mainTableTR.appendChild(secondTD);
                    let thirdTD = document.createElement('td');
                        thirdTD.className = 'third-td-width text-align-table';
                    mainTableTR.appendChild(thirdTD);
                    let fourthTD = document.createElement('td');
                        fourthTD.className = 'fourth-td-width text-align-table';
                    mainTableTR.appendChild(fourthTD);
                    let fifthTD = document.createElement('td');
                        fifthTD.className = 'fifth-td-width text-align-table';
                    mainTableTR.appendChild(fifthTD);
                    let sixthTD = document.createElement('td');
                        sixthTD.className = 'sixth-td-width text-align-table';
                    mainTableTR.appendChild(sixthTD);
                    let seventhTD = document.createElement('td');
                        seventhTD.className = 'seventh-td-width text-align-table';
                    mainTableTR.appendChild(seventhTD);

                    
                    if(tabName && (tabName ==='Claims')){
                        
                         let tempPolNoSearch = listPolNo[5];
                        tempPolNoSearch = tempPolNoSearch.trim();
                        var matchStart = tempPolNoSearch.toLowerCase().indexOf("" + value.toLowerCase() + "");
                        var matchEnd = matchStart + value.length - 1;
                        var beforeMatch = tempPolNoSearch.slice(0, matchStart);
                        var matchText = tempPolNoSearch.slice(matchStart, matchEnd + 1);
                        var afterMatch = tempPolNoSearch.slice(matchEnd + 1);
                        if (matchText){
                            let beforeMatchSpan = document.createElement('span');
                                beforeMatchSpan.innerHTML = beforeMatch.trim();
                            // thirdTD.appendChild(beforeMatchSpan);
                            let matchedSpan = document.createElement('span');
                                matchedSpan.classList = 'matched-font';
                                matchedSpan.innerHTML = matchText.trim();
                            thirdTD.appendChild(matchedSpan);
                            let unMatchedSpan = document.createElement('span');
                                unMatchedSpan.innerHTML = afterMatch.trim();
                            // thirdTD.appendChild(unMatchedSpan);
                        }else{
                            let lastchar = tempPolNoSearch.charAt(tempPolNoSearch.length-1);
                            beforeMatch = beforeMatch.concat(lastchar);
                            let unMatchedSpan = document.createElement('span');
                            unMatchedSpan.innerHTML = beforeMatch;
                            thirdTD.appendChild(unMatchedSpan);
                        }
                            //claimNo
                            //let claimNoDiv = document.createElement('div');
                              //  claimNoDiv.className = 'flex-end-elements text-overflow-div';
                            let claimNoSpan = document.createElement('span');
                            claimNoSpan.innerHTML = listPolNo[1].trim();
                            //claimNoDiv.appendChild(claimNoSpan);
                            secondTD.appendChild(claimNoSpan);
                              // LossNo
                            /*let lossDateDiv = document.createElement('div');
                                lossDateDiv.className = 'flex-end-elements text-overflow-div';
                            let lossDateSpan = document.createElement('span');
                                lossDateSpan.innerHTML = listPolNo[2].trim();
                            lossDateDiv.appendChild(lossDateSpan);
                            fourthTD.appendChild(lossDateSpan);*/
                            
                             // Status
                            /*let statusDiv = document.createElement('div');
                                statusDiv.className = 'flex-end-elements text-overflow-div';
                            let statusSpan = document.createElement('span');
                                statusSpan.innerHTML = listPolNo[3].trim();
                            statusDiv.appendChild(statusSpan);
                            fifthTD.appendChild(statusSpan);*/

                            // firstname
                            /*let firstNameDiv = document.createElement('div');
                                firstNameDiv.className = 'flex-end-elements text-overflow-div';
                            let firstNameSpan = document.createElement('span');
                                firstNameSpan.innerHTML = listPolNo[4].trim();
                            firstNameDiv.appendChild(firstNameSpan);
                            sixthTD.appendChild(firstNameSpan);*/
                            
                            // secondname
                            /*let secondNameDiv = document.createElement('div');
                                secondNameDiv.className = 'flex-end-elements text-overflow-div';
                            let secondNameSpan = document.createElement('span');
                                secondNameSpan.innerHTML = listPolNo[5].trim();
                            secondNameDiv.appendChild(secondNameSpan);
                            seventhTD.appendChild(secondNameSpan);*/

                            searchDiv.push(mainDiv.outerHTML); 
                    }
					//jaya changed
                    if(tabName && (tabName ==='Producers')){
                        let tempPolNoSearch = listPolNo[0];
                        tempPolNoSearch = tempPolNoSearch.trim();
                        var matchStart = tempPolNoSearch.toLowerCase().indexOf("" + value.toLowerCase() + "");
                        var matchEnd = matchStart + value.length - 1;
                        var beforeMatch = tempPolNoSearch.slice(0, matchStart);
                        var matchText = tempPolNoSearch;//tempPolNoSearch.slice(matchStart, matchEnd + 1);
                        var afterMatch = tempPolNoSearch.slice(matchEnd + 1);
                        if (matchText){
                            let beforeMatchSpan = document.createElement('span');
                                beforeMatchSpan.innerHTML = beforeMatch.trim();
                            // thirdTD.appendChild(beforeMatchSpan);
                            let matchedSpan = document.createElement('span');
                                matchedSpan.classList = 'matched-font';
                                matchedSpan.innerHTML = matchText.trim();
								console.log("1255 matchText = " ,matchText);
                            thirdTD.appendChild(matchedSpan);
                            let unMatchedSpan = document.createElement('span');
                                unMatchedSpan.innerHTML = afterMatch.trim();
                            // thirdTD.appendChild(unMatchedSpan);
                        }else{
                            let lastchar = tempPolNoSearch.charAt(tempPolNoSearch.length-1);
                            beforeMatch = beforeMatch.concat(lastchar);
                            let unMatchedSpan = document.createElement('span');
                            unMatchedSpan.innerHTML = beforeMatch;
                            thirdTD.appendChild(unMatchedSpan);
							console.log("1266 unMatchedSpan = " ,unMatchedSpan);
                        }
                    }
                    if (tabName && (tabName ==='Clients')){
                        let tempName = listPolNo[1].trim();
                        let val = value.trim();
                        var matchStart = tempName.toLowerCase().indexOf("" + val.toLowerCase() + "");
                        var matchEnd = matchStart + val.length - 1;
                        var beforeMatch = tempName.slice(0, matchStart);
                        var matchText = tempName.slice(matchStart, matchEnd + 1);
                        var afterMatch = tempName.slice(matchEnd + 1);
                        if (matchText){
                            let beforeMatchSpan = document.createElement('span');
                            beforeMatchSpan.innerHTML = beforeMatch;
                            // thirdTD.appendChild(beforeMatchSpan);
                            let matchedSpan = document.createElement('span');
                            matchedSpan.classList = 'matched-font';
                            matchedSpan.innerHTML = matchText;
                            thirdTD.appendChild(matchedSpan);
                            let unMatchedSpan = document.createElement('span');
                            unMatchedSpan.innerHTML = afterMatch;
                            // thirdTD.appendChild(unMatchedSpan);
                        }else{
                            let lastchar = tempName.charAt(tempName.length-1);
                            beforeMatch = beforeMatch.concat(lastchar);
                            let unMatchedSpan = document.createElement('span');
                            unMatchedSpan.innerHTML = beforeMatch;
                            thirdTD.appendChild(unMatchedSpan);
                        }
                        //let matchedText = matchText + afterMatch;

                        // Added new
                        let polNoDiv = document.createElement('div');
                            polNoDiv.className =  'flex-end-elements';
                        let tempPolNoSearch = listPolNo[0];
                        tempPolNoSearch = tempPolNoSearch.trim();
                        let polNoSpan = document.createElement('span');
                            polNoSpan.innerHTML = tempPolNoSearch;
                        polNoDiv.appendChild(polNoSpan);
                        secondTD.appendChild(polNoDiv);
                    }else{
                        if(tabName && (tabName !=='Claims')){
                            let nameSpan = document.createElement('span');
                            nameSpan.innerHTML = listPolNo[1];
                            if(listPolNo[1] === 'null'){
                                nameSpan.style.display = 'none';   
                            }else{
                                secondTD.appendChild(nameSpan);
                            }  
                         }
                    }
					//jaya changed
                    if(tabName && (tabName ==='Producers') || tabName ==='Clients'){
					
                        // Address
                        let addrDiv = document.createElement('div');
                            addrDiv.className = 'flex-end-elements text-overflow-div';
                        let addrSpan = document.createElement('span');
                            addrSpan.innerHTML = listPolNo[2].trim();
                        addrDiv.appendChild(addrSpan);
                        fourthTD.appendChild(addrDiv);
                        // Postcode
                        let postCodeDiv = document.createElement('div');
                            postCodeDiv.className = 'flex-end-elements text-overflow-div';
                        let postCodeSpan = document.createElement('span');
                            postCodeSpan.innerHTML = listPolNo[3].trim();
                        postCodeDiv.appendChild(postCodeSpan);
                        fifthTD.appendChild(postCodeDiv);
                        // RevisionNo
                        let revisionNoDiv = document.createElement('div');
                            revisionNoDiv.className = 'flex-end-elements text-overflow-div';
                        let revisionNoSpan = document.createElement('span');
                            revisionNoSpan.innerHTML = listPolNo[4].trim();
                        revisionNoDiv.appendChild(revisionNoSpan);
                        sixthTD.appendChild(revisionNoSpan);
						console.log("1333 mainDiv.outerHTML ",mainDiv.outerHTML )  ;
                        searchDiv.push(mainDiv.outerHTML); 
                    }//end of if
                } //end of for
            }//end of if(arrlist)
            let count = searchDiv.length-1;
            let dispDiv = "";
            $("#dropValues a").each(function () {
            $(this).html(searchDiv[count]);
                count ++;
            });

            $("#dropValues").show();
            $("#" + "_slimscroll-container").removeClass('slimscroll-container__flex');


            //temporary code for claims
            if(tabName && (tabName ==='Claims')){
                count = 0;
            }

            if(count === 0){
                $("#dropValues a").empty();
                $("#empty-message").show();
                $("#searching-message").hide();
                $("#enter-message").hide();
            }else{
                $("#empty-message").hide();
                $("#searching-message").hide();
                $("#enter-message").hide();
            }
    } //end of if(val)
else {
        $("#dropValues a").remove();
        $("#searching-message").hide();
        $("#enter-message").show();
        $("#empty-message").show();
    }
    let temparrDropdown = ""
    for(let i=0; i < $("#dropValues a").length; i++){
        if($("#dropValues a")[i].childNodes.length > 1){
            temparrDropdown = $("#dropValues a")[i].childNodes;
            if($("#dropValues a")[i].childNodes === temparrDropdown){
                $("#dropValues a")[i].remove();
            }
        }
    }


    $( "#myAnchorTag tr.bodyrow .second-td-width" ).on( "click", function() {
        if($( this ).text()){
            callCustData($( this ).text(), $(this).next().text());
        }
        //callCustData($( this ).text(), $(this).next().text());
    });


                
    $( "#myAnchorTag tr.bodyrow .third-td-width" ).on( "click", function() {
        for(i=0; i<arrayList.length; i++){
        list = arrayList[i].split('~');
        
        if($(this).text() == list[0]){
            let data = tabName+"~"+ $( this ).prev().text() +"~"+ list[5]+"~"+"customer";
            
            widgetInputData.eventAPIService.dispatchClickEvent(widgetInputData.mountPointElement, {dataValue: data});
        }
}
        // widgetInputData.printPolicy(tabName+"~"+ $( this ).prev().text() +"~"+ $(this).text()+"~"+" ");
        // let data = tabName+"~"+ $( this ).prev().text() +"~"+ +"~"+"customer";
       
        
    });
    
}
        

function emptyAllTabs(tabs) {
   
    for (let i = 0; i < tabs.length; i++) {
        $("#" + tabs[i]).empty();
        
        $("#empty-message").hide();
        const value = $("#searchInput").val();
            $("#searching-message").hide();
            $("#enter-message").show();
    }
}

function bindClickEventForQuote() {
    const quoteButton = document.getElementById(widgetInputData.uniqueHTMLElementId + "_new-quote");
    if(quoteButton){
        quoteButton.onclick = function () {
        widgetInputData.eventAPIService.dispatchClickEvent(widgetInputData.mountPointElement, {dataValue: 'NewQuote'});
    };
    }
}

function concatObjectValues(PolArr){
console.log("1457 concatObjectValues",PolArr);
    parsedOutputData = [];
    if (PolArr && PolArr !== undefined && PolArr.length > 0){
        //if(parsedOutputData.length > 0){
            //parsedOutputData = [];
        //}
        /* let tempArr = [];
        if(PolArr.length === undefined){ // Checking this since only 1 object if returned does not come in as array. So converting single object into array
            tempArr.push(PolArr);
            PolArr = tempArr;
        } */
        let policyObjLen = PolArr.length;
        if (policyObjLen > 5){
            policyObjLen = 5;
        }
// && PolArr[i]["revisionState"] === "LATEST"
        for (let i = 0; i < PolArr.length; i++) {
            if(PolArr[i]["quotePolicyIndicator"] && (PolArr[i]["quotePolicyIndicator"] === "POLICY" ||  PolArr[i]["quotePolicyIndicator"] === "QUOTE" ) && PolArr[i]["policyNumber"] && PolArr[i]["insuredName"]){
                let policyRevisionNo;
                if(PolArr[i]["policyNumber"]){
                    policyRevisionNo = PolArr[i]["policyNumber"];
                    policyRevisionNo = policyRevisionNo.slice(17, 19);
                }
                let policySplitAddressStr = [];
                if(PolArr[i]["address"]){
                    policySplitAddressStr = PolArr[i]["address"].split(",");
                }
                let entity = PolArr[i].navigations[0].navigationLink.split('&');
                let entityArray = entity[1].split('=');
                let entityReference = entityArray[1];

                let policySplitAddressStrLen = policySplitAddressStr.length;
               // parsedOutputData.push(PolArr[i]["policyNumber"]+"~"+PolArr[i]["customerName"]+"~"+PolArr[i]["address"]+"~"+policySplitAddressStr[policySplitAddressStrLen-1]+"~"+policyRevisionNo+"~"+entityReference);
                parsedOutputData.push(PolArr[i]["policyNumber"]+"~"+PolArr[i]["insuredName"]+"~"+PolArr[i]["address"]+"~"+policySplitAddressStr[policySplitAddressStrLen-1]+"~"+policyRevisionNo+"~"+entityReference);
                //parsedOutputData = parsedOutputData.slice(0,5);
               
            }
        }
        /* for (let i = 0; i < PolArr.length; i++) {
            parsedOutputData.push(PolArr[i]["PolicyNumber"]+"~"+PolArr[i]["InsuredName"]+"~"+PolArr[i]["InsuredAddress"]+"~"+PolArr[i]["Postcode"]+"~"+PolArr[i]["RevisionNo"]);
        } */
        
    }else{
        parsedOutputData = [];
    }
    return parsedOutputData;
}

function concatQuoteObjectValues(quoteObj){
    quoteOutputData = [];
    if (quoteObj && quoteObj !== undefined && quoteObj.length > 0){
        //if(quoteOutputData.length > 0){
            //quoteOutputData = [];
        //}
        //let tempArr;
        /* if(quoteObj.length === undefined){ // Checking this since only 1 object if returned does not come in as array. So converting single object into array
            //tempArr.push(quoteObj);
            //quoteObj = tempArr;
            quoteObj = [];
        } */
        let quoteObjLen = quoteObj.length;
        if (quoteObjLen > 5){
            quoteObjLen = 5;
        }
        
        for (let j = 0; j < quoteObj.length; j++) {
             if(quoteObj[j]["polStatus"] !== "Converted to Policy" && quoteObj[j]["quotePolicyIndicator"] && quoteObj[j]["quotePolicyIndicator"] === "QUOTE" && quoteObj[j]["policyNumber"]){ //&& quoteObj[j]["insuredName"]
  
                let revisionNo;
                if(quoteObj[j]["policyNumber"]){
                    revisionNo = quoteObj[j]["policyNumber"];
                    revisionNo = revisionNo.slice(17, 19);
                }
                let quoteSplitAddressStr = [];
                if(quoteObj[j]["address"]){
                    quoteSplitAddressStr = quoteObj[j]["address"].split(",");
                }
                let navLinkSplitArr;
                let entRefArr;
                let entRef;
                if(quoteObj[j]["navigations"]){
                    navLinkSplitArr = quoteObj[j]["navigations"][0]["navigationLink"].split("&");
                    entRefArr = navLinkSplitArr[1].split("=");
                    entRef = entRefArr[1];
                }
                let splitAddressStrLen = quoteSplitAddressStr.length;
                quoteOutputData.push(quoteObj[j]["policyNumber"]+"~"+quoteObj[j]["insuredName"]+"~"+quoteObj[j]["address"]+"~"+quoteSplitAddressStr[splitAddressStrLen-1]+"~"+revisionNo+"~"+entRef+"~"+quoteObj[j]["polStatus"]);
               // quoteOutputData = quoteOutputData.slice(0, 5);
            }
            //quoteOutputData.push(quoteObj[j]["PolicyNumber"]+"~"+quoteObj[j]["InsuredName"]+"~"+quoteObj[j]["InsuredAddress"]+"~"+quoteObj[j]["Postcode"]+"~"+quoteObj[j]["RevisionNo"]+"~"+quoteObj[j]["EntityReferenceNumber"]+"~"+quoteObj[j]["PolStatus"]);
        }
    }
    return quoteOutputData;
}

function concatCustomerObjectValues(custObj){
    custOutputData = [];
    if (custObj && custObj !== undefined && custObj.length > 0){
        //if(custOutputData.length > 0){
            //custOutputData = [];
        //}
        /* let tempArr = [];
        if(custObj.length === undefined){ // Checking this since only 1 object if returned does not come in as array. So converting single object into array
            tempArr.push(custObj);
            custObj = tempArr;
        } */
        let CustObjLen = custObj.length;
        if (CustObjLen > 5){
            CustObjLen = 5;
        }
        for (let k = 0; k < custObj.length ; k++) {
            if(custObj[k]["policyNumber"] && custObj[k]["insuredName"]){
                let revisionNo = custObj[k]["policyNumber"];
                revisionNo = revisionNo.slice(17, 19);
                let splitAddressStr = [];
                if(custObj[k]["address"]){
                    splitAddressStr = custObj[k]["address"].split(",");
                }
                let splitAddressStrLen = splitAddressStr.length;
                custOutputData.push(custObj[k]["policyNumber"]+"~"+custObj[k]["insuredName"]+"~"+custObj[k]["address"]+"~"+splitAddressStr[splitAddressStrLen-1]+"~"+revisionNo);
                //custOutputData = custOutputData.slice(0,5);
            }
        }
        /* for (let k = 0; k < custObj.length; k++) {
            custOutputData.push(custObj[k]["PolicyNumber"]+"~"+custObj[k]["InsuredName"]+"~"+custObj[k]["InsuredAddress"]+"~"+custObj[k]["Postcode"]+"~"+custObj[k]["RevisionNo"]);
        } */
    }
    return custOutputData;
}
function concatClaimsObjectValues(claimsObj){
    claimsOutputData = [];
    if (claimsObj && claimsObj !== undefined && claimsObj.length > 0){
        let claimsObjLen = claimsObj.length;
        if (claimsObjLen > 5){
            claimsObjLen = 5;
        }
        for (let l = 0; l < claimsObj.length; l++) {
            claimsOutputData.push(claimsObj[l]["PolicyNumber"]+"~"+claimsObj[l]["ClaimNumber"]+"~"+claimsObj[l]["LossDate"]+"~"+claimsObj[l]["ClaimStatus"]+"~"+claimsObj[l]["FirstName"]+"~"+claimsObj[l]["LastName"]+"~"+claimsObj[l]["InsuredFullName"]);
            //claimsOutputData.push(claimsObj[l]["PolicyNumber"]+"~"+claimsObj[l]["ClaimNumber"]);
        }
       // claimsOutputData = claimsOutputData.slice(0, 5);
    }
    else{
        claimsOutputData=[];
    }
    return claimsOutputData;
}

/**
 * This function will start listening for snowflake property change for this widget
 */
function listenForSnowflakeChanges() {
    if(this.widgetInputData.iceMode === "RUNTIME" && this.widgetInputData.messageBusService) {
        this.widgetInputData.messageBusService.getClientSnowflakeExecutionTopicSubject().subscribe(function(propertyExecuted) {
        // Match for CR id
            if(_.has(propertyExecuted, 'containerRelationId') && propertyExecuted.containerRelationId === this.widgetInputData.parentContainerRelationState.id) {
 
                switch(propertyExecuted.propertyName) {
                    case 'HIDDEN': {
                        this.setHiddenOnWidget();
                        break;
                    }
                    case 'UPDATABLE': {
                        this.setUpdatableOnWidget();
                        break;
                    }
                }
            }
        }.bind(this));
    }
}

function setHiddenOnWidget() {

    if(this.widgetInputData.widgetProperties.HIDDEN === "Y") {
        $("#"+this.widgetInputData.uniqueHTMLElementId+"_main_container").hide();
    } else {
        $("#"+this.widgetInputData.uniqueHTMLElementId+"_main_container").show();
    }
}
function setUpdatableOnWidget() {
    if(this.widgetInputData.widgetProperties.HIDDEN === "Y") {
        $("#"+this.widgetInputData.uniqueHTMLElementId+"_main_container").prop( "disabled", true );
    } else {
        $("#"+this.widgetInputData.uniqueHTMLElementId+"_main_container").prop( "disabled", false );
    }
}


/**
* This function is called when any property is updated after client logic execution for this component.
* 
* e.g. changedData = [{ type: 'PROPERTY', name: 'UPDATABLE', value: 'N' }]
* type: Identifies what has changed
* name: Name of property which has changed (if type is 'PROPERTY')
* value: Final value after change
* 
* @param {IChangedData} changedData: Object received by this function. It includes information regarding change which triggered this function call.
* 
*/
function dgOnChange(changedData) {

}

/**
* This function will be called when component is removed from DOM.
*/
function dgOnDestroy() {

}