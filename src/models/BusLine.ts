import mongoose from 'mongoose';

const { Schema } = mongoose;



const BusLineSchema = new Schema({
    driverID: {
        type: Schema.Types.ObjectId,
        ref: 'Driver'
    },
    busPhoto: {
        type: String,
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
    departureTime: {
        type: Date,
        required: true
    },
    arrivalTime: {
        type: Date,
        required: true
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
        }
    }]
});

const BusLine = mongoose.model('BusLine', BusLineSchema);
export default BusLine;


//userBus Schema
