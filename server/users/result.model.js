const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resultSchema = new Schema({
    id: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    results: { type: Array, required: true },
    finished: { type: Boolean, unique: false, required: false },
    username: { type: String, required: true },
    timestamp: { type: String, required: true },
    feedback: { type: String, required: false },
});

resultSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Result', resultSchema);