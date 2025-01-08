import express from 'express';
import { auth, checkRole } from '../middleware/auth.js';
import Meal from '../models/Meal.js';

const router = express.Router();

// Get all meals
router.get('/', auth, async (req, res) => {
  try {
    const meals = await Meal.find()
      .populate('patient')
      .populate('assignedPantryStaff', 'name')
      .populate('assignedDeliveryStaff', 'name');
    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get meals by patient
router.get('/patient/:patientId', auth, async (req, res) => {
  try {
    const meals = await Meal.find({ patient: req.params.patientId })
      .populate('patient')
      .populate('assignedPantryStaff', 'name')
      .populate('assignedDeliveryStaff', 'name');
    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create meal
router.post('/', auth, checkRole(['manager']), async (req, res) => {
  try {
    const meal = new Meal(req.body);
    await meal.save();
    res.status(201).json(meal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update meal
router.put('/:id', auth, async (req, res) => {
  try {
    const meal = await Meal.findByIdAndUpdate(
      req.params.id,
      req.body,
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

// Update meal status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const meal = await Meal.findById(req.params.id);
    
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    meal.status = status;
    if (status === 'delivered') {
      meal.deliveredAt = new Date();
    }
    
    await meal.save();
    res.json(meal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete meal
router.delete('/:id', auth, checkRole(['manager']), async (req, res) => {
  try {
    const meal = await Meal.findByIdAndDelete(req.params.id);
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }
    res.json({ message: 'Meal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;