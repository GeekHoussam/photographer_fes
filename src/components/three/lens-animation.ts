import type { RefObject } from "react";
import { MathUtils } from "three";
import type { Group } from "three";

export type LensInput = {
  progress: number;
  pointer: [number, number];
  direct: boolean;
  pressed: boolean;
  focus: number;
};

export function createLensInput(): LensInput {
  return {
    progress: 0,
    pointer: [0, 0],
    direct: false,
    pressed: false,
    focus: 0,
  };
}

const idleInput = createLensInput();

export function createLensMotion() {
  return { progress: 0, contact: 0, focusPulse: 0, lastFocus: 0 };
}

type LensParts = {
  group: RefObject<Group | null>;
  glass: RefObject<Group | null>;
  iris: RefObject<Group | null>;
  reflections: RefObject<Group | null>;
};

export function updateLensFrame(
  { group, glass, iris, reflections }: LensParts,
  motion: ReturnType<typeof createLensMotion>,
  input: RefObject<LensInput | undefined> | undefined,
  elapsedTime: number,
  delta: number,
) {
  if (!group.current) return;
  // Input stays outside React state so touch movement never rerenders the model.
  // Fast Refresh can briefly retain a canvas mounted with the previous props.
  // Keep drawing the idle lens until its live input reference arrives.
  const { pointer, progress, direct, pressed, focus } =
    input?.current ?? idleInput;
  const influence = direct ? 3 : 1;
  delta = Math.min(delta, 0.05);
  motion.contact = MathUtils.damp(motion.contact, pressed ? 1 : 0, 9, delta);
  if (focus !== motion.lastFocus) {
    motion.lastFocus = focus;
    motion.focusPulse = 1;
  }
  motion.focusPulse = MathUtils.damp(motion.focusPulse, 0, 3.6, delta);
  const focusAmount = Math.max(motion.contact * 0.6, motion.focusPulse);
  motion.progress = MathUtils.damp(motion.progress, progress, 5.5, delta);
  const scroll = motion.progress;
  const pointerDistance = Math.min(1, Math.hypot(pointer[0], pointer[1]));

  group.current.rotation.x = MathUtils.damp(
    group.current.rotation.x,
    pointer[1] * 0.1 * influence - 0.035,
    4.6,
    delta,
  );
  group.current.rotation.y = MathUtils.damp(
    group.current.rotation.y,
    pointer[0] * 0.12 * influence + 0.075,
    4.6,
    delta,
  );
  group.current.rotation.z = MathUtils.damp(
    group.current.rotation.z,
    scroll * 0.24 +
      pointer[0] * 0.025 * influence +
      Math.sin(elapsedTime * 0.26) * 0.008 +
      focusAmount * 0.06,
    4.2,
    delta,
  );
  group.current.position.x = MathUtils.damp(
    group.current.position.x,
    pointer[0] * 0.055 * influence,
    4.4,
    delta,
  );
  group.current.position.y = MathUtils.damp(
    group.current.position.y,
    pointer[1] * 0.04 * influence,
    4.4,
    delta,
  );
  group.current.position.z = MathUtils.damp(
    group.current.position.z,
    scroll * 0.08 + pointerDistance * 0.025 + focusAmount * 0.035,
    4.1,
    delta,
  );
  const targetScale = Math.min(
    1.06,
    0.96 + scroll * 0.1 + pointerDistance * 0.015 + focusAmount * 0.035,
  );
  const nextScale = MathUtils.damp(
    group.current.scale.x,
    targetScale,
    4.8,
    delta,
  );
  group.current.scale.setScalar(nextScale);

  if (glass.current) {
    glass.current.position.x = MathUtils.damp(
      glass.current.position.x,
      pointer[0] * -0.025 * influence,
      5.4,
      delta,
    );
    glass.current.position.y = MathUtils.damp(
      glass.current.position.y,
      pointer[1] * -0.02 * influence,
      5.4,
      delta,
    );
    glass.current.rotation.z = MathUtils.damp(
      glass.current.rotation.z,
      pointer[0] * -0.04 * influence + scroll * 0.055,
      4.8,
      delta,
    );
  }

  if (iris.current) {
    iris.current.rotation.z = MathUtils.damp(
      iris.current.rotation.z,
      -scroll * 0.48 +
        pointer[0] * 0.05 * influence +
        elapsedTime * 0.012 +
        focusAmount * 0.5,
      4.6,
      delta,
    );
    const irisScale = MathUtils.damp(
      iris.current.scale.x,
      1 - scroll * 0.065 + pointerDistance * 0.015 - focusAmount * 0.18,
      4.4,
      delta,
    );
    iris.current.scale.setScalar(irisScale);
  }

  if (reflections.current) {
    reflections.current.rotation.z = MathUtils.damp(
      reflections.current.rotation.z,
      (pointer[0] * 0.09 - pointer[1] * 0.05) * influence,
      5.6,
      delta,
    );
    reflections.current.position.x = MathUtils.damp(
      reflections.current.position.x,
      pointer[0] * -0.045 * influence,
      5.6,
      delta,
    );
    reflections.current.position.y = MathUtils.damp(
      reflections.current.position.y,
      pointer[1] * -0.035 * influence,
      5.6,
      delta,
    );
  }
}
