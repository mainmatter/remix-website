import { Fragment, useEffect, useMemo, useState } from "react";
import { type Resource } from "~/lib/resources.server";
import { Form, useSearchParams } from "react-router";
import cx from "clsx";
import iconsHref from "~/icons.svg";

import "~/styles/resources.css";

type ResourceTagProps = {
  value: string;
  children: React.ReactNode;
  selected?: boolean;
};

export function ResourceTag({
  value,
  children,
  selected: _selected,
}: ResourceTagProps) {
  let [searchParams] = useSearchParams();

  let selected = _selected ?? searchParams.has("tag", value);

  let hiddenInputs = useMemo(() => {
    const seenTags = new Set<string>([value]);
    return [
      ...[...searchParams.entries()].map(([param, paramValue], key) => {
        let seen =
          param === "tag" && (seenTags.has(paramValue) || paramValue === value);
        seenTags.add(paramValue);
        if (seen) {
          return <Fragment key={key} />;
        }
        return (
          <input key={key} type="hidden" name={param} value={paramValue} />
        );
      }),
    ];
  }, [searchParams, value]);

  return (
    <Form action="/resources" className="inline-flex">
      {hiddenInputs}
      <button
        type="submit"
        className={cx(
          "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium leading-none ring-1 ring-inset",
          selected
            ? "bg-blue-100 ring-blue-500/10 hover:bg-blue-200 dark:bg-gray-300 dark:text-gray-900 dark:ring-gray-900/50 dark:hover:bg-gray-400 dark:hover:text-gray-900"
            : "bg-gray-50 text-gray-600 ring-gray-500/10 hover:bg-blue-100 dark:bg-gray-900 dark:text-gray-300 dark:ring-gray-200/50 dark:hover:bg-gray-400 dark:hover:text-gray-900",
        )}
        name={selected ? undefined : "tag"}
        value={selected ? undefined : value}
      >
        <span className="sr-only">{selected ? "remove" : "add"}</span>
        {children}
        <span className="sr-only">tag</span>
        {selected ? (
          <svg aria-hidden className="-mr-1 h-3.5 w-3.5" viewBox="0 0 14 14">
            <use href={`${iconsHref}#x-mark`} />
          </svg>
        ) : null}
      </button>
    </Form>
  );
}

export function InitCodeblock({
  initCommand,
  // Eh, not the best API, but I needed this
  rounded = "full",
}: Pick<Resource, "initCommand"> & {
  rounded?: "full" | "bottom";
}) {
  // Probably a more elegant solution, but this is what I've got
  let [npxOrNpmMaybe, ...otherCode] = initCommand.trim().split(" ");
  let [copied, setCopied] = useState(false);

  // Reset copied state after 4 seconds
  useEffect(() => {
    if (copied) {
      let timeout = setTimeout(() => setCopied(false), 4000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  return (
    <div className="code-block relative">
      <pre
        className={
          rounded === "full"
            ? "rounded-lg"
            : rounded === "bottom"
              ? "rounded-b-lg"
              : undefined
        }
      >
        <code>
          <span className="codeblock-line">
            {["npx", "npm"].includes(npxOrNpmMaybe) ? (
              <>
                <span className="text-blue-500 dark:text-blue-300">
                  {npxOrNpmMaybe}
                </span>{" "}
                <span className="text-green-500 dark:text-yellow-brand">
                  {otherCode.join(" ")}
                </span>
              </>
            ) : (
              <span className="text-green-500 dark:text-yellow-brand">
                {initCommand}
              </span>
            )}
          </span>
        </code>
      </pre>

      <button
        type="button"
        onClick={() => {
          setCopied(true);
          navigator.clipboard.writeText(initCommand);
        }}
        data-code-block-copy
        data-copied={copied}
        className="outline-none"
      >
        {/* had to put these here instead of as a mask so we could add an opacity */}
        <svg
          aria-hidden
          className="h-5 w-5 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-gray-100"
          viewBox="0 0 24 24"
        >
          {copied ? (
            <use href={`${iconsHref}#check-mark`} />
          ) : (
            <use href={`${iconsHref}#copy`} />
          )}
        </svg>
        <span className="sr-only">Copy code to clipboard</span>
      </button>
    </div>
  );
}
