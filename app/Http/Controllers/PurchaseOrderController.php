<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class PurchaseOrderController extends Controller
{
    public function index()
    {
        $purchaseOrders = PurchaseOrder::with(['supplier', 'user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('PurchaseOrder/Index', [
            'purchaseOrders' => $purchaseOrders,
        ]);
    }

    public function create()
    {
        $products = Product::all(['id', 'productName', 'productCode', 'quantity', 'lowStock', 'buyingPrice']);
        $suppliers = Supplier::all(['id', 'supplierName']);

        return Inertia::render('PurchaseOrder/Create', [
            'products' => $products,
            'suppliers' => $suppliers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated) {
            $totalAmount = collect($validated['items'])->sum(function ($item) {
                return $item['quantity'] * $item['unit_price'];
            });

            $po = PurchaseOrder::create([
                'po_number' => 'PO-' . strtoupper(uniqid()),
                'supplier_id' => $validated['supplier_id'],
                'total_amount' => $totalAmount,
                'status' => 'pending',
                'notes' => $validated['notes'],
                'created_by' => auth()->id(),
            ]);

            foreach ($validated['items'] as $item) {
                PurchaseOrderItem::create([
                    'purchase_order_id' => $po->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_price' => $item['quantity'] * $item['unit_price'],
                ]);
            }

            return redirect()->route('purchase-orders.index')->with('success', 'Purchase Order created successfully.');
        });
    }

    public function show($id)
    {
        $purchaseOrder = PurchaseOrder::with(['supplier', 'user', 'items.product'])
            ->findOrFail($id);

        return Inertia::render('PurchaseOrder/View', [
            'purchaseOrder' => $purchaseOrder,
        ]);
    }

    public function downloadPdf($id)
    {
        $purchaseOrder = PurchaseOrder::with(['supplier', 'user', 'items.product'])
            ->findOrFail($id);

        $pdf = Pdf::loadView('pdf.purchase_order', compact('purchaseOrder'));
        
        return $pdf->download($purchaseOrder->po_number . '.pdf');
    }
}
