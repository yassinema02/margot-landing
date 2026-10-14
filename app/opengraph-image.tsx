import { homeSocialImage } from "@/components/HomeSocialImage";
import { HOME } from "@/lib/home";
export const alt = `Margot. ${HOME.en.headline} Wardrobe app for iPhone and Android.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() { return homeSocialImage("en"); }
