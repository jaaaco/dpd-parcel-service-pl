"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DPD = exports.DPD = function () {
    function DPD(login, password, fid) {
        var testmode = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

        _classCallCheck(this, DPD);

        this.login = login;
        this.password = password;
        this.fid = fid;
        this.testmode = testmode;
        this.lastRequest = '';
        this.lastResponse = '';
    }

    _createClass(DPD, [{
        key: 'call',
        value: function call(method, args, callback) {
            var _this = this;

            this.lastRequest = '';
            this.lastResponse = '';

            var request = Npm.require('request'),
                xml2js = Npm.require('xml2js'),
                envelope = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' + 'xmlns:dpd="http://dpdservices.dpd.com.pl/">    ' + '<soapenv:Header/><soapenv:Body>' + '<dpd:$METHOD> <authDataV1><login>$LOGIN</login><masterFid>$MASTERFID</masterFid><password>$PASSWORD</password> </authDataV1>' + '$DATA ' + '</dpd:$METHOD> ' + '</soapenv:Body></soapenv:Envelope>',
                xml = undefined,
                data = undefined;

            var builder = new xml2js.Builder({
                explicitRoot: false,
                headless: true
            });

            // change object to XML
            data = builder.buildObject(args);

            xml = envelope.replace('$DATA', data).replace('$METHOD', method).replace('$METHOD', method).replace('$LOGIN', this.login).replace('$MASTERFID', this.fid).replace('$PASSWORD', this.password);

            this.lastRequest = xml;

            var soapOptions = {
                uri: this.testmode ? 'https://dpdservicesdemo.dpd.com.pl/DPDPackageObjServicesService/DPDPackageObjServices' : 'https://dpdservices.dpd.com.pl/DPDPackageObjServicesService/DPDPackageObjServices',
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

            request(soapOptions, function (err, result) {
                if (err) {
                    callback(err);
                } else {
                    _this.lastResponse = result.body;

                    var parseString = xml2js.parseString;

                    // change XML response to object
                    parseString(result.body, function (err, result) {
                        if (err) {
                            return callback(err);
                        } else {
                            var body = dot(result, 'S:Envelope.S:Body');

                            if (body) {
                                if (dot(body, '0.S:Fault')) {
                                    callback({
                                        faultcode: dot(body, '0.S:Fault.0.faultcode.0'),
                                        faultstring: dot(body, '0.S:Fault.0.faultstring.0'),
                                        detail: dot(body, '0.S:Fault.0.detail.0')
                                    });
                                } else {
                                    return callback(false, dot(result, 'S:Envelope.S:Body.0.ns2:' + method + 'Response.0.return.0'));
                                }
                            } else {
                                callback('NO_BODY', result);
                            }
                        }
                    });
                }
            });
        }
    }]);

    return DPD;
}();

;