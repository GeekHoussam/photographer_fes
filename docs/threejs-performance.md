# Three.js performance

`LensHero` is progressive enhancement. A static hero is rendered first and remains meaningful when WebGL fails, is blocked, or JavaScript is unavailable. The canvas is dynamically loaded with SSR disabled and appears only from medium viewports upward.

The renderer caps device pixel ratio at 1.5, avoids post-processing, uses simple reusable geometry, and pauses its frame loop when the document is hidden. React Three Fiber disposes mounted scene resources during unmount. Pointer response is deliberately small. Scroll choreography uses GSAP only for the initial aperture progression.

Reduced-motion users receive no scroll choreography or pointer response. Content and calls to action are above the canvas and immediately interactive. Before launch, measure draw calls, GPU time, JavaScript cost, LCP, and memory on representative mid-range Android hardware. Replace any supplied hero texture with a separately optimized mobile derivative.
