/**
 * Подписка на рассылку. Адаптер: если задан PUBLIC_NEWSLETTER_ENDPOINT, отправляет POST JSON {email}.
 * Без него ничего никуда не отправляет (dry run) — только имитирует успех.
 */
const endpoint = import.meta.env.PUBLIC_NEWSLETTER_ENDPOINT?.trim() ?? '';

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export async function subscribeNewsletter(email: string): Promise<{ dryRun: boolean }> {
  if (!endpoint) {
    await new Promise((r) => setTimeout(r, 600));
    return { dryRun: true };
  }
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim() }),
  });
  if (!res.ok) throw new Error(`Newsletter: HTTP ${res.status}`);
  return { dryRun: false };
}
