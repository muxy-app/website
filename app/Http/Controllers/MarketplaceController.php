<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Extension;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class MarketplaceController extends Controller
{
    public function index(Request $request): Response
    {
        $q = trim((string) $request->string('q'));
        $categorySlug = $request->string('category')->toString();

        $query = Extension::published()
            ->with(['media' => fn ($q) => $q->limit(1), 'currentVersion', 'categories', 'user:id,name']);

        if ($q !== '') {
            $query->where(function ($w) use ($q) {
                $w->where('name', 'like', "%{$q}%")
                    ->orWhere('summary', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%");
            });
        }

        if ($categorySlug) {
            $query->whereHas('categories', fn ($c) => $c->where('slug', $categorySlug));
        }

        return Inertia::render('marketplace/index', [
            'q' => $q,
            'category' => $categorySlug,
            'extensions' => $query->orderByDesc('published_at')->get()->map(fn (Extension $e) => [
                'slug' => $e->slug,
                'name' => $e->name,
                'summary' => $e->summary,
                'version' => $e->currentVersion?->version,
                'icon_url' => optional($e->media->first())->url(),
                'author' => $e->user?->name,
                'categories' => $e->categories->map(fn ($c) => ['slug' => $c->slug, 'name' => $c->name])->all(),
            ]),
            'categories' => Category::orderBy('name')->get(['id', 'slug', 'name']),
        ]);
    }

    public function show(string $slug): Response
    {
        $extension = Extension::published()->where('slug', $slug)
            ->with(['media', 'currentVersion', 'categories', 'user:id,name'])
            ->firstOrFail();

        return Inertia::render('marketplace/show', [
            'extension' => [
                'slug' => $extension->slug,
                'name' => $extension->name,
                'summary' => $extension->summary,
                'description' => $extension->description,
                'repository_url' => $extension->repository_url,
                'homepage_url' => $extension->homepage_url,
                'video_url' => $extension->video_url,
                'version' => $extension->currentVersion?->version,
                'size_bytes' => $extension->currentVersion?->size_bytes,
                'sha256' => $extension->currentVersion?->sha256,
                'author' => $extension->user?->name,
                'published_at' => $extension->published_at?->toIso8601String(),
                'media' => $extension->media->map(fn ($m) => ['kind' => $m->kind, 'url' => $m->url()])->all(),
                'categories' => $extension->categories->map(fn ($c) => ['slug' => $c->slug, 'name' => $c->name])->all(),
            ],
        ]);
    }

    public function download(string $slug): BinaryFileResponse
    {
        $extension = Extension::published()->where('slug', $slug)->with('currentVersion')->firstOrFail();
        $version = $extension->currentVersion;
        abort_unless($version, 404);

        $path = Storage::disk('local')->path($version->zip_path);
        abort_unless(is_file($path), 404);

        $label = $version->version ?: (string) $version->id;

        return response()->download($path, "{$extension->slug}-{$label}.zip");
    }
}
