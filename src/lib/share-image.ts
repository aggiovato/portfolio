import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

/**
 * The 1200×630 JPEG every network (and email client) shows reliably: the share card of a page and
 * the image of a note in the feed and its newsletter email. Images are fitted whole on the site's
 * graphite, never cropped. Returns the site-relative URL.
 */
export async function shareImage(src: ImageMetadata): Promise<string> {
  const image = await getImage({
    src,
    width: 1200,
    height: 630,
    fit: 'contain',
    background: '#15161e',
    format: 'jpg',
    quality: 82,
  });
  return image.src;
}
