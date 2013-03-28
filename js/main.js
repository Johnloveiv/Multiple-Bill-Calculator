// Check if a new cache is available on page load.
window.addEventListener('load', function () {

    window.applicationCache.addEventListener('updateready', function () {
        if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
        // Browser downloaded a new app cache.
        // Swap it in and reload the page to get the new code.
            window.applicationCache.swapCache();
            if (confirm('A new version of this Multiple Bill Calculator is available. Load it?')) {
                window.location.reload();
            }
        }
        else {
        // Manifest didn't changed. Nothing new to server.
        }
    }, false);

}, false);

$(document).ready(function () {
    //suggested here http://stackoverflow.com/a/14166308/49359
    $.getJSON('data/data.json', null)
    .done(function (data) {

        var lawNames = [];
        var lawIds = {};

        $.each(data, function (index, law)
            {
                lawNames.push(law.offense);
                lawIds[law.offense] = law.max_sentence;
            });

        $('#selectr').typeahead({
            items: 8,
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
            var answerData = {};                       //template data in json
            var answer;                                //compiled template
            var monthVal;                              //number of months on min sentence
            var yearVal;                               //number of years on min sentence
            var sexMonthVal;                           //sex offdr: number of months on min sentence
            var sexYearVal;                            //sex offdr: number of years on min sentence
            var monthTxt;                              //string, "month" or "months"
            var yearTxt;                               //string, "year" or "years"
            var sexMonthTxt;                           //sex offdr: string, "month" or "months"
            var sexYearTxt;                            //sex offdr: string, "year" or "years"

            //If max sentence is a number, do the math
            if ($.isNumeric(maxStnc)) {
                var maxStncMnths = maxStnc * 12;
                var rangeMin; //integer, computed min sentence
                var rangeMax; //integer, computed max sentence
                var sexMin = null; //special calculation for sex offenders on a double
                var sexMax = null; //special calculation for sex offenders on a double
                var billStatus = $('input[name="billStatus"]').val().toLowerCase();
                var fraction;

                switch (billStatus) {
                case 'double':
                    fraction = 'one-half';
                    if (maxStnc % 2 == 0){ //if max sentence divides evenly
                        rangeMin = maxStnc / 2 + ' years';
                    }
                    else {
                        if (maxStncMnths > 12) {
                            monthVal = (maxStncMnths / 2) % 12;
                            yearVal = Math.floor(maxStnc / 2);
                            monthTxt = (monthVal > 1) ? 'months' : 'month';
                            yearTxt = (yearVal > 1) ? 'years' : 'year';
                            rangeMin =  yearVal + ' ' +  yearTxt + ', '  + monthVal + ' ' +  monthTxt;
                        }
                        else {
                            rangeMin = maxStncMnths / 2 + ' months';
                        }
                    }
                    rangeMax = maxStnc * 2 + ' years';

                    //Now do a special calc for doubles who are sex offenders
                    if (maxStnc % 3 == 0) { //if max sentence divides evenly
                        sexMin = (maxStnc / 3) * 2  + ' years'; // 2/3 the max
                    }
                    else {
                        if (maxStncMnths > 12) {
                            sexMonthVal = (maxStncMnths / 3 * 2) % 12;
                            sexYearVal = Math.floor(maxStnc / 3 * 2);
                            sexMonthTxt = (sexMonthVal > 1) ? 'months' : 'month';
                            sexYearTxt = (sexYearVal > 1) ? 'years' : 'year';
                            sexMin =  sexYearVal + ' ' +  sexYearTxt + ', '  + sexMonthVal + ' ' +  sexMonthTxt;
                        }
                        else {
                            sexMin = (maxStncMnths / 3) * 2 + ' months';
                        }
                    }
                    sexMax = maxStnc * 3 + ' years'; //triple
                    answerData.double = 'true';
                    break;
                case 'triple':
                    fraction = 'two-thirds';
                    if (maxStnc % 3 == 0) { //if max sentence divides evenly
                        rangeMin = (maxStnc / 3) * 2  + ' years'; // 2/3 the max
                        rangeMax = maxStnc * 2 + ' years';
                    }
                    else {
                        if (maxStncMnths > 12) {
                            monthVal = (maxStncMnths / 3 * 2) % 12;
                            yearVal = Math.floor(maxStnc / 3 * 2);
                            monthTxt = (monthVal > 1) ? 'months' : 'month';
                            yearTxt = (yearVal > 1) ? 'years' : 'year';
                            rangeMin =  yearVal + ' ' +  yearTxt + ', '  + monthVal + ' ' +  monthTxt;
                        }
                        else {
                            rangeMin = (maxStncMnths / 3) * 2 + ' months';
                        }
                        rangeMax = maxStnc * 2 + ' years';
                    }
                    answerData.triple = 'true';
                    break;
                case 'quad':
                    if (maxStnc < 20) {
                        rangeMin = '20 years';
                    }
                    else {
                        rangeMin = maxStnc + ' years';
                    }
                    rangeMax = 'life';
                    answerData.quad = 'true';
                    break;
                }

                //Try to create a logic that tells us if we need to put in a caveat
                var caveatTriggers = ['battery', 'murder', 'manslaughter', 'AIDS', 'harmful', 'rape', 'assault', 'kidnapping', 'arson', 'aggravated', 'robbery', 'extortion', 'purse', 'disarming', 'invasion', 'trafficking', 'cruelty', 'terrorism', 'dangerous', 'stalking', 'incest', 'nature', 'carnal', 'indecent', 'pornography', 'molestation', 'solicitation', 'sexual', 'delinquency', 'voyeurism'];
                var triggerWord = false;
                var parts = offenseTxt.split(' ');
                $.each(parts, function (index, value) {
                    if ($.inArray(value.toLowerCase(), caveatTriggers) > -1) {
                        triggerWord = true;
                    }
                });

                if (triggerWord || maxStnc >= 10) {
                    $.extend(answerData, {'caveat': true});
                }

                $.extend(answerData, {'rangeMin': rangeMin, 'rangeMax': rangeMax,
                'offense': offenseTxt, 'fraction': fraction, 'stncMax': maxStnc,
                'billStatus': billStatus, 'sexMin': sexMin, 'sexMax': sexMax});
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
