Meteor.methods({
    test: function() {

        var dpd = new DPD('test','KqvsoFLT2M','1495');

        dpd.call('findPostalCodeV1',{
            postalCodeV1: {
                countryCode: 'PL',
                zipCode: '58100'
            }
        },function(err, result){
            if (err) {
                console.log('Błąd', err);
            } else {
                console.log(result);
            }
        });


        dpd.call('getCourierOrderAvailabilityV1',{
            senderPlaceV1: {
                countryCode: 'PL',
                zipCode: '58100'
            }
        },function(err, result){
            if (err) {
                console.log('Błąd', err);
            } else {
                console.log('lastRequest', dpd.lastRequest);
                console.log('lastResponse', dpd.lastResponse);
                console.log('Dostpępność kuriera', result);
                //result.ranges.forEach(function(range){
                //    console.log('range: ', range);
                //});
            }
        });



    }
});