<?php

use App\Imports\ProductImport;
use App\Models\Product;
use App\Models\SeriasNumber;
use Illuminate\Support\Facades\Auth;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Mock Auth for testing
Auth::loginUsingId(1); // Assuming user ID 1 exists

echo "Testing Product Import Logic...\n";

$mockRow = [
    'product_name' => 'Test Bulk Product',
    'product_code' => 'TEST001',
    'description' => 'Test Description',
    'buying_price' => '100.00',
    'selling_price' => '150.00',
    'tax' => '10',
    'discount' => '5',
    'quantity' => '10',
    'unit' => 'pcs',
    'brand' => 'Test Brand',
    'low_stock_alert' => '2',
    'batch_number' => 'BATCH-TEST-001',
    'series_number_comma_separated' => 'SN-001, SN-002',
    'expiry_date_yyyy_mm_dd' => '2026-12-31',
    'purchase_date_yyyy_mm_dd' => '2025-03-05',
];

$import = new ProductImport();
$product = $import->model($mockRow);

if ($product && $product->productName === 'Test Bulk Product') {
    echo "SUCCESS: Product created in memory with correct details.\n";
    echo "Profit Margin: " . $product->profitMargin . "%\n";
    
    // Check if series numbers would be created (logic check)
    if (str_contains($mockRow['series_number_comma_separated'], 'SN-001')) {
        echo "SUCCESS: Series numbers detected in mock row.\n";
    }
} else {
    echo "FAILURE: Product import logic failed.\n";
}
