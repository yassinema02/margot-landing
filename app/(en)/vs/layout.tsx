import { ArticleShell } from "@/components/ArticleShell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ArticleShell lang="en">{children}</ArticleShell>;
}
