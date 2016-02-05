import expect, { createSpy } from 'expect';

export function testRequiredParam(handler, param) {
  return async function test() {
    const { fns, ctx, next } = this;
    delete ctx.request.body[param];
    const errorHandler = createSpy().andCall(e => {
      expect(e.message)
      .toMatch(new RegExp(`${param}`))
      .toMatch(/missing|invalid input/i);
    });
    await handler(fns)(ctx, next).catch(errorHandler);
    expect(errorHandler).toHaveBeenCalled();
    expect(next).toNotHaveBeenCalled();
    for (const fn of Object.keys(fns)) {
      expect(fns[fn]).toNotHaveBeenCalled();
    }
  };
}
