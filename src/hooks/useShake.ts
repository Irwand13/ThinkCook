import { Accelerometer } from 'expo-sensors';
import { useEffect, useRef } from 'react';

const SHAKE_THRESHOLD = 2.2;
const SHAKE_COOLDOWN_MS = 1000;

export function useShake(onShake: () => void, enabled = true): void {
  const callbackRef = useRef(onShake);
  const lastShakeRef = useRef(0);

  useEffect(() => {
    callbackRef.current = onShake;
  }, [onShake]);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    let subscription: { remove: () => void } | null = null;
    let aktif = true;

    void Accelerometer.isAvailableAsync().then((available) => {
      if (!available || !aktif) {
        return;
      }
      Accelerometer.setUpdateInterval(100);
      subscription = Accelerometer.addListener(({ x, y, z }) => {
        const magnitude = Math.sqrt(x * x + y * y + z * z);
        const now = Date.now();
        if (magnitude > SHAKE_THRESHOLD && now - lastShakeRef.current > SHAKE_COOLDOWN_MS) {
          lastShakeRef.current = now;
          callbackRef.current();
        }
      });
    });

    return () => {
      aktif = false;
      subscription?.remove();
    };
  }, [enabled]);
}
