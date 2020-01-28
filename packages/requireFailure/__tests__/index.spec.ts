import { create } from '@testUtils';
import AnyTouch from '@any-touch/core';
import Tap from '@any-touch/tap';
import requireFailure from '@any-touch/requireFailure';
import { GestureSimulator, sleep } from '@any-touch/simulator';
test('单击需要等待300ms, 如果届时双击状态为失败那么触发单击', async (done) => {
    const DOUBLE_TAP_NAME = 'doubletap';
    const { mockCB, sleep } = create();
    AnyTouch.use(Tap);
    AnyTouch.use(Tap, { name: DOUBLE_TAP_NAME, tapTimes: 2 });
    AnyTouch.use(requireFailure, 'tap', DOUBLE_TAP_NAME);
    const el = document.createElement('div');
    const gs = new GestureSimulator(el);
    const at = new AnyTouch(el);
    at.on('tap', ev => {
        mockCB(ev.type);
    });

    at.on(DOUBLE_TAP_NAME, ev => {
        mockCB(ev.type);
    });

    gs.dispatchTouchStart();
    gs.dispatchTouchEnd();
    gs.dispatchTouchStart();
    gs.dispatchTouchEnd();

    await sleep(350);
    expect(mockCB).toHaveBeenCalledTimes(1);
    expect(mockCB).toHaveBeenCalledWith(DOUBLE_TAP_NAME);
    done();
});