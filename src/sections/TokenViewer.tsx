import { Fragment, useState } from "react";
import { cn } from "~/utils/cn";

import BN from "bignumber.js";
import { Checkbox } from "~/components/Checkbox";
import { type TokenizerResult } from "~/models/tokenizer";

const COLORS = [
  "bg-sky-900/50",
  "bg-amber-900/50",
  "bg-blue-900/50",
  "bg-green-900/50",
  "bg-orange-900/50",
  "bg-cyan-900/50",
  "bg-gray-900/50",
  "bg-purple-900/50",
  "bg-indigo-900/50",
  "bg-lime-900/50",
  "bg-rose-900/50",
  "bg-violet-900/50",
  "bg-yellow-900/50",
  "bg-emerald-900/50",
  "bg-zinc-900/50",
  "bg-red-900/50",
  "bg-fuchsia-900/50",
  "bg-pink-900/50",
  "bg-teal-900/50",
];

function encodeWhitespace(str: string) {
  let result = str;

  result = result.replaceAll(" ", "⋅");
  result = result.replaceAll("\t", "→");
  result = result.replaceAll("\f", "\\f\f");
  result = result.replaceAll("\b", "\\b\b");
  result = result.replaceAll("\v", "\\v\v");

  result = result.replaceAll("\r", "\\r\r");
  result = result.replaceAll("\n", "\\n\n");
  result = result.replaceAll("\\r\r\\n\n", "\\r\\n\r\n");

  return result;
}

export function TokenViewer(props: {
  isFetching: boolean;
  model: string | undefined;
  data: TokenizerResult | undefined;
}) {
  const [indexHover, setIndexHover] = useState<null | number>(null);

  const tokenCount =
    props.data?.segments?.reduce((memo, i) => memo + i.tokens.length, 0) ?? 0;

  const [showWhitespace, setShowWhitespace] = useState(false);

  return (
    <>
      <div className="flex gap-4">
        <div className="flex-grow rounded-md border border-slate-700 bg-slate-800 p-4 shadow-sm">
          <p className="text-sm text-slate-400">Token count</p>
          <p className="text-lg text-white">{tokenCount}</p>
        </div>
      </div>

      <pre className="min-h-[256px] max-w-[100vw] overflow-auto whitespace-pre-wrap break-all rounded-md border border-slate-700 bg-slate-800 p-4 shadow-sm dark-scrollbar">
        {props.data?.segments?.map(({ text }, idx) => (
          <span
            key={idx}
            onMouseEnter={() => setIndexHover(idx)}
            onMouseLeave={() => setIndexHover(null)}
            className={cn(
              "transition-all",
              (indexHover == null || indexHover === idx) &&
              COLORS[idx % COLORS.length],
              props.isFetching && "opacity-50"
            )}
          >
            {showWhitespace || indexHover === idx
              ? encodeWhitespace(text)
              : text}
          </span>
        ))}
      </pre>

      <pre
        className={
          "min-h-[256px] max-w-[100vw] overflow-auto whitespace-pre-wrap break-all rounded-md border border-slate-700 bg-slate-800 p-4 shadow-sm dark-scrollbar"
        }
      >
        {props.data && tokenCount > 0 && (
          <span
            className={cn(
              "transition-opacity",
              props.isFetching && "opacity-50"
            )}
          >
            {props.data?.segments?.map((segment, segmentIdx) => (
              <Fragment key={segmentIdx}>
                {segment.tokens.map((token) => (
                  <Fragment key={token.idx}>
                    <span
                      onMouseEnter={() => setIndexHover(segmentIdx)}
                      onMouseLeave={() => setIndexHover(null)}
                      className={cn(
                        "transition-colors",
                        indexHover === segmentIdx &&
                        COLORS[segmentIdx % COLORS.length]
                      )}
                    >
                      {token.id}
                    </span>
                    <span className="last-of-type:hidden">{", "}</span>
                  </Fragment>
                ))}
              </Fragment>
            ))}
          </span>
        )}
      </pre>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={showWhitespace}
          onClick={() => setShowWhitespace((v) => !v)}
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Show whitespace
        </label>
      </div>
    </>
  );
}
