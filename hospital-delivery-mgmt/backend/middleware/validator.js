import { body } from 'express-validator';

export const validateUser = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').notEmpty().withMessage('Name is required'),
  body('role').isIn(['manager', 'pantry_staff', 'delivery_staff']).withMessage('Invalid role')
];

export const validatePatient = [
  body('name').notEmpty().withMessage('Name is required'),
  body('roomNumber').notEmpty().withMessage('Room number is required'),
  body('age').optional().isInt({ min: 0 }).withMessage('Invalid age'),
  body('contactNumber').optional().isMobilePhone().withMessage('Invalid contact number')
];

export const validateMeal = [
  body('patient').notEmpty().withMessage('Patient ID is required'),
  body('type').isIn(['morning', 'evening', 'night']).withMessage('Invalid meal type'),
  body('ingredients').isArray().withMessage('Ingredients must be an array'),
  body('specialInstructions').optional().isArray().withMessage('Special instructions must be an array')
];