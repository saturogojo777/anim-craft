import { previewStylesheet } from "@/lib/animations";

/**
 * One small stylesheet powers every preview on the site. It is rendered on the
 * server (and inlined by Next.js) so previews animate on first paint.
 */
export function AnimationStyles() {
  return (
    <style
      id="animcraft-keyframes"
      // Generated from typed data in lib/animations.ts — no user input involved.
      dangerouslySetInnerHTML={{ __html: previewStylesheet() }}
    />
  );
}
