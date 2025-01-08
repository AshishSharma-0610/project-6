import express from 'express';
import { auth, checkRole } from '../middleware/auth.js';
import User from '../models/User.js';
import Meal from '../models/Meal.js';

const router = express.Router();

// Get all pantry staff
router.get('/staff', auth, checkRole(['manager']), async (req, res) => {
  try {
    const pantryStaff = await User.find({ role: 'pantry_staff' });
    res.json(pantryStaff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get assigned meals for pantry staff
router.get('/assigned-meals', auth, checkRole(['pantry_staff']), async (req, res) => {
  try {
    const meals = await Meal.find({ 
      assignedPantryStaff: req.user.userId,
      status: { $in: ['pending', 'preparing'] }
    }).populate('patient');
    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Assign meal to pantry staff
router.post('/assign-meal/:mealId', auth, checkRole(['manager']), async (req, res) => {
  try {
    const { staffId } = req.body;
    const meal = await Meal.findByIdAndUpdate(
      req.params.mealId,
      { 
        assignedPantryStaff: staffId,
        status: 'preparing'
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

// Mark meal as ready for delivery
router.patch('/meal-ready/:mealId', auth, checkRole(['pantry_staff']), async (req, res) => {
  try {
    const meal = await Meal.findOneAndUpdate(
      {
        _id: req.params.mealId,
        assignedPantryStaff: req.user.userId
      },
      { status: 'ready' },
      { new: true }
    );
    
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found or not assigned to you' });
    }
    
    res.json(meal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;