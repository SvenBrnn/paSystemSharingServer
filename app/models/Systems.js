
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * User Schema
 */
var SystemSchema = new Schema({
    creator: {type: String},
    date_created: {type: Date, default: Date.now },
    ip: {type: String},
    name: {type: String},
    numPlanets: {type: Number},
    system: {type: Schema.Types.Mixed}
});

mongoose.model('System', SystemSchema);