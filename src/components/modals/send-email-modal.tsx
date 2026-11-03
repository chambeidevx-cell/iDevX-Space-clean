import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Close as CloseIcon, Send as SendIcon } from '@mui/icons-material';
import { DialogCloseButton } from '@/components/modals/dialog-close-button';
import { useSnackbar } from 'notistack';
import { RichTextEditor } from '@/components/editor/rich-text-editor';
import { hasRichTextContent } from '@/utils/rich-text';
import { CancelButton } from '@/components/buttons/cancel-button';

interface SendEmailModalProps {
  open: boolean;
  onClose: () => void;
  toEmail: string;
}

interface EmailForm {
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  body: string;
}

interface ChipEmailInputProps {
  label: string;
  emails: string[];
  lockedEmails: string[];
  onChange: (emails: string[]) => void;
  required?: boolean;
}

const ChipEmailInput = ({ label, emails, lockedEmails, onChange, required }: ChipEmailInputProps) => {
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [focused, setFocused] = useState(false);

  const addEmail = (value: string) => {
    const trimmed = value.trim().replace(/,+$/, '');
    if (trimmed && !emails.includes(trimmed)) {
      onChange([...emails, trimmed]);
    }
    setInputValue('');
  };

  const removeEmail = (email: string) => {
    onChange(emails.filter((e) => e !== email));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addEmail(inputValue);
    } else if (e.key === 'Backspace' && !inputValue) {
      const removable = emails.filter((e) => !lockedEmails.includes(e));
      if (removable.length > 0) removeEmail(removable[removable.length - 1]);
    }
  };

  return (
    <Box
      onClick={() => inputRef.current?.focus()}
      sx={{
        border: `${focused ? 2 : 1}px solid ${focused ? theme.palette.primary.main : theme.palette.divider}`,
        borderRadius: 1,
        px: 1.5,
        pt: 1.25,
        pb: 0.75,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 0.5,
        alignItems: 'center',
        cursor: 'text',
        position: 'relative',
        minHeight: 40,
        transition: 'border-color 0.2s',
      }}
    >
      <Typography
        component="label"
        sx={{
          position: 'absolute',
          top: -9,
          left: 10,
          px: 0.5,
          fontSize: 11,
          color: focused ? 'primary.main' : 'text.secondary',
          bgcolor: 'background.paper',
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        {label}{required && ' *'}
      </Typography>
      {emails.map((email) => (
        <Chip
          key={email}
          label={email}
          size="small"
          onDelete={lockedEmails.includes(email) ? undefined : () => removeEmail(email)}
          sx={{ height: 22, fontSize: '0.72rem' }}
        />
      ))}
      <input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => { setFocused(false); if (inputValue) addEmail(inputValue); }}
        style={{
          border: 'none',
          outline: 'none',
          flex: 1,
          minWidth: 120,
          background: 'transparent',
          fontSize: 14,
          color: theme.palette.text.primary,
          fontFamily: 'inherit',
          padding: '2px 0',
        }}
      />
    </Box>
  );
};

const SendEmailModal = ({ open, onClose, toEmail }: SendEmailModalProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState<EmailForm>({ to: [toEmail], cc: [], bcc: [], subject: '', body: '' });
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setForm({ to: [toEmail], cc: [], bcc: [], subject: '', body: '' });
    setShowCc(false);
    setShowBcc(false);
  }, [toEmail, open]);

  const isBodyEmpty = !hasRichTextContent(form.body ?? '');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBodyEmpty) {
      enqueueSnackbar('Please enter a message body.', { variant: 'warning' });
      return;
    }
    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log('Sending email:', form);
    enqueueSnackbar('Email sent successfully.', { variant: 'success' });
    setIsSending(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pr: 6 }}>
        Send Email
        <DialogCloseButton onClose={onClose} />
      </DialogTitle>
      <DialogContent>
        <Stack component="form" id="send-email-form" spacing={2} sx={{ pt: 1.5 }} onSubmit={handleSend}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <Box sx={{ flex: 1 }}>
              <ChipEmailInput
                label="To"
                emails={form.to}
                lockedEmails={[toEmail]}
                onChange={(emails) => setForm((prev) => ({ ...prev, to: emails }))}
                required
              />
            </Box>
            <Stack direction="row" spacing={0.75} sx={{ pt: 1, flexShrink: 0 }}>
              {!showCc && (
                <Typography
                  variant="caption"
                  onClick={() => setShowCc(true)}
                  sx={{ cursor: 'pointer', color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                >
                  + CC
                </Typography>
              )}
              {!showBcc && (
                <Typography
                  variant="caption"
                  onClick={() => setShowBcc(true)}
                  sx={{ cursor: 'pointer', color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                >
                  + BCC
                </Typography>
              )}
            </Stack>
          </Box>
          <Collapse in={showCc} unmountOnExit>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
              <Box sx={{ flex: 1 }}>
                <ChipEmailInput
                  label="CC"
                  emails={form.cc}
                  lockedEmails={[]}
                  onChange={(emails) => setForm((prev) => ({ ...prev, cc: emails }))}
                />
              </Box>
              <IconButton size="small" onClick={() => { setShowCc(false); setForm((prev) => ({ ...prev, cc: [] })); }} sx={{ mt: 0.5, color: 'text.secondary', '&:hover': { color: 'error.main' } }}>
                <CloseIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          </Collapse>
          <Collapse in={showBcc} unmountOnExit>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
              <Box sx={{ flex: 1 }}>
                <ChipEmailInput
                  label="BCC"
                  emails={form.bcc}
                  lockedEmails={[]}
                  onChange={(emails) => setForm((prev) => ({ ...prev, bcc: emails }))}
                />
              </Box>
              <IconButton size="small" onClick={() => { setShowBcc(false); setForm((prev) => ({ ...prev, bcc: [] })); }} sx={{ mt: 0.5, color: 'text.secondary', '&:hover': { color: 'error.main' } }}>
                <CloseIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          </Collapse>
          <TextField size="small" label="Subject" value={form.subject} onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))} fullWidth required />
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>
              Message *
            </Typography>
            <RichTextEditor
              key={String(open)}
              value=""
              onChange={(html) => setForm((prev) => ({ ...prev, body: html }))}
              error={false}
            />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <CancelButton onClick={onClose} />
        <Button type="submit" form="send-email-form" variant="contained" color="success" size="small" startIcon={<SendIcon />} loading={isSending}>
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SendEmailModal;
