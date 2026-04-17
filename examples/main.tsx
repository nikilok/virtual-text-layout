import { useState } from "react";
import { createRoot } from "react-dom/client";
import { ScrollContainerList } from "./ScrollContainerList";
import { WindowScrollList } from "./WindowScrollList";

const SAMPLE_TITLES = [
	"Short title",
	"A medium-length title that will probably fit on one line in most viewports",
	"An intentionally very long title that should wrap onto multiple lines when the container is narrow, triggering the canvas-based height pre-computation that this library is designed to handle efficiently",
];

const SAMPLE_SUBTITLES = [
	"One line subtitle",
	"A two-line subtitle that wraps somewhere in the middle depending on container width and the chosen font size",
	"A longer subtitle with enough content to wrap to three lines on most reasonable viewport widths, demonstrating how row heights vary across the list",
];

const items = Array.from({ length: 500 }, (_, i) => ({
	id: String(i),
	title: `${i + 1}. ${SAMPLE_TITLES[i % SAMPLE_TITLES.length]}`,
	subtitle: SAMPLE_SUBTITLES[i % SAMPLE_SUBTITLES.length],
}));

function App() {
	const [tab, setTab] = useState<"scroll" | "window">("scroll");
	return (
		<>
			<nav className="nav">
				<button
					type="button"
					aria-pressed={tab === "scroll"}
					onClick={() => setTab("scroll")}
				>
					useVirtualizer (scroll container)
				</button>
				<button
					type="button"
					aria-pressed={tab === "window"}
					onClick={() => setTab("window")}
				>
					useWindowVirtualizer
				</button>
			</nav>
			{tab === "scroll" ? (
				<ScrollContainerList items={items} />
			) : (
				<WindowScrollList items={items} />
			)}
		</>
	);
}

const root = document.getElementById("root");
if (!root) throw new Error("#root not found");
createRoot(root).render(<App />);
