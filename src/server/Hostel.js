import mongoose from 'mongoose';

const hostelSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  universityId: {
    type: String,
    required: true
  },
  roomTypes: {
    twoSeater: { type: Boolean, default: false },
    threeSeater: { type: Boolean, default: false },
    fullRoom: { type: Boolean, default: false }
  },
  prices: {
    price2Seater: { type: Number },
    price3Seater: { type: Number },
    priceFullRoom: { type: Number }
  },
  approved: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Hostel = mongoose.model('Hostel', hostelSchema);

export default Hostel;
