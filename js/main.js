//if (Modernizr.localstorage) {
//  // window.localStorage is available!
//  console.log('yes');
//} else {
//  // no native support for HTML5 storage :(
//  // maybe try dojox.storage or a third-party solution
//  console.log('no');
//}
$(document).ready(function () {
//suggested here http://stackoverflow.com/a/14166308/49359
        //var jsonData =[{"id":"5","name":"Theft"},{"id":"15","name":"Theft 2nd Offense"},{"id":"20","name":"Theft 3rd Offense"},{"id":"25","name":"Arson"}]; 
        $.ajax({
            url: 'data.json', 
            dataType: 'json', 
        })
        .done(function (data) {
        
            var productNames = [];
            var productIds = {};
            $.each(data, function (index, product)
                {
                    productNames.push(product.max_sentence);
                    productIds[product.name] = product.offense;
                });

            $('#selectr').typeahead({
                items: 4,
                source: productNames
            });
        });
        
        
        $('#selectr').change(function(){alert(productIds[$( '#selectr' ).val()]);});
        //`$('#selectr').typeahead({
        //`    source: function (query, process) {
        //`        var laws = [];
        //`        var map = {};
        //`        return $.ajax({
        //`            url: $(this)[0].$element[0].dataset.link,
        //`            type: 'get',
        //`            data: {query: query},
        //`            dataType: 'json',
        //`            success: function (json) {
        //`                //return typeof json.options == 'undefined' ? false : process(json.options);
        //`                $.each(json, function (i, law) {
        //`                    map[law.offense] = law;
        //`                    laws.push(law.offense);
        //`                });

        //`                process(laws);
        //`            }
        //`        });
        //`    }
        //`});

});
