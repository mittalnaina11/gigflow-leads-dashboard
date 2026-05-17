import { Response, NextFunction } from 'express';
import { AuthRequest, LeadFilters, LeadStatus, LeadSource } from '../types';
import { Lead } from '../models/Lead';
import { FilterQuery } from 'mongoose';
import { ILeadDocument } from '../models/Lead';

export const getLeads = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      status,
      source,
      search,
      sort = 'latest',
      page = 1,
      limit = 10,
    } = req.query as unknown as LeadFilters;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build filter query
    const filter: FilterQuery<ILeadDocument> = {};

    if (status) filter.status = status as LeadStatus;
    if (source) filter.source = source as LeadSource;

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    // Role-based: sales users only see their own leads
    if (req.user?.role === 'sales') {
      filter.createdBy = req.user.id;
    }

    const sortOrder = sort === 'oldest' ? 1 : -1;

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Lead.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: { leads },
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found.' });
      return;
    }

    // Sales users can only view their own leads
    if (
      req.user?.role === 'sales' &&
      lead.createdBy.toString() !== req.user.id
    ) {
      res.status(403).json({ success: false, message: 'Access denied.' });
      return;
    }

    res.status(200).json({ success: true, data: { lead } });
  } catch (error) {
    next(error);
  }
};

export const createLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, status, source, notes, assignedTo } = req.body;

    const lead = await Lead.create({
      name,
      email,
      status: status || 'New',
      source,
      notes,
      assignedTo,
      createdBy: req.user?.id,
    });

    const populatedLead = await lead.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Lead created successfully.',
      data: { lead: populatedLead },
    });
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found.' });
      return;
    }

    // Sales users can only update their own leads
    if (
      req.user?.role === 'sales' &&
      lead.createdBy.toString() !== req.user.id
    ) {
      res.status(403).json({ success: false, message: 'Access denied.' });
      return;
    }

    const allowedFields = ['name', 'email', 'status', 'source', 'notes', 'assignedTo'];
    const updates: Partial<ILeadDocument> = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        (updates as Record<string, unknown>)[field] = req.body[field];
      }
    });

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully.',
      data: { lead: updatedLead },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found.' });
      return;
    }

    // Only admins or lead creators can delete
    if (
      req.user?.role === 'sales' &&
      lead.createdBy.toString() !== req.user.id
    ) {
      res.status(403).json({ success: false, message: 'Access denied.' });
      return;
    }

    await Lead.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const exportLeadsCSV = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filter: FilterQuery<ILeadDocument> = {};

    if (req.user?.role === 'sales') {
      filter.createdBy = req.user.id;
    }

    const leads = await Lead.find(filter)
      .populate('createdBy', 'name email')
      .lean();

    const csvRows = [
      ['Name', 'Email', 'Status', 'Source', 'Notes', 'Created At'],
      ...leads.map((lead) => [
        lead.name,
        lead.email,
        lead.status,
        lead.source,
        lead.notes || '',
        new Date(lead.createdAt).toISOString(),
      ]),
    ];

    const csvContent = csvRows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

export const getLeadStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filter: FilterQuery<ILeadDocument> = {};
    if (req.user?.role === 'sales') {
      filter.createdBy = req.user.id;
    }

    const [statusStats, sourceStats, total] = await Promise.all([
      Lead.aggregate([
        { $match: filter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Lead.aggregate([
        { $match: filter },
        { $group: { _id: '$source', count: { $sum: 1 } } },
      ]),
      Lead.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        byStatus: statusStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {} as Record<string, number>),
        bySource: sourceStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {} as Record<string, number>),
      },
    });
  } catch (error) {
    next(error);
  }
};
