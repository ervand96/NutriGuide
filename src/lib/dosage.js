export function dosageKeyForSlug(slug = "") {
  const s = String(slug).toLowerCase();
  if (s.includes("magnesium")) return "magnesium";
  if (s.includes("ashwagandha")) return "ashwagandha";
  if (s.includes("creatine")) return "creatine";
  return null;
}
