import { Request, Response, NextFunction } from 'express';
import { body, query, param, validationResult } from 'express-validator';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({
        field: e.type === 'field' ? e.path : 'unknown',
        message: e.msg,
      })),
    });
    return;
  }
  next();
};

export const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['admin', 'sales']).withMessage('Role must be admin or sales'),
  handleValidationErrors,
];

export const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

export const createLeadValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Lead name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
    .withMessage('Invalid status value'),
  body('source')
    .notEmpty().withMessage('Source is required')
    .isIn(['Website', 'Instagram', 'Referral'])
    .withMessage('Invalid source value'),
  body('notes')
    .optional()
    .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
  handleValidationErrors,
];

export const updateLeadValidation = [
  param('id').isMongoId().withMessage('Invalid lead ID'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
    .withMessage('Invalid status value'),
  body('source')
    .optional()
    .isIn(['Website', 'Instagram', 'Referral'])
    .withMessage('Invalid source value'),
  body('notes')
    .optional()
    .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
  handleValidationErrors,
];

export const leadQueryValidation = [
  query('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
    .withMessage('Invalid status filter'),
  query('source')
    .optional()
    .isIn(['Website', 'Instagram', 'Referral'])
    .withMessage('Invalid source filter'),
  query('sort')
    .optional()
    .isIn(['latest', 'oldest'])
    .withMessage('Sort must be latest or oldest'),
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  handleValidationErrors,
];
