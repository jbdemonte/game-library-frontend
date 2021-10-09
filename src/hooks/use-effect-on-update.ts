import { EffectCallback, useEffect, useRef } from 'react';

// Based on https://stackoverflow.com/questions/53253940/make-react-useeffect-hook-not-run-on-initial-render

export const useEffectOnUpdate = (effect: EffectCallback, deps: Array<any>): void => {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) {
      const unmount = effect();
      return () => unmount && unmount();
    } else {
      mounted.current = true;
    }
  // eslint-disable-next-line
  }, deps);

  // Reset on unmount for the next mount.
  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);
};
