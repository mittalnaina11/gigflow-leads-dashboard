import { Router } from 'express';
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
  getLeadStats,
} from '../controllers/leadsController';
import { authenticate, authorize } from '../middleware/auth';
import {
  createLeadValidation,
  updateLeadValidation,
  leadQueryValidation,
} from '../middleware/validation';
import { param } from 'express-validator';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/leads/stats
router.get('/stats', getLeadStats);

// GET /api/leads/export
router.get('/export', exportLeadsCSV);

// GET /api/leads
router.get('/', leadQueryValidation, getLeads);

// POST /api/leads
router.post('/', createLeadValidation, createLead);

// GET /api/leads/:id
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid lead ID'), handleValidationErrors],
  getLead
);

// PUT /api/leads/:id
router.put('/:id', updateLeadValidation, updateLead);

// DELETE /api/leads/:id
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid lead ID'), handleValidationErrors],
  deleteLead
);

export default router;
