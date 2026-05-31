export type GamepadNavigationCommand =
  | 'back'
  | 'forward'
  | 'backFast'
  | 'forwardFast'
  | 'start'
  | 'end'
  | 'branchPrev'
  | 'branchNext';

export type GamepadNavigationInput = {
  command: GamepadNavigationCommand;
  key: string;
};

export type GamepadLike = {
  axes?: ArrayLike<number>;
  buttons?: ArrayLike<{ pressed?: boolean; value?: number }>;
};

const AXIS_THRESHOLD = 0.65;
const HAT_AXIS_INDEX = 9;
const HAT_AXIS_TOLERANCE = 0.08;

const HAT_AXIS_COMMANDS: Array<{ value: number; key: string; command: GamepadNavigationCommand }> = [
  { value: -1, key: 'up', command: 'branchPrev' },
  { value: -0.42857, key: 'right', command: 'forward' },
  { value: 0.14286, key: 'down', command: 'branchNext' },
  { value: 0.71429, key: 'left', command: 'back' },
];

function isButtonPressed(gamepad: GamepadLike, index: number): boolean {
  const button = gamepad.buttons?.[index];
  return !!button?.pressed || (button?.value ?? 0) > 0.5;
}

function buttonInput(gamepad: GamepadLike, index: number, command: GamepadNavigationCommand): GamepadNavigationInput | null {
  return isButtonPressed(gamepad, index) ? { command, key: `button:${index}` } : null;
}

function axisInput(
  gamepad: GamepadLike,
  index: number,
  direction: -1 | 1,
  command: GamepadNavigationCommand,
  threshold = AXIS_THRESHOLD
): GamepadNavigationInput | null {
  const value = gamepad.axes?.[index] ?? 0;
  if (direction < 0 && value <= -threshold) return { command, key: `axis:${index}:negative` };
  if (direction > 0 && value >= threshold) return { command, key: `axis:${index}:positive` };
  return null;
}

function hatAxisInput(gamepad: GamepadLike): GamepadNavigationInput | null {
  const value = gamepad.axes?.[HAT_AXIS_INDEX];
  if (typeof value !== 'number') return null;
  const match = HAT_AXIS_COMMANDS.find((item) => Math.abs(value - item.value) <= HAT_AXIS_TOLERANCE);
  return match ? { command: match.command, key: `axis:${HAT_AXIS_INDEX}:hat-${match.key}` } : null;
}

export function getGamepadNavigationInput(gamepad: GamepadLike): GamepadNavigationInput | null {
  return (
    buttonInput(gamepad, 4, 'backFast') ??
    buttonInput(gamepad, 5, 'forwardFast') ??
    buttonInput(gamepad, 14, 'back') ??
    buttonInput(gamepad, 15, 'forward') ??
    buttonInput(gamepad, 12, 'branchPrev') ??
    buttonInput(gamepad, 13, 'branchNext') ??
    buttonInput(gamepad, 8, 'start') ??
    buttonInput(gamepad, 9, 'end') ??
    buttonInput(gamepad, 1, 'back') ??
    buttonInput(gamepad, 0, 'forward') ??
    hatAxisInput(gamepad) ??
    axisInput(gamepad, 0, -1, 'back') ??
    axisInput(gamepad, 0, 1, 'forward') ??
    axisInput(gamepad, 1, -1, 'branchPrev') ??
    axisInput(gamepad, 1, 1, 'branchNext')
  );
}
