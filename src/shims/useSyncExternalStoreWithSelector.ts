import React from 'react';

type Subscribe = (onStoreChange: () => void) => () => void;
type Selector<S, T> = (snapshot: S) => T;
type EqualityFn<T> = (a: T, b: T) => boolean;

function useSyncExternalStoreWithSelector<S, T>(
  subscribe: Subscribe,
  getSnapshot: () => S,
  getServerSnapshot: (() => S) | undefined,
  selector: Selector<S, T>,
  isEqual?: EqualityFn<T>
): T {
  const memoizedSelector = React.useMemo(() => {
    let hasMemo = false;
    let memoSnapshot: S;
    let memoSelection: T;

    return (snapshot: S): T => {
      if (!hasMemo) {
        hasMemo = true;
        memoSnapshot = snapshot;
        memoSelection = selector(snapshot);
        return memoSelection;
      }

      if (Object.is(snapshot, memoSnapshot)) {
        return memoSelection;
      }

      const nextSelection = selector(snapshot);
      if (isEqual && isEqual(memoSelection, nextSelection)) {
        memoSnapshot = snapshot;
        return memoSelection;
      }

      memoSnapshot = snapshot;
      memoSelection = nextSelection;
      return nextSelection;
    };
  }, [isEqual, selector]);

  const getSelection = React.useCallback(() => memoizedSelector(getSnapshot()), [getSnapshot, memoizedSelector]);
  const getServerSelection = React.useCallback(
    () => memoizedSelector(getServerSnapshot ? getServerSnapshot() : getSnapshot()),
    [getServerSnapshot, getSnapshot, memoizedSelector]
  );

  const selection = React.useSyncExternalStore(subscribe, getSelection, getServerSelection);
  React.useDebugValue(selection);
  return selection;
}

export { useSyncExternalStoreWithSelector };
export default { useSyncExternalStoreWithSelector };
