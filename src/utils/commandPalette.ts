export const normalizeCommandQuery = (value: string): string =>
  value.trim().toLowerCase();

export const commandMatchesQuery = (parts: Array<string | undefined>, query: string): boolean => {
  const normalizedQuery = normalizeCommandQuery(query);
  if (!normalizedQuery) return true;

  const haystack = parts
    .filter((part): part is string => typeof part === 'string' && part.length > 0)
    .join(' ')
    .toLowerCase();

  return normalizedQuery
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => haystack.includes(token));
};
