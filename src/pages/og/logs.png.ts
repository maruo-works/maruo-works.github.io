import type { APIRoute } from 'astro';
import { renderOg } from '../../lib/og';

/** ログ一覧ページ（/logs/）の共有画像 */
export const GET: APIRoute = async ({ site }) => {
  const png = await renderOg({ kicker: '', title: '短いログ', foot: site!.host });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
