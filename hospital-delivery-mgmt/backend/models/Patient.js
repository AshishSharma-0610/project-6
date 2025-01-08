import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: Number,
  gender: String,
  roomNumber: {
    type: String,
    required: true
  },
  bedNumber: String,
  floorNumber: String,
  diseases: [String],
  allergies: [String],
  contactNumber: String,
  emergencyContact: {
    name: String,
    relation: String,
    phone: String
  },
  primaryPhysician: String,
  dietaryRestrictions: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Patient', patientSchema);