import { Head, Link, usePage } from '@inertiajs/react';
import { Download, ExternalLink, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Auth } from '@/types';

type Extension = {
    slug: string;
    name: string;
    summary: string | null;
    description: string | null;
    repository_url: string;
    homepage_url: string | null;
    video_url: string | null;
    version: string | null;
    size_bytes: number | null;
    sha256: string | null;
    author: string | null;
    published_at: string | null;
    media: { kind: string; url: string }[];
    categories: { slug: string; name: string }[];
};

type Props = { extension: Extension };

function fmtBytes(n: number | null): string {
    if (!n) {
        return '—';
    }

    if (n < 1024) {
        return `${n} B`;
    }

    if (n < 1024 * 1024) {
        return `${(n / 1024).toFixed(1)} KB`;
    }

    return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

function youtubeEmbed(url: string): string | null {
    try {
        const u = new URL(url);

        if (u.hostname === 'youtu.be') {
            return `https://www.youtube.com/embed${u.pathname}`;
        }

        if (u.hostname.endsWith('youtube.com')) {
            const id = u.searchParams.get('v');

            if (id) {
                return `https://www.youtube.com/embed/${id}`;
            }

            if (u.pathname.startsWith('/embed/')) {
                return url;
            }
        }
    } catch {
        return null;
    }

    return null;
}

export default function MarketplaceShow({ extension }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const icon =
        extension.media.find((m) => m.kind === 'icon') ?? extension.media[0];
    const screenshots = extension.media.filter((m) => m.kind !== 'icon');
    const embed = extension.video_url
        ? youtubeEmbed(extension.video_url)
        : null;

    return (
        <>
            <Head title={`${extension.name} · Muxy`} />

            <header className="border-b">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
                    <Link
                        href="/"
                        className="flex items-center gap-2 font-semibold"
                    >
                        <Package className="size-5" />
                        Muxy Extensions
                    </Link>
                    <nav className="flex items-center gap-2 text-sm">
                        {auth?.user ? (
                            <Button asChild size="sm">
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                        ) : (
                            <Button asChild size="sm">
                                <Link href="/login">Sign in</Link>
                            </Button>
                        )}
                    </nav>
                </div>
            </header>

            <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-3">
                <section className="lg:col-span-2">
                    <div className="flex flex-wrap items-start gap-4">
                        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                            {icon ? (
                                <img
                                    src={icon.url}
                                    alt=""
                                    className="size-full object-contain"
                                />
                            ) : (
                                <Package className="size-8 text-muted-foreground" />
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h1 className="text-3xl font-semibold tracking-tight">
                                {extension.name}
                            </h1>
                            {extension.author && (
                                <p className="mt-1 text-sm text-muted-foreground">
                                    by {extension.author}
                                </p>
                            )}
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                {extension.version && (
                                    <Badge variant="outline">
                                        v{extension.version}
                                    </Badge>
                                )}
                                {extension.categories.map((c) => (
                                    <Badge key={c.slug} variant="secondary">
                                        {c.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    {extension.summary && (
                        <p className="mt-6 text-lg text-muted-foreground">
                            {extension.summary}
                        </p>
                    )}

                    {embed && (
                        <div className="mt-6 overflow-hidden rounded-lg border">
                            <div className="relative aspect-video w-full">
                                <iframe
                                    className="absolute inset-0 h-full w-full"
                                    src={embed}
                                    title={`${extension.name} demo`}
                                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    )}

                    {screenshots.length > 0 && (
                        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {screenshots.map((m, i) => (
                                <img
                                    key={i}
                                    src={m.url}
                                    alt=""
                                    className="aspect-video w-full rounded-md border object-cover"
                                />
                            ))}
                        </div>
                    )}

                    {extension.description && (
                        <article className="mt-8">
                            <h2 className="text-xl font-semibold">About</h2>
                            <p className="mt-2 text-sm leading-6 whitespace-pre-wrap text-muted-foreground">
                                {extension.description}
                            </p>
                        </article>
                    )}
                </section>

                <aside className="grid h-fit gap-4">
                    <Card>
                        <CardContent className="grid gap-3">
                            <Button asChild className="w-full">
                                <a
                                    href={`/extensions/${extension.slug}/download`}
                                >
                                    <Download className="size-4" />
                                    Download zip
                                </a>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="w-full"
                            >
                                <a
                                    href={extension.repository_url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <ExternalLink className="size-4" />
                                    Source repository
                                </a>
                            </Button>
                            {extension.homepage_url && (
                                <Button
                                    asChild
                                    variant="ghost"
                                    className="w-full"
                                >
                                    <a
                                        href={extension.homepage_url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Homepage
                                    </a>
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="grid gap-2 text-sm">
                            <div className="flex justify-between gap-2">
                                <span className="text-muted-foreground">
                                    Version
                                </span>
                                <span className="font-mono">
                                    {extension.version ?? '—'}
                                </span>
                            </div>
                            <div className="flex justify-between gap-2">
                                <span className="text-muted-foreground">
                                    Size
                                </span>
                                <span>{fmtBytes(extension.size_bytes)}</span>
                            </div>
                            <div className="flex justify-between gap-2">
                                <span className="text-muted-foreground">
                                    SHA-256
                                </span>
                                <span className="font-mono text-xs">
                                    {extension.sha256
                                        ? `${extension.sha256.slice(0, 12)}…`
                                        : '—'}
                                </span>
                            </div>
                            <div className="flex justify-between gap-2">
                                <span className="text-muted-foreground">
                                    Published
                                </span>
                                <span>
                                    {extension.published_at
                                        ? new Date(
                                              extension.published_at,
                                          ).toLocaleDateString()
                                        : '—'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </aside>
            </main>
        </>
    );
}
