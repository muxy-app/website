import { Head, router } from '@inertiajs/react';
import { Check, Download, ExternalLink, X } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

type Version = {
    id: number;
    version: string | null;
    status: string;
    size_bytes: number | null;
    sha256: string | null;
    manifest: Record<string, unknown> | null;
    file_list: { path: string; size: number }[] | null;
    analysis_errors: string[] | null;
    review_notes: string | null;
    created_at: string | null;
    reviewed_at: string | null;
};

type Extension = {
    id: number;
    slug: string;
    name: string;
    summary: string | null;
    description: string | null;
    repository_url: string;
    homepage_url: string | null;
    video_url: string | null;
    status: string;
    user: { id: number; name: string; email: string } | null;
    media: { id: number; kind: string; url: string }[];
    categories: { id: number; name: string }[];
    current_version_id: number | null;
    versions: Version[];
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

export default function AdminShow({ extension }: Props) {
    const target =
        extension.versions.find((v) => v.status === 'manual_review') ??
        extension.versions[0];
    const [activeId, setActiveId] = useState<number | null>(target?.id ?? null);
    const [notes, setNotes] = useState<string>('');
    const active = extension.versions.find((v) => v.id === activeId) ?? target;

    const submit = (action: 'approve' | 'reject') => {
        if (!active) {
            return;
        }

        if (action === 'reject' && !notes.trim()) {
            alert('Rejection requires notes explaining why.');

            return;
        }

        router.post(
            `/admin/extensions/${extension.id}/versions/${active.id}/${action}`,
            { notes: notes || null },
            { preserveScroll: true, onSuccess: () => setNotes('') },
        );
    };

    return (
        <>
            <Head title={`Review · ${extension.name}`} />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <Heading
                            title={extension.name}
                            description={extension.summary ?? undefined}
                        />
                        <div className="mt-1 text-sm text-muted-foreground">
                            by {extension.user?.name} · {extension.user?.email}
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                            <Badge variant="outline">{extension.status}</Badge>
                            <a
                                href={extension.repository_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                            >
                                Source <ExternalLink className="size-3" />
                            </a>
                            {extension.homepage_url && (
                                <a
                                    href={extension.homepage_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                                >
                                    Homepage <ExternalLink className="size-3" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="grid gap-4 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Versions</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-2">
                                {extension.versions.map((v) => (
                                    <button
                                        key={v.id}
                                        type="button"
                                        onClick={() => setActiveId(v.id)}
                                        className={`flex w-full items-center justify-between gap-3 rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                                            v.id === active?.id
                                                ? 'border-ring bg-accent'
                                                : 'hover:bg-accent/50'
                                        }`}
                                    >
                                        <div>
                                            <p className="font-medium">
                                                v{v.version ?? v.id}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {v.created_at
                                                    ? new Date(
                                                          v.created_at,
                                                      ).toLocaleString()
                                                    : ''}
                                            </p>
                                        </div>
                                        <Badge
                                            variant={
                                                v.status === 'approved'
                                                    ? 'default'
                                                    : v.status === 'rejected' ||
                                                        v.status === 'failed'
                                                      ? 'destructive'
                                                      : 'secondary'
                                            }
                                        >
                                            {v.status}
                                        </Badge>
                                    </button>
                                ))}
                            </CardContent>
                        </Card>

                        {active && (
                            <>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle>
                                            Manifest (v
                                            {active.version ?? active.id})
                                        </CardTitle>
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                        >
                                            <a
                                                href={`/admin/extensions/${extension.id}/versions/${active.id}/zip`}
                                            >
                                                <Download className="size-4" />
                                                Download zip
                                            </a>
                                        </Button>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="mb-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground sm:grid-cols-4">
                                            <div>
                                                <p>Size</p>
                                                <p className="text-foreground">
                                                    {fmtBytes(
                                                        active.size_bytes,
                                                    )}
                                                </p>
                                            </div>
                                            <div>
                                                <p>SHA-256</p>
                                                <p className="font-mono text-foreground">
                                                    {active.sha256
                                                        ? `${active.sha256.slice(0, 12)}…`
                                                        : '—'}
                                                </p>
                                            </div>
                                            <div>
                                                <p>Files</p>
                                                <p className="text-foreground">
                                                    {active.file_list?.length ??
                                                        0}
                                                </p>
                                            </div>
                                            <div>
                                                <p>Status</p>
                                                <p className="text-foreground">
                                                    {active.status}
                                                </p>
                                            </div>
                                        </div>
                                        {active.analysis_errors?.length ? (
                                            <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm">
                                                <p className="font-medium">
                                                    Analysis errors
                                                </p>
                                                <ul className="mt-1 list-disc pl-5 text-muted-foreground">
                                                    {active.analysis_errors.map(
                                                        (m, i) => (
                                                            <li key={i}>{m}</li>
                                                        ),
                                                    )}
                                                </ul>
                                            </div>
                                        ) : null}
                                        <pre className="mt-3 max-h-80 overflow-auto rounded-md bg-muted p-3 text-xs">
                                            {JSON.stringify(
                                                active.manifest ?? {},
                                                null,
                                                2,
                                            )}
                                        </pre>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Files</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="max-h-80 overflow-auto rounded-md bg-muted p-3 font-mono text-xs">
                                            {active.file_list?.length
                                                ? active.file_list.map((f) => (
                                                      <div
                                                          key={f.path}
                                                          className="flex justify-between gap-4 border-b border-black/5 py-0.5 last:border-0 dark:border-white/5"
                                                      >
                                                          <span className="truncate">
                                                              {f.path}
                                                          </span>
                                                          <span className="shrink-0 text-muted-foreground">
                                                              {fmtBytes(f.size)}
                                                          </span>
                                                      </div>
                                                  ))
                                                : 'No files listed.'}
                                        </div>
                                    </CardContent>
                                </Card>

                                {extension.description && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Description</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                                                {extension.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}

                                {extension.media.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Media</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                                {extension.media.map((m) => (
                                                    <img
                                                        key={m.id}
                                                        src={m.url}
                                                        alt=""
                                                        className="aspect-video w-full rounded-md object-cover"
                                                    />
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </>
                        )}
                    </div>

                    <div className="grid h-fit gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Decision</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-3">
                                <Textarea
                                    rows={5}
                                    placeholder="Notes for the developer (required on reject)"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        onClick={() => submit('approve')}
                                        disabled={!active}
                                    >
                                        <Check className="size-4" />
                                        Approve
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => submit('reject')}
                                        disabled={!active}
                                    >
                                        <X className="size-4" />
                                        Reject
                                    </Button>
                                </div>
                                {active?.review_notes && (
                                    <div className="rounded-md bg-muted p-3 text-sm">
                                        <p className="font-medium">
                                            Previous notes
                                        </p>
                                        <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
                                            {active.review_notes}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

AdminShow.layout = {
    breadcrumbs: [
        { title: 'Review Queue', href: '/admin/extensions' },
        { title: 'Detail', href: '#' },
    ],
};
