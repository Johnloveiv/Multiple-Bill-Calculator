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

        $('.btn').click(function () {

            if ($('#selectr').val() === '') {
                alert('Please select an offense');
                return;
            }

            var maxStnc = lawIds[$('#selectr').val()];
            var offenseTxt = $('#selectr').val();

            if ($.isNumeric(maxStnc)) {
                var maxStncMnths = maxStnc * 12;
                var rangeMin;
                var rangeMax;
                var billStatus = $('input[name="billStatus"]').val();
                switch (billStatus) {
                    case 'Double':
                        rangeMin = maxStncMnths / 2;
                        rangeMax = maxStncMnths * 2;
                        break;
                    case 'Triple':
                        rangeMin = maxStncMnths / 2/3;
                        rangeMax = maxStncMnths * 2;
                        break;
                    case 'Quad':
                        // code
                        break;
                    default:

                }
                //alert('range is ' + rangeMin + ' months to ' + rangeMax + ' months');
                var source   = $('#answer-template').html();
                var template = Handlebars.compile(source);
                var answerData = {'rangeMin': rangeMin, 'rangeMax': rangeMax,
                'offense': offenseTxt, 'stncMax': maxStnc };
                var answer = template(answerData);
                $('.answer').html(answer).show();
            }
            else {
                alert(maxStnc);
            }
        });
    });

    $('.bill-status-select button').click(function () {
        $('input[name="billStatus"]').val($(this).text());
    });
});
