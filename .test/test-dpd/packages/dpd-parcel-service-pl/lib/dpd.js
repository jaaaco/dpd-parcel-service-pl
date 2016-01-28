DPD = class DPD {
    constructor(login, password, fid, testmode = true) {
        this.login = login;
        this.password = password;
        this.fid = fid;
        this.testmode = testmode;
        this.lastRequest = '';
        this.lastResponse = '';
    }

    call(method, args, callback) {

        let request = Npm.require('request'),
            xml2js = Npm.require('xml2js'),
            envelope = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' +
            'xmlns:dpd="http://dpdservices.dpd.com.pl/">    ' +
            '<soapenv:Header/><soapenv:Body>' +
            '<dpd:$METHOD> <authDataV1><login>$LOGIN</login><masterFid>$MASTERFID</masterFid><password>$PASSWORD</password> </authDataV1>' +
            '$DATA ' +
            '</dpd:$METHOD> ' +
            '</soapenv:Body></soapenv:Envelope>',
            xml,
            data;

        let builder = new xml2js.Builder({
            explicitRoot: false,
            headless: true
        });

        data = builder.buildObject(args);

        xml = envelope.replace('$DATA', data)
            .replace('$METHOD', method)
            .replace('$METHOD', method)
            .replace('$LOGIN', this.login)
            .replace('$MASTERFID', this.fid)
            .replace('$PASSWORD', this.password);


        this.lastRequest = xml;
        console.log('xml', xml);

        let soapOptions = {
            uri: this.testmode ? 'https://dpdservicesdemo.dpd.com.pl/DPDPackageObjServicesService/DPDPackageObjServices'
            : 'https://dpdservices.dpd.com.pl/DPDPackageObjServicesService/DPDPackageObjServices',
            headers: {
                'Content-Type': 'text/xml',
                'charset': 'utf-8',
                'Content-Length': xml.length.toString(),
                'SOAPAction': '',
                'Host': 'myserver.com',
                'Connection': 'keep-alive'
            },
            method: 'POST',
            body: xml,
            strictSSL: false,
            rejectUnauthorized: false
        };

        request(soapOptions, (err, result) => {
            if (err) {
                callback(err);
            } else {
                this.lastResponse = result.body;

                let parseString = xml2js.parseString;
                parseString(result.body, function (err, result) {
                    if (err) {
                        return callback(err);
                    } else {
                        return callback(false, dot(result, 'S:Envelope.S:Body.0.ns2:'+method+'Response.0.return.0'));
                    }
                });
            }
        });
    }
};