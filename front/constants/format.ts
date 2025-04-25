export function formatDate(date: string): string {
    const d = new Date(date);
    const yyyy = d.getFullYear();
    const mm   = String(d.getMonth() + 1).padStart(2, '0');
    const dd   = String(d.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;  // "YYYY-MM-DD"

    return formattedDate
}
