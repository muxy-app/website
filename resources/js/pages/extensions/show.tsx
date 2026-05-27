import { Head, Link, router, useForm } from '@inertiajs/react';
import { ExternalLink, ImageIcon, Trash2, Upload } from 'lucide-react';
import { useRef } from 'react';
import type { FormEvent } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Category = { id: number; name: string; slug: string };
type Media = { id: number; kind: string; url: string; mime: string | null };
type Version = {
    id: number;
    version: string | null;
    status: string;
    public_status: string;
    size_bytes: number | null;
    sha256: string | null;
    analysis_errors: string[] | null;
    review_notes: string | null;
    created_at: string | null;
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
    current_version_id: number | null;
    categories: { id: number; name: string }[];
    category_ids: number[];
    media: Media[];
    versions: Version[];
};

type Props = {
    extension: Extension;
    categories: Category[];
};

const versionBadge: Record<
    string,
    'default' | 'secondary' | 'outline' | 'destructive'
> = {
    analyzing: 'secondary',
    manual_review: 'secondary',
    approved: 'default',
    rejected: 'destructive',
    failed: 'destructive',
};

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

export default function ShowExtension({ extension, categories }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        name: extension.name,
        summary: extension.summary ?? '',
        description: extension.description ?? '',
        repository_url: extension.repository_url,
        homepage_url: extension.homepage_url ?? '',
        video_url: extension.video_url ?? '',
        category_ids: extension.category_ids,
    });

    const versionInput = useRef<HTMLInputElement>(null);
    const mediaInput = useRef<HTMLInputElement>(null);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        patch(`/my/extensions/${extension.id}`, { preserveScroll: true });
    };

    const toggleCategory = (id: number) => {
        setData(
            'category_ids',
            data.category_ids.includes(id)
                ? data.category_ids.filter((c) => c !== id)
                : [...data.category_ids, id],
        );
    };

    const uploadVersion = (file: File) => {
        router.post(
            `/my/extensions/${extension.id}/versions`,
            { zip: file },
            { forceFormData: true, preserveScroll: true },
        );
    };

    const uploadMedia = (file: File) => {
        router.post(
            `/my/extensions/${extension.id}/media`,
            { image: file, kind: 'screenshot' },
            { forceFormData: true, preserveScroll: true },
        );
    };

    const deleteMedia = (id: number) => {
        router.delete(`/my/extensions/${extension.id}/media/${id}`, {
            preserveScroll: true,
        });
    };

    const deleteExtension = () => {
        if (
            !confirm(
                'Delete this extension and all its data? This cannot be undone.',
            )
        ) {
            return;
        }

        router.delete(`/my/extensions/${extension.id}`);
    };

    return (
        <>
            <Head title={extension.name} />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <Heading
                            title={extension.name}
                            description={extension.summary ?? undefined}
                        />
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Badge variant="outline">{extension.status}</Badge>
                            <a
                                href={extension.repository_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                            >
                                Source <ExternalLink className="size-3" />
                            </a>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {extension.status === 'approved' && (
                            <Button asChild variant="outline">
                                <Link href={`/extensions/${extension.slug}`}>
                                    View public page
                                </Link>
                            </Button>
                        )}
                        <Button variant="destructive" onClick={deleteExtension}>
                            <Trash2 className="size-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                <form onSubmit={submit} className="grid gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Listing details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                />
                                <InputError message={errors.name} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="summary">Summary</Label>
                                <Input
                                    id="summary"
                                    value={data.summary}
                                    onChange={(e) =>
                                        setData('summary', e.target.value)
                                    }
                                />
                                <InputError message={errors.summary} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    rows={6}
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Markdown-ish long description shown on the public page."
                                />
                                <InputError message={errors.description} />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="grid gap-2">
                                    <Label htmlFor="repository_url">
                                        Source repository{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="repository_url"
                                        type="url"
                                        value={data.repository_url}
                                        onChange={(e) =>
                                            setData(
                                                'repository_url',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors.repository_url}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="homepage_url">
                                        Homepage
                                    </Label>
                                    <Input
                                        id="homepage_url"
                                        type="url"
                                        value={data.homepage_url}
                                        onChange={(e) =>
                                            setData(
                                                'homepage_url',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError message={errors.homepage_url} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="video_url">
                                        YouTube URL
                                    </Label>
                                    <Input
                                        id="video_url"
                                        type="url"
                                        value={data.video_url}
                                        onChange={(e) =>
                                            setData('video_url', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.video_url} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Categories</Label>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((c) => (
                                        <label
                                            key={c.id}
                                            className="flex cursor-pointer items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm hover:bg-accent"
                                        >
                                            <Checkbox
                                                checked={data.category_ids.includes(
                                                    c.id,
                                                )}
                                                onCheckedChange={() =>
                                                    toggleCategory(c.id)
                                                }
                                            />
                                            {c.name}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving…' : 'Save'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Screenshots</CardTitle>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => mediaInput.current?.click()}
                        >
                            <ImageIcon className="size-4" />
                            Add image
                        </Button>
                        <input
                            ref={mediaInput}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const f = e.target.files?.[0];

                                if (f) {
                                    uploadMedia(f);
                                }

                                e.target.value = '';
                            }}
                        />
                    </CardHeader>
                    <CardContent>
                        {extension.media.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No images yet.
                            </p>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                                {extension.media.map((m) => (
                                    <div
                                        key={m.id}
                                        className="group relative overflow-hidden rounded-md border"
                                    >
                                        <img
                                            src={m.url}
                                            alt=""
                                            className="aspect-video w-full object-cover"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-1 right-1 opacity-0 transition-opacity group-hover:opacity-100"
                                            onClick={() => deleteMedia(m.id)}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                        <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-xs text-white">
                                            {m.kind}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Versions</CardTitle>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => versionInput.current?.click()}
                        >
                            <Upload className="size-4" />
                            Upload new version
                        </Button>
                        <input
                            ref={versionInput}
                            type="file"
                            accept=".zip,application/zip"
                            className="hidden"
                            onChange={(e) => {
                                const f = e.target.files?.[0];

                                if (f) {
                                    uploadVersion(f);
                                }

                                e.target.value = '';
                            }}
                        />
                    </CardHeader>
                    <CardContent>
                        {extension.versions.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No versions uploaded yet.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left">
                                            <th className="py-2 pr-4">
                                                Version
                                            </th>
                                            <th className="py-2 pr-4">
                                                Status
                                            </th>
                                            <th className="py-2 pr-4">Size</th>
                                            <th className="py-2 pr-4">
                                                SHA-256
                                            </th>
                                            <th className="py-2 pr-4">
                                                Uploaded
                                            </th>
                                            <th className="py-2 pr-4"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {extension.versions.map((v) => (
                                            <tr
                                                key={v.id}
                                                className="border-b last:border-b-0"
                                            >
                                                <td className="py-2 pr-4 font-mono">
                                                    {v.version ?? '—'}
                                                </td>
                                                <td className="py-2 pr-4">
                                                    <Badge
                                                        variant={
                                                            versionBadge[
                                                                v.status
                                                            ] ?? 'outline'
                                                        }
                                                    >
                                                        {v.public_status}
                                                    </Badge>
                                                </td>
                                                <td className="py-2 pr-4">
                                                    {fmtBytes(v.size_bytes)}
                                                </td>
                                                <td className="py-2 pr-4 font-mono text-xs">
                                                    {v.sha256
                                                        ? `${v.sha256.slice(0, 10)}…`
                                                        : '—'}
                                                </td>
                                                <td className="py-2 pr-4 text-xs text-muted-foreground">
                                                    {v.created_at
                                                        ? new Date(
                                                              v.created_at,
                                                          ).toLocaleString()
                                                        : '—'}
                                                </td>
                                                <td className="py-2 pr-4 text-right">
                                                    {v.id ===
                                                        extension.current_version_id && (
                                                        <Badge variant="outline">
                                                            current
                                                        </Badge>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {extension.versions.some(
                            (v) => v.analysis_errors?.length,
                        ) && (
                            <div className="mt-4 grid gap-2">
                                {extension.versions
                                    .filter((v) => v.analysis_errors?.length)
                                    .map((v) => (
                                        <div
                                            key={v.id}
                                            className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm"
                                        >
                                            <p className="font-medium">
                                                Version #{v.id} — analysis
                                                errors
                                            </p>
                                            <ul className="mt-1 list-disc pl-5 text-muted-foreground">
                                                {v.analysis_errors?.map(
                                                    (m, i) => (
                                                        <li key={i}>{m}</li>
                                                    ),
                                                )}
                                            </ul>
                                        </div>
                                    ))}
                            </div>
                        )}

                        {extension.versions.some((v) => v.review_notes) && (
                            <div className="mt-4 grid gap-2">
                                {extension.versions
                                    .filter((v) => v.review_notes)
                                    .map((v) => (
                                        <div
                                            key={v.id}
                                            className="rounded-md bg-muted p-3 text-sm"
                                        >
                                            <p className="font-medium">
                                                Reviewer notes (v
                                                {v.version ?? v.id})
                                            </p>
                                            <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
                                                {v.review_notes}
                                            </p>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ShowExtension.layout = {
    breadcrumbs: [
        { title: 'My Extensions', href: '/my/extensions' },
        { title: 'Detail', href: '#' },
    ],
};
