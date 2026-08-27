import { useEffect } from "react";
import type { ComponentProps } from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Group } from "three";
import type LensCanvas from "@/components/three/lens-canvas";
import { LensHero } from "@/components/three/lens-hero";
import {
  createLensInput,
  createLensMotion,
  updateLensFrame,
} from "@/components/three/lens-animation";
import type { LensInput } from "@/components/three/lens-animation";

const canvas = vi.hoisted(() => ({
  props: null as ComponentProps<typeof LensCanvas> | null,
  renders: 0,
}));

vi.mock("next/dynamic", () => ({
  default: () =>
    function MockCanvas(props: ComponentProps<typeof LensCanvas>) {
      canvas.props = props;
      canvas.renders += 1;
      const { onReady } = props;
      useEffect(() => {
        onReady?.();
      }, [onReady]);
      return <canvas data-testid="lens-canvas" />;
    },
}));
vi.mock("gsap", () => ({
  gsap: {
    registerPlugin: vi.fn(),
    context: (callback: () => void) => {
      callback();
      return { revert: vi.fn() };
    },
    to: vi.fn(),
  },
}));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: {} }));

let reducedMotion = false;
let motion: EventTarget;
let captured: Set<number>;

beforeEach(() => {
  canvas.props = null;
  canvas.renders = 0;
  reducedMotion = false;
  motion = new EventTarget();
  captured = new Set();
  vi.stubGlobal("matchMedia", () => ({
    get matches() {
      return reducedMotion;
    },
    addEventListener: motion.addEventListener.bind(motion),
    removeEventListener: motion.removeEventListener.bind(motion),
  }));
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  vi.stubGlobal(
    "PointerEvent",
    class extends MouseEvent {
      pointerId: number;
      pointerType: string;
      isPrimary: boolean;
      constructor(type: string, init: PointerEventInit = {}) {
        super(type, init);
        this.pointerId = init.pointerId ?? 7;
        this.pointerType = init.pointerType ?? "touch";
        this.isPrimary = init.isPrimary ?? true;
      }
    },
  );
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(
    new DOMRect(100, 100, 200, 200),
  );
  Object.assign(HTMLButtonElement.prototype, {
    setPointerCapture: (id: number) => captured.add(id),
    hasPointerCapture: (id: number) => captured.has(id),
    releasePointerCapture: (id: number) => captured.delete(id),
  });
});

describe("lens animation frames", () => {
  function scene() {
    return {
      group: { current: new Group() },
      glass: { current: new Group() },
      iris: { current: new Group() },
      reflections: { current: new Group() },
    };
  }

  it("keeps rendering when live input is missing during a refresh, then recovers", () => {
    const parts = scene();
    const motion = createLensMotion();
    const pending: { current: LensInput | undefined } = { current: undefined };
    expect(() => {
      updateLensFrame(parts, motion, undefined, 0, 1 / 60);
      updateLensFrame(parts, motion, pending, 1 / 60, 1 / 60);
    }).not.toThrow();
    expect(parts.group.current.rotation.y).toBeGreaterThan(0);

    pending.current = {
      ...createLensInput(),
      pointer: [1, 0.5],
      direct: true,
      pressed: true,
    };
    for (let frame = 0; frame < 60; frame += 1) {
      updateLensFrame(parts, motion, pending, frame / 60, 1 / 60);
    }
    const heldRotation = parts.group.current.rotation.y;
    expect(heldRotation).toBeGreaterThan(0.4);
    expect(parts.glass.current.position.x).toBeLessThan(0);
    expect(parts.iris.current.scale.x).toBeLessThan(1);

    for (let frame = 60; frame < 180; frame += 1) {
      updateLensFrame(parts, motion, undefined, frame / 60, 1 / 60);
    }
    expect(parts.group.current.rotation.y).toBeCloseTo(0.075, 3);
    expect(parts.group.current.scale.x).toBeCloseTo(0.96, 3);
  });

  it("animates a laptop click through the iris and lets the focus pulse settle", () => {
    const parts = scene();
    const motion = createLensMotion();
    const live = { current: { ...createLensInput(), focus: 1 } };
    for (let frame = 0; frame < 12; frame += 1) {
      updateLensFrame(parts, motion, live, frame / 60, 1 / 60);
    }
    expect(parts.iris.current.scale.x).toBeLessThan(0.95);
    expect(parts.group.current.scale.x).toBeGreaterThan(0.96);
    for (let frame = 12; frame < 240; frame += 1) {
      updateLensFrame(parts, motion, live, frame / 60, 1 / 60);
    }
    expect(parts.iris.current.scale.x).toBeCloseTo(1, 3);
    expect(motion.focusPulse).toBeLessThan(0.001);
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  for (const name of [
    "setPointerCapture",
    "hasPointerCapture",
    "releasePointerCapture",
  ]) {
    Reflect.deleteProperty(HTMLButtonElement.prototype, name);
  }
});

async function mountLens() {
  render(<LensHero label="Interactive lens" hint="Swipe to rotate" />);
  return screen.findByRole("button", { name: "Interactive lens" });
}

const touch = {
  pointerId: 7,
  pointerType: "touch",
  isPrimary: true,
  button: 0,
  clientX: 200,
  clientY: 200,
};
const input = () => canvas.props!.input.current;

describe("interactive hero lens", () => {
  it("tracks a captured touch relative to the lens without rerendering for every move", async () => {
    const control = await mountLens();
    fireEvent.pointerDown(control, touch);
    expect(captured.has(7)).toBe(true);
    expect(input()).toMatchObject({
      pressed: true,
      direct: true,
      pointer: [0, 0],
    });
    const renders = canvas.renders;

    fireEvent.pointerMove(control, { ...touch, clientX: 280, clientY: 150 });
    expect(input().pointer[0]).toBeCloseTo(0.8);
    expect(input().pointer[1]).toBeCloseTo(0.5);
    fireEvent.pointerMove(control, { ...touch, clientX: 600, clientY: -10 });
    expect(input().pointer).toEqual([1, 1]);
    expect(canvas.renders).toBe(renders);

    fireEvent.pointerUp(control, touch);
    expect(captured.size).toBe(0);
    expect(input()).toMatchObject({
      pressed: false,
      direct: false,
      pointer: [0, 0],
    });
    fireEvent.click(control, { detail: 1 });
    expect(input().focus).toBe(0);
  });

  it("responds to a tap and supports the same focus action and rotation from the keyboard", async () => {
    const control = await mountLens();
    fireEvent.pointerDown(control, touch);
    fireEvent.pointerUp(control, touch);
    fireEvent.click(control, { detail: 1 });
    expect(input().focus).toBe(1);
    fireEvent.keyDown(control, { key: "ArrowRight" });
    fireEvent.keyDown(control, { key: "ArrowUp" });
    expect(input()).toMatchObject({ pointer: [0.25, 0.25], direct: true });
    fireEvent.click(control, { detail: 0 });
    expect(input().focus).toBe(2);
    fireEvent.keyDown(control, { key: "Escape" });
    expect(input().pointer).toEqual([0, 0]);
  });

  it.each(["pointerCancel", "lostPointerCapture"] as const)(
    "resets a drag on %s and ignores extra fingers",
    async (event) => {
      const control = await mountLens();
      fireEvent.pointerDown(control, touch);
      fireEvent.pointerMove(control, {
        ...touch,
        pointerId: 8,
        isPrimary: false,
        clientX: 300,
      });
      fireEvent.pointerUp(control, {
        ...touch,
        pointerId: 8,
        isPrimary: false,
      });
      expect(input()).toMatchObject({ pointer: [0, 0], pressed: true });
      fireEvent[event](control, touch);
      expect(input()).toMatchObject({ pointer: [0, 0], pressed: false });
      expect(captured.size).toBe(0);
      fireEvent.click(control, { detail: 1 });
      expect(input().focus).toBe(0);
    },
  );

  it("releases a held lens when the window loses focus", async () => {
    const control = await mountLens();
    fireEvent.pointerDown(control, touch);
    fireEvent.pointerMove(control, { ...touch, clientX: 300 });
    fireEvent.blur(window);
    expect(input()).toMatchObject({ pointer: [0, 0], pressed: false });
    expect(captured.size).toBe(0);
  });

  it("keeps desktop mouse parallax but ignores touches outside the lens", async () => {
    await mountLens();
    fireEvent.pointerMove(window, {
      ...touch,
      pointerType: "mouse",
      clientX: window.innerWidth,
      clientY: 0,
    });
    expect(input()).toMatchObject({ pointer: [1, 1], direct: false });
    fireEvent.pointerMove(window, {
      ...touch,
      clientX: 0,
      clientY: window.innerHeight,
    });
    expect(input().pointer).toEqual([1, 1]);
  });

  it("removes motion and releases touch capture when reduced motion is enabled", async () => {
    const control = await mountLens();
    fireEvent.pointerDown(control, touch);
    act(() => {
      reducedMotion = true;
      motion.dispatchEvent(new Event("change"));
    });
    await waitFor(() =>
      expect(screen.queryByTestId("lens-canvas")).not.toBeInTheDocument(),
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(captured.size).toBe(0);
    expect(document.querySelector(".hero-lens-fallback")).toBeInTheDocument();
  });
});
