/**
 * A single field-level change recorded in an edit history entry.
 */
export interface HistoryChange {
  field: string;
  from: string;
  to: string;
}

/**
 * One audited edit: who changed what, and when.
 */
export interface HistoryEntry {
  id: string;
  /**
   * Name of the person who made the change — never a role or job title, since
   * an audit trail has to name who is accountable. `System` is the one
   * exception, for changes no user initiated.
   */
  changedBy: string;
  changedAt: string;
  changes: HistoryChange[];
}
