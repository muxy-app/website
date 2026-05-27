<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Extension;
use App\Models\ExtensionVersion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ReviewController extends Controller
{
    public function index(Request $request): Response
    {
        $tab = $request->string('tab', 'queue')->toString();

        $base = Extension::query()->with(['user:id,name,email', 'currentVersion', 'media' => fn ($q) => $q->limit(1), 'categories']);

        $extensions = match ($tab) {
            'approved' => $base->where('status', Extension::STATUS_APPROVED),
            'rejected' => $base->where('status', Extension::STATUS_REJECTED),
            'all' => $base,
            default => $base->whereIn('status', [Extension::STATUS_REVIEW, Extension::STATUS_ANALYZING]),
        };

        return Inertia::render('admin/index', [
            'tab' => $tab,
            'extensions' => $extensions->latest()->get()->map(fn (Extension $e) => [
                'id' => $e->id,
                'slug' => $e->slug,
                'name' => $e->name,
                'status' => $e->status,
                'summary' => $e->summary,
                'user' => $e->user ? ['id' => $e->user->id, 'name' => $e->user->name, 'email' => $e->user->email] : null,
                'version' => $e->currentVersion?->version,
                'version_status' => $e->currentVersion?->status,
                'icon_url' => optional($e->media->first())->url(),
                'categories' => $e->categories->map(fn (Category $c) => ['id' => $c->id, 'name' => $c->name])->all(),
                'created_at' => $e->created_at?->toIso8601String(),
            ]),
            'counts' => [
                'queue' => Extension::whereIn('status', [Extension::STATUS_REVIEW, Extension::STATUS_ANALYZING])->count(),
                'approved' => Extension::where('status', Extension::STATUS_APPROVED)->count(),
                'rejected' => Extension::where('status', Extension::STATUS_REJECTED)->count(),
            ],
        ]);
    }

    public function show(Extension $extension): Response
    {
        $extension->load(['user:id,name,email', 'versions' => fn ($q) => $q->latest(), 'currentVersion', 'media', 'categories']);

        return Inertia::render('admin/show', [
            'extension' => [
                'id' => $extension->id,
                'slug' => $extension->slug,
                'name' => $extension->name,
                'summary' => $extension->summary,
                'description' => $extension->description,
                'repository_url' => $extension->repository_url,
                'homepage_url' => $extension->homepage_url,
                'video_url' => $extension->video_url,
                'status' => $extension->status,
                'user' => $extension->user ? ['id' => $extension->user->id, 'name' => $extension->user->name, 'email' => $extension->user->email] : null,
                'media' => $extension->media->map(fn ($m) => ['id' => $m->id, 'kind' => $m->kind, 'url' => $m->url()])->all(),
                'categories' => $extension->categories->map(fn ($c) => ['id' => $c->id, 'name' => $c->name])->all(),
                'current_version_id' => $extension->current_version_id,
                'versions' => $extension->versions->map(fn (ExtensionVersion $v) => [
                    'id' => $v->id,
                    'version' => $v->version,
                    'status' => $v->status,
                    'size_bytes' => $v->size_bytes,
                    'sha256' => $v->sha256,
                    'manifest' => $v->manifest,
                    'file_list' => $v->file_list,
                    'analysis_errors' => $v->analysis_errors,
                    'review_notes' => $v->review_notes,
                    'created_at' => $v->created_at?->toIso8601String(),
                    'reviewed_at' => $v->reviewed_at?->toIso8601String(),
                ])->all(),
            ],
        ]);
    }

    public function approve(Request $request, Extension $extension, ExtensionVersion $version): RedirectResponse
    {
        abort_unless($version->extension_id === $extension->id, 404);

        $data = $request->validate([
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $version->fill([
            'status' => ExtensionVersion::STATUS_APPROVED,
            'review_notes' => $data['notes'] ?? null,
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ])->save();

        $extension->fill([
            'status' => Extension::STATUS_APPROVED,
            'current_version_id' => $version->id,
            'published_at' => $extension->published_at ?? now(),
        ])->save();

        return back()->with('success', 'Approved and published.');
    }

    public function reject(Request $request, Extension $extension, ExtensionVersion $version): RedirectResponse
    {
        abort_unless($version->extension_id === $extension->id, 404);

        $data = $request->validate([
            'notes' => ['required', 'string', 'max:2000'],
        ]);

        $version->fill([
            'status' => ExtensionVersion::STATUS_REJECTED,
            'review_notes' => $data['notes'],
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ])->save();

        $hasOtherApprovedVersion = $extension->versions()
            ->where('id', '!=', $version->id)
            ->where('status', ExtensionVersion::STATUS_APPROVED)
            ->exists();

        if (! $hasOtherApprovedVersion) {
            $extension->status = Extension::STATUS_REJECTED;
            $extension->save();
        }

        return back()->with('success', 'Version rejected.');
    }

    public function downloadZip(Extension $extension, ExtensionVersion $version): BinaryFileResponse
    {
        abort_unless($version->extension_id === $extension->id, 404);

        $path = Storage::disk('local')->path($version->zip_path);
        abort_unless(is_file($path), 404);

        return response()->download($path, "{$extension->slug}-{$version->id}.zip");
    }
}
