/**
 * A note left on a record by a person.
 *
 * Distinct from a `HistoryEntry`: history is what the system observed being
 * changed, and nobody may edit or remove it. A note is what someone chose to
 * say, so its author — and only its author — may take it back.
 */
export interface NoteEntry {
  id: string;
  /** Id of the user who wrote it. Only they may remove it. */
  authorId: string;
  createdAt: string;
  body: string;
}
