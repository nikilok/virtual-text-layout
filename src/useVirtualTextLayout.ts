import { layout, prepare } from "@chenglou/pretext";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type {
	UseVirtualTextLayoutOptions,
	UseVirtualTextLayoutResult,
} from "./types";

export function useVirtualTextLayout<T>(
	items: T[],
	options: UseVirtualTextLayoutOptions<T>,
): UseVirtualTextLayoutResult {
	const { fields, fixedHeight, containerRef } = options;
	const metricsRef = useRef<ReturnType<typeof prepare>[][]>([]);
	const observedElRef = useRef<Element | null>(null);
	const observerRef = useRef<ResizeObserver | null>(null);
	const [fontsReady, setFontsReady] = useState(false);
	const [contentWidth, setContentWidth] = useState(0);

	// Wait for fonts to be downloaded AND rendered before allowing prepare() —
	// canvas needs one frame after font load to use it for measurement.
	useEffect(() => {
		document.fonts.ready.then(() => {
			requestAnimationFrame(() => setFontsReady(true));
		});
	}, []);

	// Track whichever element containerRef points at. Runs every commit with an
	// identity check, so consumers that swap the ref between DOM nodes (e.g.
	// loading vs loaded branches) get the ResizeObserver re-attached without
	// having to keep a single stable element mounted.
	useLayoutEffect(() => {
		const el = containerRef.current;
		if (el === observedElRef.current) return;

		observerRef.current?.disconnect();
		observerRef.current = null;
		observedElRef.current = el;

		if (!el) return; // keep last known contentWidth across brief unmounts

		const style = getComputedStyle(el);
		const paddingX =
			parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
		setContentWidth(Math.floor(el.clientWidth - paddingX));

		const ro = new ResizeObserver((entries) => {
			const width = entries[0]?.contentBoxSize?.[0]?.inlineSize;
			if (width) setContentWidth(Math.floor(width));
		});
		ro.observe(el);
		observerRef.current = ro;
	});

	// Final cleanup when the hook itself unmounts.
	useEffect(() => () => observerRef.current?.disconnect(), []);

	// Only prepare once fonts are loaded — single pass with correct metrics
	if (fontsReady) {
		if (items.length < metricsRef.current.length) {
			metricsRef.current = []; // data reset (e.g. new search)
		}
		if (items.length > metricsRef.current.length) {
			metricsRef.current = [
				...metricsRef.current,
				...items
					.slice(metricsRef.current.length)
					.map((item) =>
						fields.map((field) => prepare(field.getText(item), field.font)),
					),
			];
		}
	}

	const ready = fontsReady && contentWidth > 0;

	const estimateSize = (index: number): number => {
		const handles = metricsRef.current[index];
		if (!handles || !contentWidth) {
			// Before width is measured — assume single-line text fields
			return fixedHeight + fields.reduce((sum, f) => sum + f.lineHeight, 0);
		}
		let height = fixedHeight;
		for (let i = 0; i < handles.length; i++) {
			height += layout(handles[i], contentWidth, fields[i].lineHeight).height;
		}
		return height;
	};

	return { estimateSize, ready, contentWidth };
}
