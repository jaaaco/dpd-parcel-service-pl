Meteor.methods({
    generatePackagesNumbers: function (deliveries) {
        var counter = 0;
        var dpd = new DPD('test', 'KqvsoFLT2M', '1495');
        dpd.call('generatePackagesNumbersV1', {

            packages: {
                parcels: {
                    content: 'Srubeczki',
                    sizeX: '1.2',
                    sizeY: '1.3',
                    sizeZ: '1.4',
                    weight: '1.0',
                },
                payerType: 'SENDER',
                receiver: {
                    adress: 'Planowa 13B/18',
                    city: 'Wrocław',
                    company: 'Magazyn De Dietrich',
                    countryCode: 'PL',
                    email: 'asdasdasd@op.pl',
                    fid: '1245',
                    name: 'Tomas Karpa',
                    phone: '562346321',
                    postalCode: '02495'
                },
                sender: {
                    adress: 'Planowa 13B/18',
                    city: 'Wrocław',
                    company: 'Magazyn De Dietrich',
                    countryCode: 'PL',
                    email: 'asdasdasd@op.pl',
                    fid: '1245',
                    name: 'Tomas Karpa',
                    phone: '562346321',
                    postalCode: '02495'
                }
            }


        }, function (err, result) {
            console.log(dpd.lastRequest);

            if (err) {
                console.log('Blad', err);
            } else {
                console.log("Wynik generowania numeru przesylki", result);
            }
        });
    },

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
