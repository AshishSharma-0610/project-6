import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  type: {
    type: String,
    enum: ['morning', 'evening', 'night'],
    required: true
  },
  ingredients: [String],
  specialInstructions: [String],
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'delivering', 'delivered'],
    default: 'pending'
  },
  assignedPantryStaff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedDeliveryStaff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  deliveryNotes: String,
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Meal', mealSchema);