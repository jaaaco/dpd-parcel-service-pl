"use strict";

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

        this.lastRequest = '';
        this.lastResponse = '';

        let request = Npm.require('request'),
            xml2js = Npm.require('xml2js'),
            envelope = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' +
            'xmlns:dpd="http://dpdservices.dpd.com.pl/">    ' + "\n" +
            '<soapenv:Header/><soapenv:Body>' +
            '' +
            '$DATA ' +

            '</soapenv:Body>'+"\n"+'</soapenv:Envelope>',
            xml,
            data;

        args = _.extend(args,{authDataV1: {
            login: this.login,
            masterFid: this.fid,
            password: this.password
        }});

        let builder = new xml2js.Builder({
            explicitRoot: false,
            rootName: 'dpd:' + method,
            headless: true
        });

        // change object to XML
        data = builder.buildObject(args);

        xml = envelope.replace('$DATA', data)
            .replace('$METHOD', method)
            .replace('$METHOD', method)
            .replace('$LOGIN', this.login)
            .replace('$MASTERFID', this.fid)
            .replace('$PASSWORD', this.password);

        xml = xml.replace(/(\r\n|\n|\r)/gm,"");

        this.lastRequest = xml;

        let soapOptions = {
            uri: this.testmode ? 'https://dpdservicesdemo.dpd.com.pl/DPDPackageObjServicesService/DPDPackageObjServices'
            : 'https://dpdservices.dpd.com.pl/DPDPackageObjServicesService/DPDPackageObjServices',
            headers: {
                'Content-Type': 'text/xml',
                'charset': 'utf-8',
                'SOAPAction': ''
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

                // change XML response to object
                parseString(result.body, (err, result) => {
                    if (err) {
                        return callback(err);
                    } else {
                        let body = dot(result, 'S:Envelope.S:Body');

                        if (body) {
                            if (dot(body,'0.S:Fault')) {
                                callback({
                                    faultcode: dot(body,'0.S:Fault.0.faultcode.0'),
                                    faultstring: dot(body,'0.S:Fault.0.faultstring.0'),
                                    detail: dot(body,'0.S:Fault.0.detail.0')
                                });
                            } else {
                                return callback(false, dot(result, 'S:Envelope.S:Body.0.ns2:'+method+'Response.0.return.0'));
                            }
                        } else {
                            callback('NO_BODY', result);
                        }
                    }
                });
            }
        });
    }
};