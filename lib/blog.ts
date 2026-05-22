import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type PostFrontmatter = {
  title: string;
  slug: string;
  date: string;
  locale: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage: string;
  readingTime: number;
};

export type Post = { frontmatter: PostFrontmatter; content: string };

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getPostBySlug(slug: string): Post | null {
  const file = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf-8");
  const { data, content } = matter(raw);
  return { frontmatter: data as PostFrontmatter, content };
}

export function getAllPosts(): Post[] {
  return getAllPostSlugs()
    .map((s) => getPostBySlug(s))
    .filter((p): p is Post => p !== null)
    .sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
}

export function formatPostDate(iso: string, locale: string = "en-GB"): string {
  const d = new Date(iso);
  return d.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
}
