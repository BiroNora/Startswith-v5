/**
 * Univerzális kereső logika a szűrőkhöz
 */
export function fuzzySearch<T>(
  items: T[] | undefined | null,
  searchTerm: string,
  getSearchString: (item: T) => string
): T[] {
  // Biztonsági ellenőrzés, ha az adatok még nem töltöttek be
  if (!items) return [];

  const s = searchTerm.toLowerCase().trim();
  if (!s) return items;

  // Több szavas keresés támogatása (pl. "Budapest basic" -> mindkettőt keresi)
  const searchWords = s.split(/\s+/);

  return items.filter((item) => {
    const itemText = getSearchString(item).toLowerCase();
    // Csak akkor igaz, ha az összes keresett szó szerepel az elem szövegében
    return searchWords.every(word => itemText.includes(word));
  });
}
