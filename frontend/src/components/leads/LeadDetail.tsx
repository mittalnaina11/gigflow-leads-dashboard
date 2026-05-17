import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge, SourceBadge } from '@/components/ui/Badge';
import { Lead } from '@/types';
import { formatDate, getInitials } from '@/utils';
import { Calendar, Mail, StickyNote, User } from 'lucide-react';

interface LeadDetailProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onEdit: () => void;
}

export const LeadDetail: React.FC<LeadDetailProps> = ({
  isOpen,
  onClose,
  lead,
  onEdit,
}) => {
  if (!lead) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lead Details" size="md">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 bg-surface-50 dark:bg-surface-800 rounded-xl">
          <div className="w-14 h-14 rounded-2xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center">
            <span className="text-lg font-bold text-brand-600 dark:text-brand-400">
              {getInitials(lead.name)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-surface-900 dark:text-white text-base">
              {lead.name}
            </h3>
            <p className="text-sm text-surface-500 dark:text-surface-400">{lead.email}</p>
          </div>
        </div>

        {/* Status + Source */}
        <div className="flex gap-3 flex-wrap">
          <StatusBadge status={lead.status} />
          <SourceBadge source={lead.source} />
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-start gap-3 text-sm">
            <Mail className="w-4 h-4 text-surface-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-surface-500 dark:text-surface-400 mb-0.5">Email</p>
              <a
                href={`mailto:${lead.email}`}
                className="text-brand-600 hover:underline"
              >
                {lead.email}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3 text-sm">
            <Calendar className="w-4 h-4 text-surface-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-surface-500 dark:text-surface-400 mb-0.5">Created</p>
              <p className="text-surface-900 dark:text-white">{formatDate(lead.createdAt)}</p>
            </div>
          </div>

          {lead.createdBy && (
            <div className="flex items-start gap-3 text-sm">
              <User className="w-4 h-4 text-surface-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-surface-500 dark:text-surface-400 mb-0.5">Added by</p>
                <p className="text-surface-900 dark:text-white">{lead.createdBy.name}</p>
              </div>
            </div>
          )}

          {lead.notes && (
            <div className="flex items-start gap-3 text-sm">
              <StickyNote className="w-4 h-4 text-surface-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-surface-500 dark:text-surface-400 mb-0.5">Notes</p>
                <p className="text-surface-700 dark:text-surface-300 leading-relaxed">
                  {lead.notes}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action */}
        <div className="flex gap-3 pt-2 border-t border-surface-100 dark:border-surface-800">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-sm text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => { onEdit(); onClose(); }}
            className="flex-1 py-2 text-sm bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors font-medium"
          >
            Edit Lead
          </button>
        </div>
      </div>
    </Modal>
  );
};
