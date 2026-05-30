import React, { useEffect, useMemo, useRef, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { useGameStore } from '../store/gameStore';
import type { GameNode } from '../types';
import {
  MOVE_TREE_LAYOUT_WORKER_THRESHOLD,
  computeMoveTreeLayout,
  flattenMoveTree,
  getVisibleMoveTreeItems,
  type MoveTreeLayout,
  type MoveTreeViewport,
} from '../utils/moveTreeLayout';

type LayoutWorkerResponse =
  | { requestId: number; ok: true; layout: MoveTreeLayout }
  | { requestId: number; ok: false; error: string };

const EMPTY_VIEWPORT: MoveTreeViewport = { left: 0, top: 0, width: 640, height: 220 };

function indexNodes(root: GameNode): Map<string, GameNode> {
  const map = new Map<string, GameNode>();
  const stack: GameNode[] = [root];
  while (stack.length > 0) {
    const node = stack.pop()!;
    map.set(node.id, node);
    for (let i = node.children.length - 1; i >= 0; i--) {
      stack.push(node.children[i]!);
    }
  }
  return map;
}

export const MoveTree: React.FC<{ onSelectNode?: (node: GameNode) => void }> = ({ onSelectNode }) => {
  const { rootNode, currentNode, jumpToNode, treeVersion, isInsertMode } = useGameStore(
    (state) => ({
      rootNode: state.rootNode,
      currentNode: state.currentNode,
      jumpToNode: state.jumpToNode,
      treeVersion: state.treeVersion,
      isInsertMode: state.isInsertMode,
    }),
    shallow
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const requestIdRef = useRef(0);
  const [workerResult, setWorkerResult] = useState<{
    key: string;
    layout: MoveTreeLayout;
    status: 'worker' | 'fallback';
  } | null>(null);
  const [viewport, setViewport] = useState<MoveTreeViewport>(EMPTY_VIEWPORT);

  const flatTree = useMemo(() => {
    void treeVersion;
    return flattenMoveTree(rootNode);
  }, [rootNode, treeVersion]);

  const nodeById = useMemo(() => {
    void treeVersion;
    return indexNodes(rootNode);
  }, [rootNode, treeVersion]);

  const shouldUseWorker = typeof Worker !== 'undefined' && flatTree.length >= MOVE_TREE_LAYOUT_WORKER_THRESHOLD;
  const layoutKey = `${rootNode.id}:${treeVersion}:${flatTree.length}`;
  const syncLayout = useMemo(
    () => (shouldUseWorker ? null : computeMoveTreeLayout(flatTree)),
    [flatTree, shouldUseWorker]
  );
  const workerLayout = shouldUseWorker && workerResult?.key === layoutKey ? workerResult.layout : null;
  const layout = syncLayout ?? workerLayout;
  const layoutStatus = shouldUseWorker
    ? workerResult?.key === layoutKey
      ? workerResult.status
      : 'working'
    : 'sync';

  useEffect(() => {
    if (!shouldUseWorker) return;

    const requestId = ++requestIdRef.current;
    const key = layoutKey;
    const applyFallback = () => {
      if (requestId !== requestIdRef.current) return;
      setWorkerResult({ key, layout: computeMoveTreeLayout(flatTree), status: 'fallback' });
    };
    try {
      if (!workerRef.current) {
        workerRef.current = new Worker(new URL('../workers/moveTreeLayoutWorker.ts', import.meta.url), {
          type: 'module',
        });
      }
      const worker = workerRef.current;
      worker.onmessage = (event: MessageEvent<LayoutWorkerResponse>) => {
        const msg = event.data;
        if (msg.requestId !== requestIdRef.current) return;
        if (msg.ok) {
          setWorkerResult({ key, layout: msg.layout, status: 'worker' });
          return;
        }
        applyFallback();
      };
      worker.onerror = () => {
        applyFallback();
      };
      worker.postMessage({ requestId, items: flatTree });
    } catch {
      queueMicrotask(applyFallback);
    }
  }, [flatTree, layoutKey, shouldUseWorker]);

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setViewport({
          left: container.scrollLeft,
          top: container.scrollTop,
          width: container.clientWidth || EMPTY_VIEWPORT.width,
          height: container.clientHeight || EMPTY_VIEWPORT.height,
        });
      });
    };

    update();
    container.addEventListener('scroll', update, { passive: true });
    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
    resizeObserver?.observe(container);
    return () => {
      cancelAnimationFrame(frame);
      container.removeEventListener('scroll', update);
      resizeObserver?.disconnect();
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !layout) return;
    const pos = layout.nodes.find((node) => node.id === currentNode.id);
    if (!pos) return;

    const targetLeft = Math.max(0, pos.x - container.clientWidth * 0.5);
    const targetTop = Math.max(0, pos.y - container.clientHeight * 0.5);
    container.scrollTo({ left: targetLeft, top: targetTop, behavior: 'smooth' });
  }, [currentNode, layout]);

  const visible = useMemo(() => (layout ? getVisibleMoveTreeItems(layout, viewport) : null), [layout, viewport]);

  if (!layout || !visible) {
    return (
      <div ref={containerRef} className="relative w-full h-full min-h-28 overflow-auto ui-surface">
        <div className="absolute inset-0 grid place-items-center text-[11px] uppercase tracking-wide ui-text-muted">
          Laying out move tree
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-auto ui-surface" data-tree-layout={layoutStatus}>
      <svg width={layout.width} height={layout.height} viewBox={`0 0 ${layout.width} ${layout.height}`}>
        {visible.edges.map((l) => (
          <polyline
            key={l.id}
            points={l.points}
            fill="none"
            stroke="#9CA3AF"
            strokeWidth="1"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}

        {visible.nodes.map((layoutNode) => {
          const node = nodeById.get(layoutNode.id);
          const isCurrent = layoutNode.id === currentNode.id;
          const isAutoUndone = layoutNode.autoUndo === true;
          const isRoot = layoutNode.isRoot;
          const isBlack = layoutNode.player === 'black';
          const fill = isRoot ? 'none' : isBlack ? '#0B0B0B' : '#F9FAFB';
          const stroke = isRoot ? '#9CA3AF' : isBlack ? '#F9FAFB' : '#0B0B0B';

          return (
            <g key={layoutNode.id} style={{ cursor: isRoot || isInsertMode ? 'default' : 'pointer' }}>
              {isAutoUndone && (
                <circle cx={layoutNode.x} cy={layoutNode.y} r={layout.radius + 4} fill="none" stroke="#EF4444" strokeWidth="2" />
              )}
              {isCurrent && (
                <circle cx={layoutNode.x} cy={layoutNode.y} r={layout.radius + 7} fill="none" stroke="#FACC15" strokeWidth="2" />
              )}
              <circle
                cx={layoutNode.x}
                cy={layoutNode.y}
                r={layout.radius}
                fill={fill}
                stroke={stroke}
                strokeWidth="1"
                onClick={() => {
                  if (isInsertMode) return;
                  if (!isRoot && node) {
                    jumpToNode(node);
                    onSelectNode?.(node);
                  }
                }}
              >
                <title>{layoutNode.label}</title>
              </circle>
            </g>
          );
        })}
      </svg>
      {layoutStatus === 'working' && (
        <div className="pointer-events-none sticky bottom-1 left-1 inline-flex rounded bg-[var(--ui-surface)]/90 px-2 py-1 text-[10px] uppercase tracking-wide ui-text-muted">
          Laying out {flatTree.length} nodes
        </div>
      )}
    </div>
  );
};
