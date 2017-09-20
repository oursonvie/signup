const denodeify = require('es6-denodeify')(Promise)
PromiseMeteorCall = denodeify(Meteor.call)
