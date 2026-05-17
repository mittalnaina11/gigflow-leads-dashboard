import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Lead, LeadFormData, LeadStatus, LeadSource } from '@/types';
import { leadsService } from '@/services/leadsService';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/utils';

interface LeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lead?: Lead | null;
}

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Lost', label: 'Lost' },
];

const SOURCE_OPTIONS: { value: LeadSource; label: string }[] = [
  { value: 'Website', label: '🌐 Website' },
  { value: 'Instagram', label: '📸 Instagram' },
  { value: 'Referral', label: '🤝 Referral' },
];

const DEFAULT_FORM: LeadFormData = {
  name: '',
  email: '',
  status: 'New',
  source: 'Website',
  notes: '',
};

type FormErrors = Partial<Record<keyof LeadFormData, string>>;

export const LeadForm: React.FC<LeadFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  lead,
}) => {
  const [form, setForm] = useState<LeadFormData>(DEFAULT_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!lead;

  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source,
        notes: lead.notes || '',
      });
    } else {
      setForm(DEFAULT_FORM);
    }
    setErrors({});
  }, [lead, isOpen]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    else if (form.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Invalid email address';
    if (!form.source) newErrors.source = 'Source is required';
    if (form.notes && form.notes.length > 500) newErrors.notes = 'Notes cannot exceed 500 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      if (isEditing && lead) {
        await leadsService.updateLead(lead._id, form);
        toast.success('Lead updated successfully!');
      } else {
        await leadsService.createLead(form);
        toast.success('Lead created successfully!');
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = <K extends keyof LeadFormData>(key: K, value: LeadFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Lead' : 'Add New Lead'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="e.g. Rahul Sharma"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="rahul@example.com"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => handleChange('status', e.target.value as LeadStatus)}
            options={STATUS_OPTIONS}
            error={errors.status}
          />
          <Select
            label="Source"
            value={form.source}
            onChange={(e) => handleChange('source', e.target.value as LeadSource)}
            options={SOURCE_OPTIONS}
            error={errors.source}
          />
        </div>

        <Textarea
          label="Notes (optional)"
          placeholder="Any additional information..."
          value={form.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          error={errors.notes}
        />

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            isLoading={isLoading}
          >
            {isEditing ? 'Update Lead' : 'Add Lead'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
