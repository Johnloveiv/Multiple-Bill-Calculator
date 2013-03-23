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

            //If max sentence is a number, do the math
            if ($.isNumeric(maxStnc)) {
                var maxStncMnths = maxStnc * 12;
                var rangeMin; //computed min sentence
                var rangeMax; //computed max sentence
                var billStatus = $('input[name="billStatus"]').val().toLowerCase();
                var fraction; 
                switch (billStatus) {
                case 'double':
                    fraction = 'one half';
                    if (maxStnc % 2 == 0){ //max sentence divides evenly
                        rangeMin = maxStnc / 2 + ' years';
                        rangeMax = maxStnc * 2 + ' years';
                    }
                    else {
                        rangeMin = maxStncMnths / 2 + ' months';
                        rangeMax = maxStnc * 2 + ' years';
                    }
                    break;
                case 'triple':
                    fraction = 'two-thirds';
                    if (maxStnc % 3 == 0){ //max sentence divides evenly
                        rangeMin = (maxStnc / 3) * 2  + ' years'; // 2/3 the max
                        rangeMax = maxStnc * 2 + ' years';
                    }
                    else {
                        rangeMin = (maxStncMnths / 3) * 2 + ' months';
                        rangeMax = maxStnc * 2 + ' years';
                    }
                    break;
                case 'quad':
                    // code
                    break;
                default:

                }
                //alert('range is ' + rangeMin + ' months to ' + rangeMax + ' months');
                var source   = $('#answer-template').html();
                var template = Handlebars.compile(source);
                var answerData = {'rangeMin': rangeMin, 'rangeMax': rangeMax,
                'offense': offenseTxt, 'fraction': fraction, 'stncMax': maxStnc, 'billStatus': billStatus };
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

    $('div.answer').on('click', 'button', function () {
        $('#selectr').val('');
        $('.bill-status-select button').removeClass('active');
        $('.answer').hide();
    });
});
