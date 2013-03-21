//if (Modernizr.localstorage) {
//  // window.localStorage is available!
//  console.log('yes');
//} else {
//  // no native support for HTML5 storage :(
//  // maybe try dojox.storage or a third-party solution
//  console.log('no');
//}
$(document).ready(function(){
//suggested here http://stackoverflow.com/a/14166308/49359
        var jsonData =[{"id":"5","name":"Theft"},{"id":"15","name":"Theft 2nd Offense"},{"id":"20","name":"Theft 3rd Offense"},{"id":"25","name":"Arson"}]; 
        var productNames = [];
        var productIds = {};
        $.each( jsonData, function ( index, product )
        {
            productNames.push( product.name );
            productIds[product.name] = product.id;
        } );
        
        $('#selectr').typeahead({
            items: 4,
            source:productNames
        });
        $('#selectr').change(function(){alert(productIds[$( '#selectr' ).val()]);});

       //some more experiments
       var myData = [{"id": 1,"username": "judson","password": "801fcdf33e4c8938a082302e297a299a","email": "jmitchel@loyno.edu"}, {"id": 4,"username": "bquigley","password": "4035258f82f03b2e5d8f7afabecb912a","email": "quigley@loyno.edu"}, {"id": 5,"username": "lmolina","password": "4035258f82f03b2e5d8f7afabecb912a","email": "molina@loyno.edu"}, {"id": 6,"username": "jmitchell","password": "801fcdf33e4c8938a082302e297a299a","email": "jud@lusher.org"}, {"id": 7,"username": "jmitchell","password": "801fcdf33e4c8938a082302e297a299a","email": "jud@lusher.org"}, {"id": 8,"username": "Michael","password": "9847e538bd4ebe75bb42c02f254c0f3c","email": "matassin@loyno.edu"}, {"id": 9,"username": "Michael","password": "9847e538bd4ebe75bb42c02f254c0f3c","email": "matassin@loyno.edu"}];
       // Lawnchair(function(){
       //     //this.save(myData);
       //     //this.nuke();
       //     this.keys(function(keys) {
       //             keys.foreach(console.log);
       //     });
       // });

        var db = Lawnchair({name: 'loyola'},function(e){
            console.log('storage open');
            //this.nuke();
            //this.batch(myData);
            });
       
        //var data = $.parseJSON(myData);
        //console.log(data);
       // db.save(myData);
        //var name = "";
        //db.get(1, function(obj){
        //        name = obj.value;
        //        console.log(name);
        //});
        db.get(57,function(obj){
            console.log(obj.email);
        });
        //db.all(function(r){
        //    var n = this.where('this.username === "judson"');
        //    console.log(n.email);
        //});
        db.where("record.username = 'bquigley'", function(results) {
            console.log('got ' + results.length + ' results');
        });
});
