import mongoose from "mongoose";

const { Schema } = mongoose;

const BusLineSchema = new Schema({
    driverID: {
        type: Schema.Types.ObjectId,
        ref: "Driver",
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    capacity: {
        type: Number,
        required: true,
        min: 5,
    },
    remainingSeats:{
        type: Number
    },
    departureTime: {
        type: Date,
        required: true,
    },
    arrivalTime: {
        type: Date,
        required: true,
    },
    busPoints: [{
        name: {
            type: String,
            required: true,
            trim: true,
        },
        latitude: {
            type: Number,
            required: true,
        },
        longitude: {
            type: Number,
            required: true,
        },
        pickupTime: {
            type: Date,
            required: true,
        },
    }],
    imageUrl: {
        type: String,
        default: null,
    },
    cloudinaryPublicId: {
        type: String,
        default: null,
    },
});

BusLineSchema.pre('save', function(next) {
    if (this.isNew && this.remainingSeats === undefined) {
        this.remainingSeats = this.capacity;
    }
    next();
});

const BusLine = mongoose.model("BusLine", BusLineSchema);
export default BusLine;
