import { gsap, SplitText } from './gsap.js';

/**
 * Hero: background video whose playhead follows the scroll position.
 *
 * - The video files are encoded with a keyframe on every frame (ffmpeg -g 1),
 *   so any currentTime can be decoded instantly — normal web encodes only
 *   have a keyframe every few seconds and stutter when scrubbed.
 * - The file is fetched into memory as a Blob so seeks never wait on
 *   network range requests.
 * - The pinned ScrollTrigger is created immediately (driving a 0→1 progress
 *   value) so sections below measure the pin spacing correctly, even before
 *   the video's duration is known.
 */
export function initHero({ reduced }) {
  const section = document.querySelector('.hero');
  const video = section.querySelector('.hero-video');
  const content = section.querySelector('.hero-content');
  const mark = section.querySelector('.hero-mark');
  const fade = section.querySelector('.hero-fade');

  const small = matchMedia('(max-width: 767px)').matches;
  // H.264 MP4 everywhere it decodes (Safari/iOS need it); VP9 WebM for
  // builds without proprietary codecs (Chromium, some Linux Firefox).
  const mp4 = video.canPlayType('video/mp4; codecs="avc1.640028"') !== '';
  const base = small ? video.dataset.srcMobile : video.dataset.src;
  const src = mp4 ? base : base.replace(/\.mp4$/, '.webm');

  if (reduced) {
    // Poster only — no scrubbing, no autoplay.
    return;
  }

  loadVideo(video, src);
  intro(section);

  // iOS Safari only renders seeks after the video has been "played" once.
  const unlock = () => {
    video.play().then(() => video.pause()).catch(() => {});
    window.removeEventListener('touchstart', unlock);
  };
  window.addEventListener('touchstart', unlock, { once: true, passive: true });

  const state = { p: 0 };
  let lastSet = -1;
  const seek = () => {
    if (!video.duration || video.readyState < 1) return;
    const t = state.p * (video.duration - 0.04);
    if (Math.abs(t - lastSet) < 1 / 60) return; // skip sub-frame updates
    lastSet = t;
    video.currentTime = t;
  };
  video.addEventListener('loadedmetadata', seek);

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${window.innerHeight * (small ? 1 : 1.6)}`,
      pin: true,
      scrub: 0.6, // light smoothing on top of Lenis
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  // Timeline (0 → 1 = whole pinned scroll):
  //   0.00–1.00  video plays through
  //   0.30–0.70  watermark drifts up and fades
  //   0.55–1.00  white gradient pulls up from the bottom edge; the CTAs and
  //              stat card dissolve into it while the top of the frame stays
  //              visible. The hero ends with a white bottom edge, so About
  //              (white) follows straight on with no blank screen.
  //   0.60–1.00  copy eases up a little, so the headline stays clear while the
  //              buttons sink into the fade (as in the Figma frame)
  tl.to(state, { p: 1, duration: 1, onUpdate: seek }, 0)
    .to(mark, { yPercent: -60, autoAlpha: 0, duration: 0.4, ease: 'power1.in' }, 0.3)
    // y: 0 clears the CSS translate-y-full that GSAP folds into its own transform
    .fromTo(fade, { y: 0, yPercent: 100 }, { y: 0, yPercent: 0, duration: 0.45, ease: 'power2.out' }, 0.55)
    .to(content, { yPercent: -6, duration: 0.4, ease: 'power1.inOut' }, 0.6);
}

function loadVideo(video, src) {
  fetch(src)
    .then((r) => {
      if (!r.ok) throw new Error(r.status);
      return r.blob();
    })
    .then((blob) => {
      video.src = URL.createObjectURL(blob);
    })
    .catch(() => {
      video.src = src;
    });
}

function intro(section) {
  const title = section.querySelector('.hero-title');
  const split = SplitText.create(title, { type: 'lines', mask: 'lines', linesClass: 'pb-[0.06em]' });
  const count = section.querySelector('.hero-count');
  const counter = { v: 0 };

  gsap
    .timeline({ delay: 0.15 })
    .from('#nav', { yPercent: -160, duration: 1.2 })
    .from('.hero-video', { scale: 1.12, duration: 2.2, ease: 'power3.out' }, 0)
    .from('.hero-badge', { y: 16, autoAlpha: 0, duration: 0.9 }, 0.25)
    .from(split.lines, { yPercent: 110, stagger: 0.1, duration: 1.2 }, 0.3)
    .from('.hero-copy', { y: 24, autoAlpha: 0 }, 0.6)
    .from('.hero-ctas > *', { y: 24, autoAlpha: 0, stagger: 0.08 }, 0.7)
    .from('.hero-stat', { x: 40, autoAlpha: 0, duration: 1.2 }, 0.8)
    .to(
      counter,
      {
        v: Number(count.dataset.count),
        duration: 1.6,
        ease: 'power2.out',
        onUpdate: () => (count.textContent = Math.round(counter.v)),
      },
      0.9,
    )
    .from('.hero-mark', { autoAlpha: 0, yPercent: 12, duration: 1.8 }, 0.5);
}
