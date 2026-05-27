<?php

use App\Http\Controllers\Admin\ReviewController;
use App\Http\Controllers\ExtensionController;
use App\Http\Controllers\MarketplaceController;
use Illuminate\Support\Facades\Route;

Route::get('/', [MarketplaceController::class, 'index'])->name('home');
Route::get('/extensions/{slug}', [MarketplaceController::class, 'show'])->name('marketplace.show');
Route::get('/extensions/{slug}/download', [MarketplaceController::class, 'download'])->name('marketplace.download');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('my/extensions', [ExtensionController::class, 'index'])->name('extensions.index');
    Route::get('my/extensions/new', [ExtensionController::class, 'create'])->name('extensions.create');
    Route::post('my/extensions', [ExtensionController::class, 'store'])->name('extensions.store');
    Route::get('my/extensions/{extension}', [ExtensionController::class, 'show'])->name('extensions.show');
    Route::patch('my/extensions/{extension}', [ExtensionController::class, 'update'])->name('extensions.update');
    Route::delete('my/extensions/{extension}', [ExtensionController::class, 'destroy'])->name('extensions.destroy');
    Route::post('my/extensions/{extension}/versions', [ExtensionController::class, 'uploadVersion'])->name('extensions.versions.store');
    Route::post('my/extensions/{extension}/media', [ExtensionController::class, 'uploadMedia'])->name('extensions.media.store');
    Route::delete('my/extensions/{extension}/media/{media}', [ExtensionController::class, 'destroyMedia'])->name('extensions.media.destroy');
});

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('extensions', [ReviewController::class, 'index'])->name('extensions.index');
    Route::get('extensions/{extension}', [ReviewController::class, 'show'])->name('extensions.show');
    Route::post('extensions/{extension}/versions/{version}/approve', [ReviewController::class, 'approve'])->name('extensions.versions.approve');
    Route::post('extensions/{extension}/versions/{version}/reject', [ReviewController::class, 'reject'])->name('extensions.versions.reject');
    Route::get('extensions/{extension}/versions/{version}/zip', [ReviewController::class, 'downloadZip'])->name('extensions.versions.zip');
});

require __DIR__.'/settings.php';
