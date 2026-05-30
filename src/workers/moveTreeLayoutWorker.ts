import { computeMoveTreeLayout, type MoveTreeLayout, type MoveTreeLayoutItem } from '../utils/moveTreeLayout';

type LayoutRequest = {
  requestId: number;
  items: MoveTreeLayoutItem[];
};

type LayoutResponse =
  | { requestId: number; ok: true; layout: MoveTreeLayout }
  | { requestId: number; ok: false; error: string };

self.onmessage = (event: MessageEvent<LayoutRequest>) => {
  const { requestId, items } = event.data;
  try {
    const response: LayoutResponse = {
      requestId,
      ok: true,
      layout: computeMoveTreeLayout(items),
    };
    self.postMessage(response);
  } catch (err) {
    const response: LayoutResponse = {
      requestId,
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
    self.postMessage(response);
  }
};

export {};
