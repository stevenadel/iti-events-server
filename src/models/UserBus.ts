const mongoose = require('mongoose');
const { Schema } = mongoose;

const busUserSchema = new mongoose.Schema({
    busLineId: {
        type: Schema.Types.ObjectId,
        ref: 'BusLine',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const BusUser = mongoose.model('BusUser', busUserSchema);

export default BusUser;
