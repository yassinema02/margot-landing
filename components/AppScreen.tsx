import Image from "next/image";
import type { HomeScreen } from "@/lib/home";
import { SCREEN_FOCUS, SCREEN_SIZE, screenSrc, type ScreenLang } from "@/lib/screens";
import styles from "./Landing.module.css";

type Props = {
  lang: ScreenLang;
  screen: HomeScreen;
  /** "phone": the whole screen in a device frame. "card": a cropped window on the part the caption is about. */
  variant: "phone" | "card";
  sizes: string;
  priority?: boolean;
};

export function AppScreen({ lang, screen, variant, sizes, priority = false }: Props) {
  const src = screenSrc(lang, screen.name);
  if (variant === "phone") {
    return <div className={styles.phone}>
      <Image src={src} alt={screen.alt} width={SCREEN_SIZE.width} height={SCREEN_SIZE.height} sizes={sizes} priority={priority} />
    </div>;
  }
  return <div className={styles.screenCard}>
    <Image src={src} alt={screen.alt} fill sizes={sizes} priority={priority} style={{ objectPosition: `50% ${SCREEN_FOCUS[lang][screen.name]}%` }} />
  </div>;
}
