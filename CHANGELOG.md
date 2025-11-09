## 1.1.1 - 2025-11-09

### What’s Changed (v1.1.1)

#### Fixes

- Restore production layout/animation: ensure inline SFC styles are bundled so items no longer stack at `(0,0)` and transitions render correctly.
- Align `<TransitionGroup name="vsg">` class names with CSS selectors to avoid mismatches in prod builds.
- Guard against missing container element during early mounts to prevent skipped `transform` writes.
- Ensure `reflow()` is exposed from the component instance in build output.
- Correct `exports`/`types` paths to keep TS and bundlers happy in consuming apps.

## 1.1.0 - 2025-11-09

### What’s Changed

- feat: add built-in transition presets (`fade`, `scale`, `slide-up`, `slide-fade`, `none`) via `transition` prop
- feat: support custom transition config `{ preset, duration, easing, stagger, animateInitial }`
- feat: expose `reflow()` publicly via `defineExpose({ reflow })`
- docs: update demo/landing to showcase transition presets & custom tuning
- fix: ignore leaving nodes during `reflow()` to avoid layout jumps on exit animations
- fix: ensure resize listener is cleaned up on unmount
- fix: safer container/children guards to prevent undefined access during tests
- test: switch to `happy-dom` to avoid `jsdom/parse5` ESM issues
- test: make resize test deterministic (mock `clientWidth`, force `reflow()`)
- types: keep all TS types in `src/types/index.ts` and use them in SFC without leaking TS into template

## 1.0.10 - 2025-08-28

### What's Changed

* Update vue-stack-grid.d.ts by @mdxiaohu in https://github.com/chiribuc/vue-stack-grid/pull/4

### New Contributors

* @mdxiaohu made their first contribution in https://github.com/chiribuc/vue-stack-grid/pull/4

**Full Changelog**: https://github.com/chiribuc/vue-stack-grid/compare/1.0.9...1.0.10

## 1.0.9 - 2024-12-09

**Full Changelog**: https://github.com/chiribuc/vue-stack-grid/compare/1.0.8...1.0.9

## 1.0.8 - 2024-12-09

**Full Changelog**: https://github.com/chiribuc/vue-stack-grid/compare/1.0.7...1.0.8

## 1.0.7 - 2024-12-09

**Full Changelog**: https://github.com/chiribuc/vue-stack-grid/compare/1.0.5...1.0.7

## 1.0.6 - 2024-12-09

**Full Changelog**: https://github.com/chiribuc/vue-stack-grid/compare/1.0.5...1.0.6

## 1.0.5 - 2024-12-09

**Full Changelog**: https://github.com/chiribuc/vue-stack-grid/compare/1.04...1.0.5

## 1.04 - 2024-12-09

**Full Changelog**: https://github.com/chiribuc/vue-stack-grid/compare/1.0.3...1.04

## 1.0.3 - 2024-12-09

**Full Changelog**: https://github.com/chiribuc/vue-stack-grid/compare/1.0.2...1.0.3

## 1.0.2 - 2024-12-09

**Full Changelog**: https://github.com/chiribuc/vue-stack-grid/compare/1.0.1...1.0.2

## 1.0.0 - 2024-04-08

- initial release
