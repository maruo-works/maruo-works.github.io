import type { APIRoute } from 'astro';
import { renderOg } from '../../lib/og';

export const GET: APIRoute = async ({ site }) => {
  const png = await renderOg({ kicker: '', title: '静かに、丁寧に、こつこつと。', foot: site!.host });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
