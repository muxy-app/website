import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Category = { id: number; name: string; slug: string };

type Props = { categories: Category[] };

type FormShape = {
    name: string;
    summary: string;
    repository_url: string;
    homepage_url: string;
    video_url: string;
    category_ids: number[];
    zip: File | null;
};

export default function CreateExtension({ categories }: Props) {
    const { data, setData, post, processing, errors, progress } =
        useForm<FormShape>({
            name: '',
            summary: '',
            repository_url: '',
            homepage_url: '',
            video_url: '',
            category_ids: [],
            zip: null,
        });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/my/extensions', { forceFormData: true });
    };

    const toggleCategory = (id: number) => {
        setData(
            'category_ids',
            data.category_ids.includes(id)
                ? data.category_ids.filter((c) => c !== id)
                : [...data.category_ids, id],
        );
    };

    return (
        <>
            <Head title="New extension" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <Heading
                    title="Upload extension"
                    description="Upload a zip of your extension. We'll extract it and queue it for review."
                />

                <form onSubmit={submit} className="grid gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basics</CardTitle>
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
                                    placeholder="Awesome Extension"
                                />
                                <InputError message={errors.name} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="summary">Short summary</Label>
                                <Input
                                    id="summary"
                                    value={data.summary}
                                    onChange={(e) =>
                                        setData('summary', e.target.value)
                                    }
                                    placeholder="A one-liner about what your extension does."
                                />
                                <InputError message={errors.summary} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="repository_url">
                                    Source repository URL{' '}
                                    <span className="text-destructive">*</span>
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
                                    placeholder="https://github.com/you/your-extension"
                                />
                                <p className="text-xs text-muted-foreground">
                                    All Muxy extensions must be open source. A
                                    public source URL is required.
                                </p>
                                <InputError message={errors.repository_url} />
                            </div>
                            <div className="grid gap-2 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="homepage_url">
                                        Homepage (optional)
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
                                        YouTube URL (optional)
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
                        </CardContent>
                    </Card>

                    {categories.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Categories</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-3">
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
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>Extension package</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-3">
                            <Label htmlFor="zip">Zip file (up to 200MB)</Label>
                            <Input
                                id="zip"
                                type="file"
                                accept=".zip,application/zip"
                                onChange={(e) =>
                                    setData('zip', e.target.files?.[0] ?? null)
                                }
                            />
                            <p className="text-xs text-muted-foreground">
                                Must contain a{' '}
                                <code className="font-mono">manifest.json</code>{' '}
                                at the archive root (or in a single top-level
                                folder).
                            </p>
                            <InputError message={errors.zip} />
                            {progress && (
                                <div className="h-2 w-full overflow-hidden rounded bg-muted">
                                    <div
                                        className="h-2 bg-primary transition-all"
                                        style={{
                                            width: `${progress.percentage ?? 0}%`,
                                        }}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-2">
                        <Button asChild variant="outline" type="button">
                            <Link href="/my/extensions">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Uploading…' : 'Upload & analyze'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

CreateExtension.layout = {
    breadcrumbs: [
        { title: 'My Extensions', href: '/my/extensions' },
        { title: 'New', href: '/my/extensions/new' },
    ],
};
