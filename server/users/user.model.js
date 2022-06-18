const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    email: { type: String, unique: true, required: true },
    hash: { type: String, required: true },
    study: { type: Boolean, unique: false, required: false },
    createdDate: { type: Date, default: Date.now }
});

accountSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('account', accountSchema);