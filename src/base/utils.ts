export const mapRecord = <K extends string, V, R>(record: Record<K, V>, mapper: (key: K, value: V) => R) => {
  return Object.fromEntries(Object.entries(record).map(([k, v]) => [k, mapper(k as K, v as V)])) as Record<K, R>;
}