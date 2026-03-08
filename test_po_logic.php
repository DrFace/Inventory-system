<?php

use App\Models\Product;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// We need a user
$user = User::first() ?? User::factory()->create();
Auth::loginUsingId($user->id);

// We need a supplier
if (Supplier::count() === 0) {
    Supplier::create([
        'supplierName' => 'Test Supplier',
        'supplierPhone' => '1234567890',
        'supplierEmail' => 'test@example.com',
        'supplierAddress' => 'Test Address',
    ]);
}
$supplier = Supplier::first();

// We need some products
if (Product::count() === 0) {
    Product::create([
        'productName' => 'Test Product 1',
        'productCode' => 'TP001',
        'buyingPrice' => '100.00',
        'sellingPrice' => '150.00',
        'quantity' => 10,
        'lowStock' => 5,
    ]);
}
$product1 = Product::first();

echo "Testing Purchase Order Logic...\n";

// Emulate store() logic
$totalAmount = 2 * $product1->buyingPrice;
$po = PurchaseOrder::create([
    'po_number' => 'PO-' . strtoupper(uniqid()),
    'supplier_id' => $supplier->id,
    'total_amount' => $totalAmount,
    'status' => 'pending',
    'notes' => 'Test notes',
    'created_by' => $user->id,
]);

PurchaseOrderItem::create([
    'purchase_order_id' => $po->id,
    'product_id' => $product1->id,
    'quantity' => 2,
    'unit_price' => $product1->buyingPrice,
    'total_price' => 2 * $product1->buyingPrice,
]);

echo "SUCCESS: Purchase Order created with ID: " . $po->id . "\n";

// Emulate downloadPdf() logic
$purchaseOrder = PurchaseOrder::with(['supplier', 'user', 'items.product'])->find($po->id);
if ($purchaseOrder) {
    try {
        $pdf = Pdf::loadView('pdf.purchase_order', compact('purchaseOrder'));
        $pdfContent = $pdf->output();
        if (strlen($pdfContent) > 0) {
            echo "SUCCESS: PDF generated successfully (" . strlen($pdfContent) . " bytes).\n";
        } else {
            echo "FAILURE: PDF is empty.\n";
        }
    } catch (\Exception $e) {
        echo "FAILURE: Error generating PDF: " . $e->getMessage() . "\n";
    }
} else {
    echo "FAILURE: Could not retrieve Purchase Order for PDF generation.\n";
}

// Cleanup
$po->items()->delete();
$po->delete();
echo "Cleanup done.\n";
