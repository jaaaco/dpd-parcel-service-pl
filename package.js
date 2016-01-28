Package.describe({
  name: 'jaaaco:dpd-parcel-service-pl',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Meteor package to communicate with DPD Poland API',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/jaaaco/dpd-parcel-service-pl.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.addFiles('lib/dpd.js');

  api.export('DPD','server');
});

Npm.depends({
  xml2js: "0.4.16",
  request: "2.69.0"
});


