import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type ExtensionCard = {
    id: number;
    slug: string;
    name: string;
    summary: string | null;
    status: string;
    version: string | null;
    icon_url: string | null;
    categories: { id: number; name: string }[];
    created_at: string | null;
};

type Props = {
    extensions: ExtensionCard[];
};

const statusVariant: Record<
    string,
    'default' | 'secondary' | 'outline' | 'destructive'
> = {
    draft: 'outline',
    analyzing: 'secondary',
    review: 'secondary',
    approved: 'default',
    rejected: 'destructive',
};

export default function MyExtensionsIndex({ extensions }: Props) {
    return (
        <>
            <Head title="My Extensions" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <Heading
                        title="My Extensions"
                        description="Upload, review status, and manage your Muxy extensions."
                    />
                    <Button asChild>
                        <Link href="/my/extensions/new">
                            <Plus className="size-4" />
                            New extension
                        </Link>
                    </Button>
                </div>

                {extensions.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                            <p className="text-lg font-medium">
                                No extensions yet
                            </p>
                            <p className="max-w-md text-sm text-muted-foreground">
                                Upload your first extension zip to get it
                                analyzed and queued for review.
                            </p>
                            <Button asChild className="mt-2">
                                <Link href="/my/extensions/new">
                                    <Plus className="size-4" />
                                    Upload extension
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {extensions.map((e) => (
                            <Link
                                key={e.id}
                                href={`/my/extensions/${e.id}`}
                                className="group"
                            >
                                <Card className="transition-colors hover:border-ring">
                                    <CardContent className="flex flex-col gap-3">
                                        <div className="flex items-start gap-3">
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
                                                <p className="truncate font-medium group-hover:underline">
                                                    {e.name}
                                                </p>
                                                <p className="line-clamp-2 text-sm text-muted-foreground">
                                                    {e.summary ||
                                                        'No summary yet.'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge
                                                variant={
                                                    statusVariant[e.status] ??
                                                    'outline'
                                                }
                                            >
                                                {e.status}
                                            </Badge>
                                            {e.version && (
                                                <Badge variant="outline">
                                                    v{e.version}
                                                </Badge>
                                            )}
                                            {e.categories.map((c) => (
                                                <Badge
                                                    key={c.id}
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
            </div>
        </>
    );
}

MyExtensionsIndex.layout = {
    breadcrumbs: [{ title: 'My Extensions', href: '/my/extensions' }],
};
