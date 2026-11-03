import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import type { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import TiptapImage from '@tiptap/extension-image';
import { Box, Button, Divider, IconButton, Popover, Stack, TextField, Tooltip, Typography } from '@mui/material';
import {
  Code as CodeIcon,
  FileUpload as UploadIcon,
  FormatAlignCenter,
  FormatAlignLeft,
  FormatAlignRight,
  FormatBold,
  FormatColorText,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  FormatUnderlined,
  Image as ImageIcon,
  Redo as RedoIcon,
  StrikethroughS,
  Undo as UndoIcon,
} from '@mui/icons-material';

type HeadingLevel = 1 | 2 | 3;

export interface RichTextEditorHandle {
  insertVariable: (variable: string) => void;
}

interface ToolbarBtnProps {
  title: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}

const ToolbarBtn = ({ title, active, disabled, onClick, children }: ToolbarBtnProps) => (
  <Tooltip title={title} placement="top" arrow disableInteractive>
    <span>
      <IconButton
        size="small"
        onMouseDown={(e) => { e.preventDefault(); onClick(); }}
        disabled={disabled}
        sx={{
          p: 0.4,
          borderRadius: 0.5,
          color: active ? 'primary.main' : 'text.secondary',
          bgcolor: active ? 'action.selected' : 'transparent',
          '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
        }}
      >
        {children}
      </IconButton>
    </span>
  </Tooltip>
);

const ToolbarDivider = () => (
  <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />
);

const PRESET_COLORS = [
  '#000000', '#ffffff', '#ef4444', '#f97316',
  '#eab308', '#22c55e', '#14b8a6', '#3b82f6',
  '#8b5cf6', '#ec4899', '#6b7280', '#1e40af',
  '#7f1d1d', '#14532d', '#1e3a5f', '#4a044e',
] as const;

const ColorPickerButton = ({ editor }: { editor: Editor }) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const currentColor = (editor.getAttributes('textStyle').color as string | undefined) ?? '';

  return (
    <>
      <Tooltip title="Text Color" placement="top" arrow disableInteractive>
        <IconButton
          ref={btnRef}
          size="small"
          onMouseDown={(e) => { e.preventDefault(); setAnchorEl(btnRef.current); }}
          sx={{
            p: 0.4,
            borderRadius: 0.5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: anchorEl ? 'primary.main' : 'text.secondary',
            bgcolor: anchorEl ? 'action.selected' : 'transparent',
            '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
          }}
        >
          <FormatColorText sx={{ fontSize: 16 }} />
          <Box
            sx={{
              width: 14,
              height: 3,
              bgcolor: currentColor || 'currentColor',
              borderRadius: 0.5,
              mt: '1px',
            }}
          />
        </IconButton>
      </Tooltip>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { sx: { p: 1.5, width: 172 } } }}
      >
        <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
          Text Color
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
          {PRESET_COLORS.map((color) => (
            <Box
              key={color}
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().setColor(color).run();
                setAnchorEl(null);
              }}
              sx={{
                width: 22,
                height: 22,
                bgcolor: color,
                borderRadius: 0.5,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: currentColor === color ? 'primary.main' : 'divider',
                transition: 'transform 0.1s',
                '&:hover': { transform: 'scale(1.15)' },
              }}
            />
          ))}
        </Box>
        <Divider sx={{ mb: 1 }} />
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
            Custom
          </Typography>
          <input
            type="color"
            value={currentColor || '#000000'}
            onChange={(e) => editor.chain().setColor(e.target.value).run()}
            style={{ width: 32, height: 24, cursor: 'pointer', border: 'none', padding: 0, background: 'transparent' }}
          />
          <Button
            size="small"
            variant="text"
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().unsetColor().run();
              setAnchorEl(null);
            }}
            sx={{ fontSize: '0.65rem', minWidth: 0, p: '2px 6px', ml: 'auto' }}
          >
            Reset
          </Button>
        </Stack>
      </Popover>
    </>
  );
};

const ImageInsertButton = ({ editor }: { editor: Editor }) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [imageUrl, setImageUrl] = useState('');

  const handleClose = () => {
    setAnchorEl(null);
    setImageUrl('');
  };

  const handleInsertUrl = () => {
    const src = imageUrl.trim();
    if (!src) return;
    editor.chain().focus().setImage({ src }).run();
    handleClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      editor.chain().focus().setImage({ src: reader.result as string }).run();
      handleClose();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <>
      <Tooltip title="Insert Image" placement="top" arrow disableInteractive>
        <IconButton
          ref={btnRef}
          size="small"
          onMouseDown={(e) => { e.preventDefault(); setAnchorEl(btnRef.current); }}
          sx={{
            p: 0.4,
            borderRadius: 0.5,
            color: anchorEl ? 'primary.main' : 'text.secondary',
            bgcolor: anchorEl ? 'action.selected' : 'transparent',
            '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
          }}
        >
          <ImageIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { sx: { p: 1.5, width: 280 } } }}
      >
        <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
          Insert Image
        </Typography>
        <Stack spacing={1}>
          <TextField
            size="small"
            label="Image URL"
            placeholder="https://example.com/image.png"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleInsertUrl(); } }}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
          <Button
            variant="contained"
            size="small"
            disabled={!imageUrl.trim()}
            onMouseDown={(e) => { e.preventDefault(); handleInsertUrl(); }}
            fullWidth
          >
            Insert from URL
          </Button>
          <Divider>
            <Typography variant="caption" color="text.secondary">or</Typography>
          </Divider>
          <Button
            variant="outlined"
            size="small"
            startIcon={<UploadIcon />}
            onClick={() => fileInputRef.current?.click()}
            fullWidth
          >
            Upload from Device
          </Button>
        </Stack>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </Popover>
    </>
  );
};

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  error?: boolean;
  helperText?: string;
  disableBorder?: boolean;
}

const HEADING_LEVELS: HeadingLevel[] = [1, 2, 3];

export const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(
  ({ value, onChange, error, helperText, disableBorder }, ref) => {
    const editor = useEditor({
      extensions: [
        StarterKit,
        Underline,
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        TextStyle,
        Color,
        TiptapImage.configure({ inline: false, allowBase64: true }),
      ],
      content: value,
      onUpdate: ({ editor: e }) => onChange(e.getHTML()),
      shouldRerenderOnTransaction: true,
    });

    useImperativeHandle(ref, () => ({
      insertVariable: (variable: string) => {
        editor?.chain().focus().insertContent(variable).run();
      },
    }), [editor]);

    if (!editor) return null;

    return (
      <Box sx={disableBorder ? { height: '100%', display: 'flex', flexDirection: 'column' } : undefined}>
        <Box
          sx={disableBorder ? { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' } : {
            border: '1px solid',
            borderColor: (theme) => error
              ? theme.palette.error.main
              : theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)',
            borderRadius: 1,
            overflow: 'hidden',
            transition: 'border-color 0.15s',
            '&:hover': { borderColor: error ? 'error.main' : 'text.primary' },
            '&:focus-within': { borderColor: error ? 'error.main' : 'primary.main' },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 0.25,
              px: 0.75,
              py: 0.5,
              borderBottom: '1px solid',
              borderColor: 'divider',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
            }}
          >
            <ToolbarBtn title="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
              <UndoIcon sx={{ fontSize: 16 }} />
            </ToolbarBtn>
            <ToolbarBtn title="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
              <RedoIcon sx={{ fontSize: 16 }} />
            </ToolbarBtn>

            <ToolbarDivider />

            {HEADING_LEVELS.map((level) => (
              <ToolbarBtn
                key={level}
                title={`Heading ${level}`}
                active={editor.isActive('heading', { level })}
                onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
              >
                <Typography component="span" sx={{ fontSize: '0.68rem', fontWeight: 700, lineHeight: 1, minWidth: 14, textAlign: 'center' }}>
                  H{level}
                </Typography>
              </ToolbarBtn>
            ))}

            <ToolbarDivider />

            <ToolbarBtn title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
              <FormatBold sx={{ fontSize: 16 }} />
            </ToolbarBtn>
            <ToolbarBtn title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
              <FormatItalic sx={{ fontSize: 16 }} />
            </ToolbarBtn>
            <ToolbarBtn title="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
              <FormatUnderlined sx={{ fontSize: 16 }} />
            </ToolbarBtn>
            <ToolbarBtn title="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
              <StrikethroughS sx={{ fontSize: 16 }} />
            </ToolbarBtn>
            <ColorPickerButton editor={editor} />

            <ToolbarDivider />

            <ToolbarBtn title="Bullet List" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
              <FormatListBulleted sx={{ fontSize: 16 }} />
            </ToolbarBtn>
            <ToolbarBtn title="Ordered List" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
              <FormatListNumbered sx={{ fontSize: 16 }} />
            </ToolbarBtn>

            <ToolbarDivider />

            <ToolbarBtn title="Align Left" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
              <FormatAlignLeft sx={{ fontSize: 16 }} />
            </ToolbarBtn>
            <ToolbarBtn title="Align Center" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
              <FormatAlignCenter sx={{ fontSize: 16 }} />
            </ToolbarBtn>
            <ToolbarBtn title="Align Right" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
              <FormatAlignRight sx={{ fontSize: 16 }} />
            </ToolbarBtn>

            <ToolbarDivider />

            <ToolbarBtn title="Blockquote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
              <FormatQuote sx={{ fontSize: 16 }} />
            </ToolbarBtn>
            <ToolbarBtn title="Inline Code" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}>
              <CodeIcon sx={{ fontSize: 16 }} />
            </ToolbarBtn>

            <ToolbarDivider />

            <ImageInsertButton editor={editor} />
          </Box>

          <Box
            sx={(theme) => ({
              ...(disableBorder ? { flex: 1 } : { minHeight: 220, maxHeight: 280 }),
              overflowY: 'auto',
              '& .tiptap': {
                outline: 'none',
                minHeight: disableBorder ? '100%' : '220px',
                padding: '8px 12px',
                fontSize: '0.875rem',
                lineHeight: 1.6,
                '& p': { margin: '0 0 0.5em' },
                '& h1': { fontSize: '1.4em', fontWeight: 700, margin: '0.4em 0' },
                '& h2': { fontSize: '1.2em', fontWeight: 700, margin: '0.4em 0' },
                '& h3': { fontSize: '1.05em', fontWeight: 700, margin: '0.4em 0' },
                '& ul, & ol': { paddingLeft: '1.5em', margin: '0 0 0.5em' },
                '& li': { marginBottom: '0.2em' },
                '& blockquote': {
                  borderLeft: `3px solid ${theme.palette.divider}`,
                  paddingLeft: '12px',
                  marginLeft: 0,
                  color: theme.palette.text.secondary,
                },
                '& code:not(pre code)': {
                  fontFamily: 'monospace',
                  fontSize: '0.85em',
                  backgroundColor: theme.palette.action.hover,
                  padding: '1px 4px',
                  borderRadius: '4px',
                },
                '& pre': {
                  fontFamily: 'monospace',
                  fontSize: '0.85em',
                  backgroundColor: theme.palette.action.hover,
                  padding: '12px',
                  borderRadius: '4px',
                  overflowX: 'auto',
                },
                '& hr': {
                  border: 'none',
                  borderTop: `1px solid ${theme.palette.divider}`,
                  margin: '8px 0',
                },
                '& img': {
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '4px',
                  display: 'block',
                },
              },
            })}
          >
            <EditorContent editor={editor} />
          </Box>
        </Box>
        {helperText && (
          <Typography variant="caption" color="error" sx={{ display: 'block', fontSize: '0.65rem', mt: 0.5 }}>
            {helperText}
          </Typography>
        )}
      </Box>
    );
  },
);

RichTextEditor.displayName = 'RichTextEditor';
