Meteor.methods({
    test: function(login,password,fid) {

        var dpd = new DPD(login,password,fid);

        dpd.call('findPostalCodeV1',{
            postalCodeV1: {
                countryCode: 'PL',
                zipCode: '51166'
            }
        },function(err, result){
            if (err) {
                console.log('Error', err);
            } else {
                console.log('findPostalCodeV1', result);
            }
        });


        dpd.call('getCourierOrderAvailabilityV1',{
            senderPlaceV1: {
                countryCode: 'PL',
                zipCode: '51166'
            }
        },function(err, result){
            // console.log('lastRequest', dpd.lastRequest);
            // console.log('lastResponse', dpd.lastResponse);

            if (err) {
            } else {

                console.log('CourierOrderAvailability', result);

                result.ranges.forEach(function(range){
                    console.log('range: ', range);
                });
            }
        });
    }
});
