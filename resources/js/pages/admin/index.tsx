import { Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Row = {
    id: number;
    slug: string;
    name: string;
    status: string;
    summary: string | null;
    user: { id: number; name: string; email: string } | null;
    version: string | null;
    version_status: string | null;
    icon_url: string | null;
    categories: { id: number; name: string }[];
    created_at: string | null;
};

type Props = {
    tab: string;
    extensions: Row[];
    counts: { queue: number; approved: number; rejected: number };
};

const tabs: {
    key: string;
    label: string;
    countKey: keyof Props['counts'] | null;
}[] = [
    { key: 'queue', label: 'Queue', countKey: 'queue' },
    { key: 'approved', label: 'Approved', countKey: 'approved' },
    { key: 'rejected', label: 'Rejected', countKey: 'rejected' },
    { key: 'all', label: 'All', countKey: null },
];

export default function AdminIndex({ tab, extensions, counts }: Props) {
    return (
        <>
            <Head title="Review queue" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <Heading
                    title="Extension review"
                    description="Approve or reject extension submissions."
                />

                <div className="flex flex-wrap gap-2">
                    {tabs.map((t) => (
                        <Link
                            key={t.key}
                            href={`/admin/extensions?tab=${t.key}`}
                            className={cn(
                                'inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm',
                                tab === t.key
                                    ? 'bg-foreground text-background'
                                    : 'bg-card hover:bg-accent',
                            )}
                            preserveScroll
                        >
                            {t.label}
                            {t.countKey && (
                                <span
                                    className={cn(
                                        'rounded px-1.5 text-xs',
                                        tab === t.key
                                            ? 'bg-background/20'
                                            : 'bg-muted',
                                    )}
                                >
                                    {counts[t.countKey]}
                                </span>
                            )}
                        </Link>
                    ))}
                </div>

                {extensions.length === 0 ? (
                    <Card>
                        <CardContent className="py-16 text-center text-muted-foreground">
                            Nothing to review here.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-3">
                        {extensions.map((e) => (
                            <Link
                                key={e.id}
                                href={`/admin/extensions/${e.id}`}
                                className="block"
                            >
                                <Card className="transition-colors hover:border-ring">
                                    <CardContent className="flex flex-wrap items-center gap-4">
                                        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                                            {e.icon_url ? (
                                                <img
                                                    src={e.icon_url}
                                                    alt=""
                                                    className="size-full object-contain"
                                                />
                                            ) : (
                                                <span className="text-lg font-semibold text-muted-foreground">
                                                    {e.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium">
                                                {e.name}
                                            </p>
                                            <p className="line-clamp-1 text-sm text-muted-foreground">
                                                {e.summary}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                by {e.user?.name ?? '—'} ·{' '}
                                                {e.user?.email ?? '—'}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge variant="outline">
                                                {e.status}
                                            </Badge>
                                            {e.version && (
                                                <Badge variant="secondary">
                                                    v{e.version}
                                                </Badge>
                                            )}
                                            <span className="text-xs text-muted-foreground">
                                                {e.created_at
                                                    ? new Date(
                                                          e.created_at,
                                                      ).toLocaleDateString()
                                                    : ''}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

AdminIndex.layout = {
    breadcrumbs: [{ title: 'Review Queue', href: '/admin/extensions' }],
};
