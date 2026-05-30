import { describe, expect, it } from 'vitest';
import {
  computeMoveTreeLayout,
  getVisibleMoveTreeItems,
  type MoveTreeLayoutItem,
} from '../src/utils/moveTreeLayout';

const item = (id: string, parentId: string | null, player: 'black' | 'white' | null = null): MoveTreeLayoutItem => ({
  id,
  parentId,
  label: id,
  player,
  isRoot: parentId === null,
  autoUndo: false,
});

describe('move tree layout', () => {
  it('lays out mainline and branches with stable parent-before-child positions', () => {
    const layout = computeMoveTreeLayout([
      item('root', null),
      item('a', 'root', 'black'),
      item('b', 'a', 'white'),
      item('branch', 'a', 'white'),
      item('branch-child', 'branch', 'black'),
    ]);

    const root = layout.nodes.find((node) => node.id === 'root');
    const a = layout.nodes.find((node) => node.id === 'a');
    const b = layout.nodes.find((node) => node.id === 'b');
    const branch = layout.nodes.find((node) => node.id === 'branch');

    expect(root?.gridX).toBe(0);
    expect(a?.gridX).toBe(1);
    expect(b?.gridX).toBe(2);
    expect(branch?.gridX).toBe(2);
    expect(branch?.gridY).toBeGreaterThanOrEqual(b?.gridY ?? 0);
    expect(layout.edges.map((edge) => edge.id)).toContain('a->branch');
    expect(layout.width).toBeGreaterThan(0);
    expect(layout.height).toBeGreaterThan(0);
  });

  it('filters nodes and elbow edges to the visible viewport with overscan', () => {
    const items: MoveTreeLayoutItem[] = [item('root', null)];
    for (let i = 1; i <= 80; i++) {
      items.push(item(`m${i}`, i === 1 ? 'root' : `m${i - 1}`, i % 2 === 0 ? 'white' : 'black'));
    }

    const layout = computeMoveTreeLayout(items);
    const visible = getVisibleMoveTreeItems(layout, { left: 0, top: 0, width: 120, height: 80 }, 0);

    expect(visible.nodes.length).toBeLessThan(layout.nodes.length);
    expect(visible.nodes.some((node) => node.id === 'root')).toBe(true);
    expect(visible.edges.length).toBeLessThan(layout.edges.length);
  });
});
