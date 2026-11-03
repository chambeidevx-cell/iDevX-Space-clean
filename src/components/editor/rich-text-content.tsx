import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

interface RichTextContentProps {
  html: string;
  sx?: SxProps<Theme>;
}

/**
 * Read-only rendering of markup produced by `RichTextEditor`, styled to match
 * what the editor shows while typing.
 *
 * The markup is trusted because it can only originate from the editor, which
 * serialises a ProseMirror document and therefore emits nothing outside its own
 * node and mark schema.
 *
 * @example <RichTextContent html={note.notes} />
 */
export const RichTextContent = ({ html, sx }: RichTextContentProps) => (
  <Box
    sx={[
      (theme) => ({
        fontSize: '0.875rem',
        lineHeight: 1.6,
        color: 'text.primary',
        '& > :first-of-type': { marginTop: 0 },
        '& > :last-child': { marginBottom: 0 },
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
      }),
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
    dangerouslySetInnerHTML={{ __html: html }}
  />
);
