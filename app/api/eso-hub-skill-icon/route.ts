import { NextResponse } from 'next/server';

const ESO_HUB_HOST = 'eso-hub.com';

export async function GET(request: Request) {
  const pageUrl = new URL(request.url).searchParams.get('url');
  if (!pageUrl) return new NextResponse('Missing skill URL', { status: 400 });

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(pageUrl);
  } catch {
    return new NextResponse('Invalid skill URL', { status: 400 });
  }

  if (parsedUrl.protocol !== 'https:' || parsedUrl.hostname !== ESO_HUB_HOST) {
    return new NextResponse('Unsupported skill URL', { status: 400 });
  }

  const response = await fetch(parsedUrl, { next: { revalidate: 86400 } });
  if (!response.ok) {
    return new NextResponse('Skill page unavailable', { status: response.status === 404 ? 404 : 502 });
  }

  const html = await response.text();
  const imagePath = html.match(/https:\/\/eso-hub\.com\/storage\/(?:icons|mundus-stones)\/[^"' ]+|\/storage\/(?:icons|mundus-stones)\/[^"' ]+/)?.[0];
  const imageUrl = imagePath ? new URL(imagePath, 'https://eso-hub.com').toString() : null;
  if (!imageUrl) return new NextResponse('Skill image unavailable', { status: 404 });

  const imageResponse = await fetch(imageUrl, { next: { revalidate: 86400 } });
  if (!imageResponse.ok || !imageResponse.body) return new NextResponse('Skill image unavailable', { status: 404 });

  return new NextResponse(imageResponse.body, {
    headers: {
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      'Content-Type': imageResponse.headers.get('content-type') ?? 'image/png',
    },
  });
}
