"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/** The classic Ariva map preloader: waits for eager images, shows progress. */
export default function Preloader() {
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [state, setState] = useState<"visible" | "exiting" | "hidden">("visible");

  useEffect(() => {
    const t0 = performance.now();
    let total = 0;
    let done = 0;
    let finished = false;
    const seen = new WeakSet<HTMLImageElement>();

    const update = () => setProgress({ done, total });

    const finish = () => {
      if (finished) return;
      finished = true;
      setState("exiting");
      window.setTimeout(() => setState("hidden"), 900);
    };

    const maybeFinish = () => {
      if (total > 0 && done >= total) {
        const elapsed = performance.now() - t0;
        if (elapsed >= 1500) finish();
        else window.setTimeout(finish, 1500 - elapsed);
      }
    };

    const register = (img: HTMLImageElement, isDone: boolean) => {
      if (seen.has(img)) return;
      seen.add(img);
      total += 1;
      if (isDone) done += 1;
      update();
      maybeFinish();
    };

    const onResource = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (!t || t.tagName !== "IMG") return;
      const img = t as HTMLImageElement;
      if (seen.has(img)) {
        done = Math.min(total, done + 1);
      } else {
        seen.add(img);
        total += 1;
        done += 1;
      }
      update();
      maybeFinish();
    };

    // Only eager (non-lazy) images gate the preloader.
    document
      .querySelectorAll<HTMLImageElement>('img:not([loading="lazy"])')
      .forEach((img) => register(img, img.complete));

    document.addEventListener("load", onResource, true);
    document.addEventListener("error", onResource, true);

    // Failsafe: never trap the visitor.
    const failsafe = window.setTimeout(finish, 20000);

    return () => {
      document.removeEventListener("load", onResource, true);
      document.removeEventListener("error", onResource, true);
      window.clearTimeout(failsafe);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = state === "hidden" ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [state]);

  if (state === "hidden") return null;

  const percent =
    progress.total > 0
      ? Math.min(100, Math.round((progress.done / progress.total) * 100))
      : 0;

  return (
    <div
      className={`preloader${state === "exiting" ? " preloader--exiting" : ""}`}
      aria-label="Ariva is loading"
    >
      <div className="preloader__map" aria-hidden="true">
        <Image src="/sri-lanka-map.svg" alt="" fill priority />
      </div>
      <div className="preloader__welcome">
        <span>Welcome to</span>
        <strong>Ariva</strong>
      </div>
      <div className="preloader__progress" aria-hidden="true">
        <div
          className="preloader__progress-bar"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="preloader__percent">{percent}%</p>
    </div>
  );
}
