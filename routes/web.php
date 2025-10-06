<?php

use App\Http\Controllers\InventoryController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');


    Route::get('/inventory', [InventoryController::class, 'index'])->name('products.index');
    Route::post('/inventory', [InventoryController::class, 'store'])->name('products.store');
    Route::post('/serias', [InventoryController::class, 'seriasStore'])->name('serias.store');


});

require __DIR__ . '/auth.php';
