const denodeify = require('es6-denodeify')(Promise)
PromiseMeteorCall = denodeify(Meteor.call)
PromiseHTTPCall = denodeify(HTTP.call)
