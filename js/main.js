$(document).ready(function () {
    //suggested here http://stackoverflow.com/a/14166308/49359
    $.getJSON('data.json', null)
    .done(function (data) {
    
        var lawNames = [];
        var lawIds = {};

        $.each(data, function (index, law)
            {
                lawNames.push(law.offense);
                lawIds[law.offense] = law.max_sentence;
            });

        $('#selectr').typeahead({
            items: 6,
            source: lawNames
        });

        $('#selectr').change(function () {alert(lawIds[$('#selectr').val()]); });
    });
        
});
