import { MutableRefObject, useEffect, useRef, useState } from 'react';

/**
 * Whether an element's text is being cut off by its own width.
 *
 * For the pattern of "truncate with an ellipsis, and offer the full text in a
 * tooltip". The tooltip has to be conditional: attaching one to every label
 * puts a tooltip on text that is already fully readable, and a tooltip that
 * repeats what is on screen teaches people to ignore the ones that don't.
 *
 * Re-measures when the element resizes — a sidebar that collapses, a column
 * that is dragged narrower — so the answer follows the layout rather than
 * whatever was true on mount.
 *
 * @example
 * const [labelRef, isTruncated] = useIsTruncated<HTMLSpanElement>();
 * <Tooltip title={isTruncated ? title : ''}><span ref={labelRef}>{title}</span></Tooltip>
 */
export const useIsTruncated = <T extends HTMLElement>(): [MutableRefObject<T | null>, boolean] => {
  const ref = useRef<T | null>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const measure = () => setIsTruncated(element.scrollWidth > element.clientWidth);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, isTruncated];
};
