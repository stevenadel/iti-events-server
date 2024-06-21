import mongoose from 'mongoose';

const { Schema } = mongoose;



const BusLineSchema = new Schema({
    driverID: {
        type: Schema.Types.ObjectId,
        ref: 'Driver'
    },
    busCode: {
        type: String,
        required: true,
    },
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
        name: {
            type: String,
            required: true,
            trim: true
        },
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        },
        pickupTime: {
            type: Date,
            required: true
        },
        departureTime: {
            type: Date,
            required: true
        }
    }]
});

const BusLine = mongoose.model('BusLine', BusLineSchema);
export default BusLine;
