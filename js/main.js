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

        $('.bill-status-select .btn').click(function () {

            if ($('#selectr').val() === '') {
                alert('Please select an offense');
                return;
            }

            var maxStnc = lawIds[$('#selectr').val()]; //integer, maximum sentence
            var offenseTxt = $('#selectr').val();      //string, title of offense
            var source = $('#answer-template').html(); //location of handlebars template
            var template = Handlebars.compile(source); //handlebars template
            var answerData;                            //template data in json
            var answer;                                //compiled template
            var monthVal;                              //number of months on min sentence
            var yearVal;                               //number of years on min sentence
            var monthTxt;                              //string, "month" or "months"
            var yearTxt;                               //string, "year" or "years"

            //If max sentence is a number, do the math
            if ($.isNumeric(maxStnc)) {
                var maxStncMnths = maxStnc * 12;
                var rangeMin; //integer, computed min sentence
                var rangeMax; //integer, computed max sentence
                var billStatus = $('input[name="billStatus"]').val().toLowerCase();
                var fraction;

                switch (billStatus) {
                case 'double':
                    fraction = 'one-half';
                    if (maxStnc % 2 == 0){ //if max sentence divides evenly
                        rangeMin = maxStnc / 2 + ' years';
                        rangeMax = maxStnc * 2 + ' years';
                    }
                    else {
                        if (maxStncMnths > 12)
                        {
                            monthVal = (maxStncMnths / 2) % 12;
                            yearVal = Math.floor(maxStnc / 2);
                            monthTxt = (monthVal > 1) ? 'months' : 'month';
                            yearTxt = (yearVal > 1) ? 'years' : 'year';
                            rangeMin =  yearVal + ' ' +  yearTxt + ', '  + monthVal + ' ' +  monthTxt;
                        }
                        else
                        {
                            rangeMin = maxStncMnths / 2 + ' months';
                        }
                        rangeMax = maxStnc * 2 + ' years';
                    }
                    break;
                case 'triple':
                    fraction = 'two-thirds';
                    if (maxStnc % 3 == 0){ //if max sentence divides evenly
                        rangeMin = (maxStnc / 3) * 2  + ' years'; // 2/3 the max
                        rangeMax = maxStnc * 2 + ' years';
                    }
                    else {
                        if (maxStncMnths > 12)
                        {
                            monthVal = (maxStncMnths / 3 * 2) % 12;
                            yearVal = Math.floor(maxStnc / 3 * 2);
                            monthTxt = (monthVal > 1) ? 'months' : 'month';
                            yearTxt = (yearVal > 1) ? 'years' : 'year';
                            rangeMin =  yearVal + ' ' +  yearTxt + ', '  + monthVal + ' ' +  monthTxt;
                        }
                        else
                        {
                            rangeMin = (maxStncMnths / 3) * 2 + ' months';
                        }
                        rangeMax = maxStnc * 2 + ' years';
                    }
                    break;
                case 'quad':
                    // code
                    break;
                default:

                }
                answerData = {'rangeMin': rangeMin, 'rangeMax': rangeMax,
                'offense': offenseTxt, 'fraction': fraction, 'stncMax': maxStnc, 'billStatus': billStatus };
                answer = template(answerData);
                $('.answer').html(answer).show();
            }
            else {
                answerData = {'noNumber': maxStnc, 'offense': offenseTxt };
                answer = template(answerData);
                $('.answer').html(answer).show();
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
