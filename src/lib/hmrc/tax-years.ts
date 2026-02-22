export function getTaxYears(start = 2000): string[] {
  const now = new Date();
  const currentYear = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  const years: string[] = [];

  for (let y = start; y <= currentYear; y += 1) {
    const suffix = String((y + 1) % 100).padStart(2, '0');
    years.push(`${y}-${suffix}`);
  }

  return years;
}
