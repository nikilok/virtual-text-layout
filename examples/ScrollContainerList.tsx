import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef } from "react";
import { useVirtualTextLayout } from "virtual-text-layout";

type Row = { id: string; title: string; subtitle: string };

const TITLE_FONT = "600 16px Inter";
const TITLE_LINE_HEIGHT = 24;
const SUBTITLE_FONT = "14px Inter";
const SUBTITLE_LINE_HEIGHT = 20;
const ROW_PADDING_Y = 24;

export function ScrollContainerList({ items }: { items: Row[] }) {
	const scrollRef = useRef<HTMLDivElement>(null);

	const { estimateSize, ready, contentWidth } = useVirtualTextLayout(items, {
		fields: [
			{
				getText: (item) => item.title,
				font: TITLE_FONT,
				lineHeight: TITLE_LINE_HEIGHT,
			},
			{
				getText: (item) => item.subtitle,
				font: SUBTITLE_FONT,
				lineHeight: SUBTITLE_LINE_HEIGHT,
			},
		],
		fixedHeight: ROW_PADDING_Y * 2,
		containerRef: scrollRef,
	});

	const virtualizer = useVirtualizer({
		count: ready ? items.length : 0,
		getScrollElement: () => scrollRef.current,
		estimateSize: (index) => estimateSize(index),
		overscan: 5,
	});

	// Force the virtualizer to recompute row heights when the container width changes,
	// otherwise it keeps the sizes it cached from the previous width.
	useEffect(() => {
		if (contentWidth > 0) virtualizer.measure();
	}, [contentWidth, virtualizer]);

	return (
		<div
			ref={scrollRef}
			style={{ height: 600, overflow: "auto", padding: "0 16px" }}
		>
			<div
				style={{
					height: virtualizer.getTotalSize(),
					position: "relative",
					width: "100%",
				}}
			>
				{virtualizer.getVirtualItems().map((vi) => {
					const item = items[vi.index];
					return (
						<div
							key={item.id}
							style={{
								position: "absolute",
								top: 0,
								left: 0,
								width: "100%",
								transform: `translateY(${vi.start}px)`,
								height: vi.size,
								padding: `${ROW_PADDING_Y}px 0`,
								boxSizing: "border-box",
							}}
						>
							<div
								style={{
									font: TITLE_FONT,
									lineHeight: `${TITLE_LINE_HEIGHT}px`,
								}}
							>
								{item.title}
							</div>
							<div
								style={{
									font: SUBTITLE_FONT,
									lineHeight: `${SUBTITLE_LINE_HEIGHT}px`,
								}}
							>
								{item.subtitle}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
