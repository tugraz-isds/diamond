const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardSortTestSchema = new Schema({
    name: { type: String, unique: false, required: true },
    password: { type: String, unique: false, required: false },
    launched: { type: Boolean, unique: false, required: true },
    id: { type: String, unique: true, required: true },
    createdDate: { type: Date, default: Date.now },
    cards: { type: Array, required: true },
    user: { type: String, unique: false, required: true },
    welcomeMessage: { type: String, unique: false, required: false },
    instructions: { type: String, unique: false, required: false },
    explanation: { type: String, unique: false, required: false },
    thankYouScreen: { type: String, unique: false, required: false },
    leaveFeedback: { type: String, unique: false, required: false },
    subCategories: { type: Boolean, unique: false, required: false },
});

cardSortTestSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('CardSortTest', cardSortTestSchema);
