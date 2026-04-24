# Changelog

All notable changes to `virtual-text-layout` are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-04-24

### Added

- `letterSpacing` optional field on `TextField<T>` mirror your CSS `letter-spacing` as a px number so canvas measurement matches DOM rendering.

## [0.1.9] - 2026-04-23

### Changed

- Performance: incremental `prepare()` pass now only walks newly-appended items instead of the entire cache on each update.

## [0.1.8] - 2026-04-23

### Changed

- Bumped `@chenglou/pretext` to `0.0.6`.

## [0.1.7] - 2026-04-20

### Fixed

- Corrected Amine Benaddi's social link in the README credits.

## [0.1.6] - 2026-04-20

### Added

- Credits section in the README acknowledging Amine Benaddi's StackBlitz demo that inspired the library.

## [0.1.5] - 2026-04-18

### Changed

- Documentation improvements.

## [0.1.4] - 2026-04-17

### Fixed

- `ResizeObserver` now re-attaches when `containerRef` points to a different element across renders. Previously the observer only ran once on mount, so swapping the ref between DOM nodes (e.g. loading vs loaded branches) lost width tracking.

## [0.1.3] - 2026-04-17

### Added

- Two runnable TanStack Virtual examples (`ScrollContainerList.tsx` and `WindowScrollList.tsx`) plus expanded README usage docs.

## [0.1.2] - 2026-04-17

### Changed

- README updates.

## [0.1.1] - 2026-04-17

Republish — no functional changes.

## [0.1.0] - 2026-04-17

Initial release.

### Added

- `useVirtualTextLayout` hook for canvas-based virtual list height estimation via `@chenglou/pretext`.
- Multi-field `TextField<T>` config with `font`, `lineHeight`, and per-hook `fixedHeight`.
- `document.fonts.ready` gating plus one-frame delay so canvas measurements use the real rendered font, not the fallback.
- `ResizeObserver`-backed content-width tracking with ref re-attachment across renders.
- Incremental prepare pass for infinite-scroll appends — growth is cheap, shrinkage resets the metrics cache.
- `ready` signal so virtualizers can gate `count` until fonts, data, and container width are all available.

[Unreleased]: https://github.com/nikilok/virtual-text-layout/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/nikilok/virtual-text-layout/compare/v0.1.9...v0.2.0
[0.1.9]: https://github.com/nikilok/virtual-text-layout/compare/v0.1.8...v0.1.9
[0.1.8]: https://github.com/nikilok/virtual-text-layout/compare/v0.1.7...v0.1.8
[0.1.7]: https://github.com/nikilok/virtual-text-layout/compare/v0.1.6...v0.1.7
[0.1.6]: https://github.com/nikilok/virtual-text-layout/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/nikilok/virtual-text-layout/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/nikilok/virtual-text-layout/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/nikilok/virtual-text-layout/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/nikilok/virtual-text-layout/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/nikilok/virtual-text-layout/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/nikilok/virtual-text-layout/releases/tag/v0.1.0
