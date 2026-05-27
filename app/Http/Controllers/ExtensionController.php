<?php

namespace App\Http\Controllers;

use App\Actions\Extensions\UploadExtensionVersion;
use App\Http\Requests\StoreExtensionRequest;
use App\Http\Requests\UpdateExtensionRequest;
use App\Http\Requests\UploadExtensionVersionRequest;
use App\Models\Category;
use App\Models\Extension;
use App\Models\ExtensionMedia;
use App\Models\ExtensionVersion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ExtensionController extends Controller
{
    public function index(Request $request): Response
    {
        $extensions = $request->user()->extensions()
            ->with(['currentVersion', 'media' => fn ($q) => $q->limit(1), 'categories'])
            ->latest()
            ->get()
            ->map(fn (Extension $e) => $this->cardPayload($e));

        return Inertia::render('extensions/index', [
            'extensions' => $extensions,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('extensions/create', [
            'categories' => Category::orderBy('name')->get(['id', 'name', 'slug']),
        ]);
    }

    public function store(StoreExtensionRequest $request, UploadExtensionVersion $upload): RedirectResponse
    {
        $data = $request->validated();

        $slug = $this->uniqueSlug($data['name']);

        $extension = Extension::create([
            'user_id' => $request->user()->id,
            'slug' => $slug,
            'name' => $data['name'],
            'summary' => $data['summary'] ?? null,
            'repository_url' => $data['repository_url'],
            'homepage_url' => $data['homepage_url'] ?? null,
            'video_url' => $data['video_url'] ?? null,
            'status' => Extension::STATUS_DRAFT,
        ]);

        if (! empty($data['category_ids'])) {
            $extension->categories()->sync($data['category_ids']);
        }

        $version = $upload($extension, $request->file('zip'));

        if ($version->status === ExtensionVersion::STATUS_MANUAL_REVIEW) {
            $extension->current_version_id = $version->id;
            $extension->save();
        }

        $message = $version->status === ExtensionVersion::STATUS_FAILED
            ? 'Extension created but analysis failed. See errors below.'
            : 'Extension uploaded and queued for review.';

        return redirect()
            ->route('extensions.show', $extension)
            ->with('success', $message);
    }

    public function show(Request $request, Extension $extension): Response
    {
        $this->authorize('view', $extension);

        $extension->load(['versions' => fn ($q) => $q->latest(), 'media', 'categories', 'currentVersion']);

        return Inertia::render('extensions/show', [
            'extension' => $this->fullPayload($extension),
            'categories' => Category::orderBy('name')->get(['id', 'name', 'slug']),
        ]);
    }

    public function update(UpdateExtensionRequest $request, Extension $extension): RedirectResponse
    {
        $this->authorize('update', $extension);

        $data = $request->validated();

        $extension->fill([
            'name' => $data['name'],
            'summary' => $data['summary'] ?? null,
            'description' => $data['description'] ?? null,
            'repository_url' => $data['repository_url'],
            'homepage_url' => $data['homepage_url'] ?? null,
            'video_url' => $data['video_url'] ?? null,
        ])->save();

        $extension->categories()->sync($data['category_ids'] ?? []);

        return back()->with('success', 'Saved.');
    }

    public function destroy(Extension $extension): RedirectResponse
    {
        $this->authorize('delete', $extension);

        Storage::disk('local')->deleteDirectory("extensions/{$extension->id}");
        Storage::disk('public')->deleteDirectory("extensions/{$extension->id}");

        $extension->delete();

        return redirect()->route('extensions.index')->with('success', 'Extension deleted.');
    }

    public function uploadVersion(UploadExtensionVersionRequest $request, Extension $extension, UploadExtensionVersion $upload): RedirectResponse
    {
        $this->authorize('update', $extension);

        $version = $upload($extension, $request->file('zip'));

        if ($version->status === ExtensionVersion::STATUS_MANUAL_REVIEW) {
            $extension->current_version_id = $version->id;
            $extension->save();
        }

        return back()->with('success', 'New version uploaded.');
    }

    public function uploadMedia(Request $request, Extension $extension): RedirectResponse
    {
        $this->authorize('update', $extension);

        $request->validate([
            'image' => ['required', 'image', 'max:5120'],
            'kind' => ['nullable', 'in:screenshot,thumbnail,icon'],
        ]);

        $file = $request->file('image');
        $kind = $request->input('kind', ExtensionMedia::KIND_SCREENSHOT);

        $stored = $file->store("extensions/{$extension->id}/media", ['disk' => 'public']);

        ExtensionMedia::create([
            'extension_id' => $extension->id,
            'kind' => $kind,
            'path' => $stored,
            'mime' => $file->getMimeType(),
            'position' => ($extension->media()->max('position') ?? 0) + 1,
        ]);

        return back()->with('success', 'Image added.');
    }

    public function destroyMedia(Extension $extension, ExtensionMedia $media): RedirectResponse
    {
        $this->authorize('update', $extension);
        abort_unless($media->extension_id === $extension->id, 404);

        Storage::disk('public')->delete($media->path);
        $media->delete();

        return back()->with('success', 'Image removed.');
    }

    private function uniqueSlug(string $name): string
    {
        $base = Str::slug($name);
        if ($base === '') {
            $base = 'extension';
        }
        $slug = $base;
        $i = 2;
        while (Extension::where('slug', $slug)->exists()) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }

    /** @return array<string, mixed> */
    private function cardPayload(Extension $e): array
    {
        return [
            'id' => $e->id,
            'slug' => $e->slug,
            'name' => $e->name,
            'summary' => $e->summary,
            'status' => $e->status,
            'created_at' => $e->created_at?->toIso8601String(),
            'version' => $e->currentVersion?->version,
            'icon_url' => optional($e->media->first())->url(),
            'categories' => $e->categories->map(fn (Category $c) => ['id' => $c->id, 'name' => $c->name])->all(),
        ];
    }

    /** @return array<string, mixed> */
    private function fullPayload(Extension $e): array
    {
        return [
            'id' => $e->id,
            'slug' => $e->slug,
            'name' => $e->name,
            'summary' => $e->summary,
            'description' => $e->description,
            'repository_url' => $e->repository_url,
            'homepage_url' => $e->homepage_url,
            'video_url' => $e->video_url,
            'status' => $e->status,
            'current_version_id' => $e->current_version_id,
            'categories' => $e->categories->map(fn ($c) => ['id' => $c->id, 'name' => $c->name])->all(),
            'category_ids' => $e->categories->pluck('id')->all(),
            'media' => $e->media->map(fn (ExtensionMedia $m) => [
                'id' => $m->id,
                'kind' => $m->kind,
                'url' => $m->url(),
                'mime' => $m->mime,
            ])->all(),
            'versions' => $e->versions->map(fn ($v) => [
                'id' => $v->id,
                'version' => $v->version,
                'status' => $v->status,
                'public_status' => $v->publicStatus(),
                'size_bytes' => $v->size_bytes,
                'sha256' => $v->sha256,
                'analysis_errors' => $v->analysis_errors,
                'review_notes' => $v->review_notes,
                'created_at' => $v->created_at?->toIso8601String(),
            ])->all(),
        ];
    }
}
