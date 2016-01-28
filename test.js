var DPD = require('./package/index.js'); // nodejs only

var dpd = new DPD('xxx','xxx','xxx'); // testmode is default = true

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