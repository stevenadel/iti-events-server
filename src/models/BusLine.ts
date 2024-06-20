import mongoose from 'mongoose';

const { Schema } = mongoose;

const BusLineSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    capacity: {
        type: Number,
        required: true,
        min: 5
    },
    busPoints: [{
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        },
        time: {
            type: Date,
            required: true
        }
    }]
});

const BusLine = mongoose.model('BusLine', BusLineSchema);
export default BusLine;
