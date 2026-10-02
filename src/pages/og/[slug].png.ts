import type { APIRoute, GetStaticPaths } from 'astro';
import { formatDate } from '../../lib/date';
import { renderOg } from '../../lib/og';
import { getPosts, type Post } from '../../lib/posts';

export const getStaticPaths = (async () => {
  const posts = await getPosts();
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ post: Post }> = async ({ props }) => {
  const png = await renderOg({ kicker: '記事', title: props.post.data.title, foot: formatDate(props.post.data.date) });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
