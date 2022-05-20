const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardSortResultSchema = new Schema({
    id: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    results: { type: Array, required: true },
    finished: { type: Boolean, unique: false, required: false },
    username: { type: String, required: true },
    timestamp: { type: String, required: true },
    mindset: { type: String, required: false},
    feedback: { type: String, required: false },
});

cardSortResultSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('CardSortResult', cardSortResultSchema);
