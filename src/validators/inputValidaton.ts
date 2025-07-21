import { body } from 'express-validator';

export const registerValidation = [
  body('username')
    .trim()
    .escape()
    .isLength({ min: 3, max: 25 })
    .withMessage('Username must be between 3 and 25 characters'),

  body('email')
    .trim()
    .escape()
    .isEmail()
    .withMessage('Invalid email address'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[#!&?]/)
    .withMessage('Password must contain at least one special character (#, !, &, ?)')
];

export const loginValidation = [
  body('username')
    .trim()
    .escape(),

  body('email')
    .trim()
    .escape()
    .isEmail()
    .withMessage('Invalid email address'),

  body('password')
    .trim()
    .escape()
];
