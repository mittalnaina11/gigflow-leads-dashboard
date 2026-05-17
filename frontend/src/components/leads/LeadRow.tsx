import React, { useState } from 'react';
import { MoreVertical, Pencil, Trash2, Eye } from 'lucide-react';
import { Lead } from '@/types';
import { StatusBadge, SourceBadge } from '@/components/ui/Badge';
import { formatDate, getInitials, cn } from '@/utils';
import { leadsService } from '@/services/leadsService';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/utils';

interface LeadRowProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onView: (lead: Lead) => void;
  onDeleted: () => void;
}

export const LeadRow: React.FC<LeadRowProps> = ({ lead, onEdit, onView, onDeleted }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete lead "${lead.name}"? This cannot be undone.`)) return;
    setIsDeleting(true);
    try {
      await leadsService.deleteLead(lead._id);
      toast.success('Lead deleted');
      onDeleted();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
      setShowMenu(false);
    }
  };

  return (
    <tr
      className={cn(
        'group hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors duration-100',
        isDeleting && 'opacity-50'
      )}
    >
      {/* Name + Email */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
              {getInitials(lead.name)}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-surface-900 dark:text-white truncate">
              {lead.name}
            </p>
            <p className="text-xs text-surface-500 dark:text-surface-400 truncate">
              {lead.email}
            </p>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-3.5">
        <StatusBadge status={lead.status} />
      </td>

      {/* Source */}
      <td className="px-4 py-3.5">
        <SourceBadge source={lead.source} />
      </td>

      {/* Created */}
      <td className="px-4 py-3.5 text-sm text-surface-500 dark:text-surface-400 whitespace-nowrap">
        {formatDate(lead.createdAt)}
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5">
        <div className="relative flex justify-end">
          <button
            onClick={() => setShowMenu((s) => !s)}
            className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-surface-100 dark:hover:bg-surface-700 transition-all text-surface-500"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-8 z-20 bg-white dark:bg-surface-900 border border-surface-100 dark:border-surface-800 rounded-xl shadow-card-hover py-1 min-w-[140px] animate-slide-up">
                <button
                  onClick={() => { onView(lead); setShowMenu(false); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800"
                >
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
                <button
                  onClick={() => { onEdit(lead); setShowMenu(false); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};
