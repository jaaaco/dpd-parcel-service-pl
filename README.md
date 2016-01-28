Polish DPD Parcell Service API Wrapper
==============================================================================
## Installation

```shell
meteor add jaaaco:dpd-parcel-service-pl
```

## Basic usage

```javascript

var dpd = new DPD(login,password,fid,testmode); // testmode is default = true

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

```

## Examples
Check out testApp/server/methods.js for more 