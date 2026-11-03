import { useCallback, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  MovieOutlined as VideoIcon,
  PhotoOutlined as PhotoIcon,
  Send as SendIcon,
  UploadFileOutlined as UploadIcon,
} from '@mui/icons-material';
import { DialogCloseButton } from '@/components/modals/dialog-close-button';
import { RichTextEditor } from '@/components/editor/rich-text-editor';
import { CancelButton } from '@/components/buttons/cancel-button';

interface TicketForm {
  subject: string;
  category: string;
  description: string;
}

interface HelpdeskModalProps {
  open: boolean;
  onClose: () => void;
}

const CATEGORIES = ['Technical Issue', 'Billing', 'Feature Request', 'General Inquiry', 'Other'];

const ACCEPTED_TYPES = 'image/*,video/*';

const initialForm: TicketForm = {
  subject: '',
  category: '',
  description: '',
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const HelpdeskModal = ({ open, onClose }: HelpdeskModalProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState<TicketForm>(initialForm);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof TicketForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const addFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const accepted = Array.from(files).filter((f) =>
      f.type.startsWith('image/') || f.type.startsWith('video/')
    );
    setAttachments((prev) => [...prev, ...accepted]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log('Ticket submitted:', formData, attachments);
    enqueueSnackbar('Ticket submitted successfully. We\'ll be in touch shortly.', { variant: 'success' });
    setFormData(initialForm);
    setAttachments([]);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pr: 6 }}>
        Submit A Support Ticket
        <DialogCloseButton onClose={onClose} />
      </DialogTitle>
      <DialogContent>
        <Grid component="form" id="helpdesk-form" container spacing={2} sx={{ pt: 1 }} onSubmit={handleSubmit}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              size="small"
              label="Subject"
              value={formData.subject}
              onChange={handleChange('subject')}
              required
              fullWidth
              placeholder="Brief summary of your issue"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              size="small"
              label="Category"
              value={formData.category}
              onChange={handleChange('category')}
              required
              fullWidth
            >
              {CATEGORIES.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
              Description *
            </Typography>
            <RichTextEditor
              value={formData.description}
              onChange={(html) => setFormData((prev) => ({ ...prev, description: html }))}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
              Attachments
            </Typography>
            <Box
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                border: '1px dashed',
                borderColor: isDragging ? 'primary.main' : 'divider',
                borderRadius: 2,
                p: 2.5,
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: isDragging ? 'action.hover' : 'transparent',
                transition: 'border-color 0.2s, background-color 0.2s',
                '&:hover': { borderColor: 'text.secondary', bgcolor: 'action.hover' },
              }}
            >
              <UploadIcon sx={{ fontSize: 32, color: 'text.disabled', mb: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                Drag & drop or <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>browse</Box>
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                  <PhotoIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                  <Typography variant="caption" color="text.disabled">Photos</Typography>
                </Box>
                <Typography variant="caption" color="text.disabled">·</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                  <VideoIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                  <Typography variant="caption" color="text.disabled">Videos</Typography>
                </Box>
              </Box>
            </Box>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_TYPES}
              multiple
              style={{ display: 'none' }}
              onChange={(e) => addFiles(e.target.files)}
            />

            {attachments.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
                {attachments.map((file, index) => (
                  <Chip
                    key={index}
                    icon={file.type.startsWith('video/') ? <VideoIcon /> : <PhotoIcon />}
                    label={`${file.name} (${formatFileSize(file.size)})`}
                    size="small"
                    onDelete={() => removeAttachment(index)}
                    deleteIcon={<DeleteIcon />}
                    sx={{ maxWidth: 240 }}
                  />
                ))}
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <CancelButton onClick={onClose} />
        <Button
          type="submit"
          form="helpdesk-form"
          variant="contained"
          color="success"
          size="small"
          startIcon={<SendIcon />}
          loading={isSubmitting}
        >
          Submit Ticket
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HelpdeskModal;
