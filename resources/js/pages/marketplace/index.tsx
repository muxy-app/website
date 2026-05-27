import { Head, Link, router, usePage } from '@inertiajs/react';
import { Package, Search } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Auth } from '@/types';

type Card = {
    slug: string;
    name: string;
    summary: string | null;
    version: string | null;
    icon_url: string | null;
    author: string | null;
    categories: { slug: string; name: string }[];
};

type Category = { id: number; slug: string; name: string };

type Props = {
    q: string;
    category: string;
    extensions: Card[];
    categories: Category[];
};

export default function MarketplaceIndex({
    q,
    category,
    extensions,
    categories,
}: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const [query, setQuery] = useState(q);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            '/',
            { q: query || undefined, category: category || undefined },
            { preserveScroll: true, preserveState: true },
        );
    };

    const setCategory = (slug: string | null) => {
        router.get(
            '/',
            { q: q || undefined, category: slug || undefined },
            { preserveScroll: true, preserveState: true },
        );
    };

    return (
        <>
            <Head title="Muxy Marketplace" />

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
                            <>
                                <Button asChild variant="outline" size="sm">
                                    <Link href="/my/extensions">
                                        My extensions
                                    </Link>
                                </Button>
                                <Button asChild size="sm">
                                    <Link href="/dashboard">Dashboard</Link>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button asChild variant="ghost" size="sm">
                                    <Link href="/login">Sign in</Link>
                                </Button>
                                <Button asChild size="sm">
                                    <Link href="/register">Sign up</Link>
                                </Button>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            <section className="border-b">
                <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10">
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        Extensions for Muxy
                    </h1>
                    <p className="max-w-2xl text-muted-foreground">
                        Open-source extensions built by the community. Every
                        extension links to its public source repository.
                    </p>
                    <form
                        onSubmit={submit}
                        className="flex max-w-xl items-center gap-2"
                    >
                        <div className="relative flex-1">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search extensions"
                                className="pl-9"
                            />
                        </div>
                        <Button type="submit">Search</Button>
                    </form>
                </div>
            </section>

            <main className="mx-auto max-w-6xl px-4 py-8">
                {categories.length > 0 && (
                    <div className="mb-6 flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => setCategory(null)}
                            className={cn(
                                'rounded-full border px-3 py-1 text-sm transition-colors',
                                !category
                                    ? 'bg-foreground text-background'
                                    : 'hover:bg-accent',
                            )}
                        >
                            All
                        </button>
                        {categories.map((c) => (
                            <button
                                key={c.id}
                                type="button"
                                onClick={() => setCategory(c.slug)}
                                className={cn(
                                    'rounded-full border px-3 py-1 text-sm transition-colors',
                                    category === c.slug
                                        ? 'bg-foreground text-background'
                                        : 'hover:bg-accent',
                                )}
                            >
                                {c.name}
                            </button>
                        ))}
                    </div>
                )}

                {extensions.length === 0 ? (
                    <Card>
                        <CardContent className="py-16 text-center">
                            <p className="text-lg font-medium">
                                No extensions found
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Try a different search or check back soon.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {extensions.map((e) => (
                            <Link
                                key={e.slug}
                                href={`/extensions/${e.slug}`}
                                className="group"
                            >
                                <Card className="h-full transition-colors hover:border-ring">
                                    <CardContent className="flex h-full flex-col gap-3">
                                        <div className="flex items-start gap-3">
                                            <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                                                {e.icon_url ? (
                                                    <img
                                                        src={e.icon_url}
                                                        alt=""
                                                        className="size-full object-contain"
                                                    />
                                                ) : (
                                                    <Package className="size-6 text-muted-foreground" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate font-medium group-hover:underline">
                                                    {e.name}
                                                </p>
                                                {e.author && (
                                                    <p className="text-xs text-muted-foreground">
                                                        by {e.author}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <p className="line-clamp-3 text-sm text-muted-foreground">
                                            {e.summary ?? 'No summary.'}
                                        </p>
                                        <div className="mt-auto flex flex-wrap items-center gap-2">
                                            {e.version && (
                                                <Badge variant="outline">
                                                    v{e.version}
                                                </Badge>
                                            )}
                                            {e.categories.map((c) => (
                                                <Badge
                                                    key={c.slug}
                                                    variant="secondary"
                                                >
                                                    {c.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </>
    );
}
