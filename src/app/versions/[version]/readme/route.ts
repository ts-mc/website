import { getVersionReadme } from "@/lib/versions";

type ReadmeRouteProps = {
  params: Promise<{ version: string }>;
};

/**
 * Serves the raw markdown of /public/versions/<xx-yy-zz>.readme — the same
 * file that is committed to GitHub — as plain text.
 */
export async function GET(_request: Request, { params }: ReadmeRouteProps) {
  const { version } = await params;
  const readme = getVersionReadme(version);
  if (!readme) return new Response("Not found", { status: 404 });
  return new Response(readme, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
