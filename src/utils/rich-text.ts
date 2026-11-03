/**
 * Whether rich-text markup carries anything meaningful.
 *
 * The editor serialises an empty document as `<p></p>`, and a paragraph of
 * whitespace as `<p>&nbsp;</p>`, so a length check on the markup reports
 * content where a reader would see none. An image counts even though it
 * contributes no text.
 *
 * Use this for every "is this field filled in?" test on rich text — required
 * fields, disabled save buttons, empty states — so one definition of empty
 * applies everywhere.
 *
 * @example hasRichTextContent('<p></p>') // false
 * @example hasRichTextContent('<p>Called back Tuesday.</p>') // true
 */
export const hasRichTextContent = (html: string): boolean =>
  html.includes('<img') || html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim() !== '';
