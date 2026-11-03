/**
 * Display format for the human-readable identifiers shown against records —
 * `IDVX-CLIENT-00001` and friends.
 *
 * Both parts are configuration, not code: a deployment can rebrand the prefix
 * or widen the sequence without touching any feature. Change a value here and
 * every grid, card, modal and export that shows that identifier follows.
 * There is deliberately no settings page for this — it is a build-time decision
 * for developers, not something an operator should be able to change while
 * records already exist.
 *
 * Widening `padding` is safe. Narrowing it, or editing a `prefix`, changes how
 * existing records read, so treat it as a migration rather than a tweak.
 */
export const ENTITY_ID_FORMATS = {
  client: { prefix: 'IDVX-CLIENT', padding: 5 },
  user: { prefix: 'IDVX-USER', padding: 5 },
  platform: { prefix: 'IDVX-PLT', padding: 5 },
  pointOfContact: { prefix: 'IDVX-POC', padding: 5 },
  releaseNote: { prefix: 'IDVX-RN', padding: 5 },
  lead: { prefix: 'IDVX-LEAD', padding: 5 },
} as const;

export type EntityIdKind = keyof typeof ENTITY_ID_FORMATS;

/**
 * Display identifier for a record, from its raw sequence value.
 *
 * A sequence longer than `padding` is never truncated — it simply renders at
 * its full length, so records keep unique identifiers once the range is
 * outgrown.
 *
 * @example formatEntityId('client', 1) // 'IDVX-CLIENT-00001'
 */
export const formatEntityId = (kind: EntityIdKind, sequence: number | string): string => {
  const { prefix, padding } = ENTITY_ID_FORMATS[kind];
  return `${prefix}-${String(sequence).padStart(padding, '0')}`;
};
