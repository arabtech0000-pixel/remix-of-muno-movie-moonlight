import { describe, expect, it, vi } from 'vitest';
import { beginPlayerLandscape } from '../muno/services/playerPresentation';

describe('Automatic landscape player presentation', () => {
  it('requests landscape on opening and unlocks when closed', async () => {
    let fullscreen = false;
    const lock = vi.fn(async () => {});
    const unlock = vi.fn();
    const exit = vi.fn(async () => { fullscreen = false; });
    const close = beginPlayerLandscape({
      isFullscreen: () => fullscreen,
      requestFullscreen: async () => { fullscreen = true; },
      exitFullscreen: exit, lockOrientation: lock, unlockOrientation: unlock,
    });
    await vi.waitFor(() => expect(lock).toHaveBeenCalledWith('landscape'));
    close();
    expect(unlock).toHaveBeenCalledOnce();
    expect(exit).toHaveBeenCalledOnce();
  });
  it('does not exit fullscreen belonging to the browser before opening', async () => {
    const exit = vi.fn(async () => {});
    const close = beginPlayerLandscape({ isFullscreen: () => true, requestFullscreen: vi.fn(), exitFullscreen: exit });
    close();
    expect(exit).not.toHaveBeenCalled();
  });
  it('cleans up even when closed before fullscreen finishes opening', async () => {
    let resolve: (() => void) | undefined;
    let fullscreen = false;
    const exit = vi.fn(async () => { fullscreen = false; });
    const lock = vi.fn(async () => {});
    const close = beginPlayerLandscape({
      isFullscreen: () => fullscreen,
      requestFullscreen: () => new Promise<void>(done => { resolve = () => { fullscreen = true; done(); }; }),
      exitFullscreen: exit, lockOrientation: lock,
    });
    close(); resolve?.();
    await vi.waitFor(() => expect(exit).toHaveBeenCalledOnce());
    expect(lock).not.toHaveBeenCalled();
  });
});