const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone_number: {
    type: Number,
    required: true
  }
});

const Driver = mongoose.model('Driver', driverSchema);

export default Driver;
