# virtual-text-layout

Pre-compute virtual list item heights from text content using canvas — zero DOM measurement on the scroll path.

**[Live demo →](https://www.sponsorsearch.co.uk/?search=han)**

Built on [@chenglou/pretext](https://github.com/chenglou/pretext). Pairs with [@tanstack/react-virtual](https://tanstack.com/virtual) or any virtualizer that accepts an `estimateSize` function.

Peer dependencies: `react >= 18`, `@chenglou/pretext`

## Why not use pretext directly?

pretext gives you `prepare()` and `layout()` — low-level primitives for canvas text measurement. This hook handles the integration work you'd otherwise write yourself: waiting for fonts to load before measuring, tracking container width via ResizeObserver, incrementally preparing new items as they stream in (infinite scroll), and signalling when everything is ready so your virtualizer doesn't render with stale sizes.

## Usage

```tsx
import { useVirtualTextLayout } from "virtual-text-layout";
import { useWindowVirtualizer } from "@tanstack/react-virtual";

const { estimateSize, ready } = useVirtualTextLayout(items, {
  fields: [
    { getText: (item) => item.title, font: "600 16px Inter", lineHeight: 24 },
    { getText: (item) => item.subtitle, font: "14px Inter", lineHeight: 20 },
  ],
  fixedHeight: 48, // total px of non-text elements (padding, icons, etc.)
  containerRef: listRef,
});

const virtualizer = useWindowVirtualizer({
  count: ready ? items.length : 0,
  estimateSize: (index) => estimateSize(index),
});
```

`ready` is `true` once fonts are loaded and container width is measured. Gate your virtualizer's `count` on it to prevent rendering with incorrect sizes.

## Configuration

| Option          | Type            | Description                                                                                                                                                                                                                                                                                    |
| --------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `items`         | `T[]`           | The array of data you're rendering (search results, messages, rows, whatever). The hook is generic over the item type — `getText` receives one of these items and returns the string to measure. Growing the array is cheap (incremental prep for infinite scroll); shrinking resets metrics. |
| `fields`        | `TextField<T>[]` | Text fields whose height varies with wrapping (see table below).                                                                                                                                                                                                                               |
| `fixedHeight`   | `number`        | Total height in px of fixed-size card elements (padding, margins, icons, single-line text).                                                                                                                                                                                                    |
| `containerRef`  | `RefObject`     | Ref to a DOM element with the same horizontal padding as the list container.                                                                                                                                                                                                                   |

### `TextField<T>`

| Field        | Type                   | Description                                                                                |
| ------------ | ---------------------- | ------------------------------------------------------------------------------------------ |
| `getText`    | `(item: T) => string`  | Extracts the text string from an item, including any transforms applied before render.     |
| `font`       | `string`               | Canvas font shorthand (e.g. `'600 16px Inter'`). Must match your rendered CSS.             |
| `lineHeight` | `number`               | Line height in px. Must match your CSS `line-height`.                                      |

## Returns

| Field          | Type                         | Description                                                                                                                                                                                                                                                                   |
| -------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `estimateSize` | `(index: number) => number`  | Returns the pre-computed height in px for the item at `index`. Pass directly to your virtualizer's `estimateSize` option. Before the container width is measured, falls back to a single-line estimate per field + `fixedHeight`.                                            |
| `ready`        | `boolean`                    | `true` once fonts have loaded and the container width has been measured — i.e. `estimateSize` is now returning real measurements instead of fallbacks. Gate your virtualizer's `count` on this so it doesn't render with pre-measurement sizes.                              |
| `contentWidth` | `number`                     | The current content-box width of the container in px, updated via `ResizeObserver`. Use it as a `useEffect` dependency to trigger `virtualizer.measure()` on resize — otherwise the virtualizer keeps its cached sizes and rows don't re-flow when the container width changes. |

## Examples with TanStack Virtual

Two complete, runnable examples live in [`examples/`](examples):

- [`ScrollContainerList.tsx`](examples/ScrollContainerList.tsx) — uses `useVirtualizer` with an internal scroll container.
- [`WindowScrollList.tsx`](examples/WindowScrollList.tsx) — uses `useWindowVirtualizer` for page-level scrolling.

To run the playground locally:

```bash
cd examples
bun install
bun run dev
```

Key details:
- `scrollRef` is passed to both the virtualizer (`getScrollElement`) and the hook (`containerRef`) — the scroll container also defines the content width, so the measurement matches the render.
- The CSS `font` / `lineHeight` on the rendered `<div>`s **must match** what's passed to `fields` — otherwise canvas measurement and DOM rendering disagree.
- `count` is gated on `ready` so the virtualizer doesn't render with stale (pre-measurement) sizes.
- For `useWindowVirtualizer` (page-level scrolling), skip `getScrollElement` and still pass `containerRef` to a DOM node matching the list's horizontal padding.

## Performance

Measured scrolling through 250 rows (5 pages):

| Metric              | measureElement | virtual-text-layout | Change |
| ------------------- | -------------- | ------------------- | ------ |
| Recalculate style   | 300ms          | 171ms               | -43%   |
| Layout              | 194ms          | 125ms               | -35%   |
| Function call total | 1,383ms        | 968ms               | -30%   |
| Paint               | 33ms           | 25ms                | -26%   |

## License

MIT
