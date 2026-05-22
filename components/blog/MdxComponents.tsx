import Link from "next/link";
import type { ComponentProps } from "react";

// Style map shared by every MDX-rendered post body. Matches the homepage's
// editorial register: Fraunces serif for emphasis, Inter Tight for prose,
// peach accent on ornamental marks.

export const mdxComponents = {
  h1: () => null, // page header renders its own H1
  h2: (props: ComponentProps<"h2">) => (
    <h2
      className="font-display font-normal text-ink opsz-96 text-[clamp(24px,3vw,32px)] leading-[1.15] tracking-tight4 mt-12 mb-4 [text-wrap:balance]"
      {...props}
    />
  ),
  h3: (props: ComponentProps<"h3">) => (
    <h3
      className="font-sans text-[11px] font-semibold tracking-wider2 uppercase text-peach mt-10 mb-3"
      {...props}
    />
  ),
  p: (props: ComponentProps<"p">) => (
    <p
      className="font-sans text-[16px] leading-[1.65] text-ink2 tracking-tight7 mb-5 max-w-[640px] [text-wrap:pretty]"
      {...props}
    />
  ),
  strong: (props: ComponentProps<"strong">) => (
    <strong className="text-ink font-semibold" {...props} />
  ),
  em: (props: ComponentProps<"em">) => (
    <em className="font-display italic text-ink" {...props} />
  ),
  ul: (props: ComponentProps<"ul">) => (
    <ul
      className="font-sans text-[16px] leading-[1.65] text-ink2 tracking-tight7 list-disc ml-6 mb-5 space-y-2 max-w-[640px]"
      {...props}
    />
  ),
  ol: (props: ComponentProps<"ol">) => (
    <ol
      className="font-sans text-[16px] leading-[1.65] text-ink2 tracking-tight7 list-decimal ml-6 mb-5 space-y-2 max-w-[640px]"
      {...props}
    />
  ),
  li: (props: ComponentProps<"li">) => <li className="[text-wrap:pretty]" {...props} />,
  blockquote: (props: ComponentProps<"blockquote">) => (
    <blockquote
      className="border-l-2 border-peach pl-5 italic font-display text-ink2 text-[18px] leading-[1.5] my-7 max-w-[640px] [text-wrap:pretty]"
      {...props}
    />
  ),
  a: ({ href, ...rest }: ComponentProps<"a">) => {
    const isInternal = typeof href === "string" && href.startsWith("/");
    if (isInternal) {
      return (
        <Link
          href={href}
          className="text-ink underline decoration-peach underline-offset-4 hover:decoration-2"
          {...rest}
        />
      );
    }
    return (
      <a
        href={href}
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
        className="text-ink underline decoration-peach underline-offset-4 hover:decoration-2"
        {...rest}
      />
    );
  },
  hr: (props: ComponentProps<"hr">) => (
    <hr className="border-warm2 my-12" {...props} />
  ),
};
