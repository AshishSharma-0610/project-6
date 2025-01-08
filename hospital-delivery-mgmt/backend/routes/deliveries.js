import express from 'express';
import { auth, checkRole } from '../middleware/auth.js';
import User from '../models/User.js';
import Meal from '../models/Meal.js';

const router = express.Router();

// Get all delivery staff
router.get('/staff', auth, checkRole(['manager']), async (req, res) => {
  try {
    const deliveryStaff = await User.find({ role: 'delivery_staff' });
    res.json(deliveryStaff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get assigned deliveries for delivery staff
router.get('/assigned-deliveries', auth, checkRole(['delivery_staff']), async (req, res) => {
  try {
    const meals = await Meal.find({ 
      assignedDeliveryStaff: req.user.userId,
      status: { $in: ['ready', 'delivering'] }
    }).populate('patient');
    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Assign delivery to staff
router.post('/assign/:mealId', auth, checkRole(['manager', 'pantry_staff']), async (req, res) => {
  try {
    const { staffId } = req.body;
    const meal = await Meal.findByIdAndUpdate(
      req.params.mealId,
      { 
        assignedDeliveryStaff: staffId,
        status: 'delivering'
      },
      { new: true }
    );
    
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }
    
    res.json(meal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mark delivery as completed
router.patch('/complete/:mealId', auth, checkRole(['delivery_staff']), async (req, res) => {
  try {
    const { deliveryNotes } = req.body;
    const meal = await Meal.findOneAndUpdate(
      {
        _id: req.params.mealId,
        assignedDeliveryStaff: req.user.userId
      },
      { 
        status: 'delivered',
        deliveryNotes,
        deliveredAt: new Date()
      },
      { new: true }
    );
    
    if (!meal) {
      return res.status(404).json({ message: 'Delivery not found or not assigned to you' });
    }
    
    res.json(meal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get delivery statistics
router.get('/stats', auth, checkRole(['manager']), async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = await Meal.aggregate([
      {
        $match: {
          createdAt: { $gte: today }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;