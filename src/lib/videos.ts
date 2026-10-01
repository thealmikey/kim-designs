/**
 * Short-form video content for the homepage video showcase.
 *
 * To publish a new video:
 *   1. Drop a compressed MP4 (H.264 video + AAC audio, ~720p) into
 *      `public/videos/`.
 *   2. Drop a matching poster frame (same basename, .jpg) into
 *      `public/videos/`, or point `poster` at an existing /images file.
 *   3. Append an entry below. Nothing else needs to change.
 *
 * Nothing here is fetched by the browser until a visitor taps a card, so it is
 * safe to list several videos here.
 */

export interface StudioVideo {
  /** Stable unique id. Used as React key. */
  id: string;
  /** Short title shown on the card. */
  title: string;
  /** Small category eyebrow, e.g. "Kitchens". */
  category: string;
  /** Video file path, relative to `public/`. Prefer /videos/<id>.mp4 */
  src: string;
  /** Poster frame. Loaded lazily; the video file itself is never loaded here. */
  poster: string;
  /** Intrinsic pixel width of the source video. */
  width: number;
  /** Intrinsic pixel height of the source video. */
  height: number;
  /** Optional display duration, e.g. "0:14". Rendered as a corner chip. */
  duration?: string;
}

export const videos: StudioVideo[] = [
  {
    id: "clip-01",
    title: "A walk through",
    category: "Studio",
    src: "/videos/clip-01.mp4",
    poster: "/images/walk-in-closet/01.jpg",
    width: 464,
    height: 624,
    duration: "0:35",
  },
  {
    id: "clip-02",
    title: "Detail work",
    category: "Kitchens",
    src: "/videos/clip-02.mp4",
    poster: "/images/high-gloss-handless-kitchen/01.jpg",
    width: 478,
    height: 850,
    duration: "0:19",
  },
  {
    id: "clip-03",
    title: "Material finish",
    category: "Bath Vanities",
    src: "/videos/clip-03.mp4",
    poster: "/images/bath-vanities/01.jpg",
    width: 478,
    height: 850,
    duration: "0:14",
  },
  {
    id: "clip-04",
    title: "Storage in detail",
    category: "Wardrobes",
    src: "/videos/clip-04.mp4",
    poster: "/images/classic-wardrobe/01.jpg",
    width: 478,
    height: 850,
    duration: "0:16",
  },
];