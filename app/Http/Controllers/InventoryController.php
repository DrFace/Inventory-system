<?php
namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\SeriasNumber;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->all(['searchParam', 'sortBy', 'sortDirection', 'perPage', 'page', 'seriasId']);

        $query = Product::query()
            ->leftJoin('serias_numbers', 'products.seriasId', '=', 'serias_numbers.id')
            ->select([
                'products.id',
                'products.productName',
                'products.productCode',
                'products.productDescription',
                'products.unit',
                'products.brand',
                'products.seriasId',
                'products.lowStock',
                'products.productImage',
                'products.batchNumber',
                'products.buyingPrice',
                'products.sellingPrice',
                'products.quantity',
                'products.purchaseDate',
                'products.status',
                'serias_numbers.seriasNo as seriasNo',
            ]);

        // Universal Search
        if ($request->filled('searchParam')) {
            $search = $request->input('searchParam');
            $query->where(function ($q) use ($search) {
                $q->where('products.productName', 'like', "%{$search}%")
                    ->orWhere('products.productCode', 'like', "%{$search}%");
            });
        }

        // Series Filter
        if ($request->filled('seriasId') && $request->input('seriasId') !== 'all') {
            $query->where('products.seriasId', $request->input('seriasId'));
        }

        // Sorting
        $sortBy = $request->input('sortBy') ?: 'id';
        if ($sortBy === 'name') $sortBy = 'productName'; // Mapping default 'name' from MasterTable
        
        $sortDirection = strtolower($request->input('sortDirection')) === 'asc' ? 'asc' : 'desc';
        
        if ($sortBy === 'seriasNo') {
            $query->orderBy('serias_numbers.seriasNo', $sortDirection);
        } else {
            // Ensure the column exists to avoid SQL errors
            $allowedColumns = ['id', 'productName', 'productCode', 'productDescription', 'buyingPrice', 'sellingPrice', 'quantity', 'availability', 'purchaseDate'];
            $orderBy = in_array($sortBy, $allowedColumns) ? $sortBy : 'id';
            $query->orderBy("products.{$orderBy}", $sortDirection);
        }

        $perPage = $request->input('perPage') ?: 10;
        if (!is_numeric($perPage)) $perPage = 10;
        
        $products = $query->paginate($perPage)->withQueryString()->toArray();

        // Fetch series list
        $seriasList = SeriasNumber::select(['id', 'seriasNo'])->get()->toArray();

        // Get user permissions
        $user = auth()->user();
        $permissions = $user ? $user->getPermissions() : [];
        $isAdmin = $user ? $user->isAdmin() : false;

        return Inertia::render('Inventory/Index', [
            'products'    => $products,
            'seriasList'  => $seriasList,
            'permissions' => $permissions,
            'isAdmin'     => $isAdmin,
            'filters'     => $filters,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'productName'        => 'required|string|max:255',
            'productCode'        => 'required|string|max:255',
            'productImage'       => 'nullable|file|mimes:jpeg,png,jpg,gif,svg,webp|max:10240',
            'productDescription' => 'nullable|string',
            'unit'               => 'required|string',
            'brand'              => 'nullable|string',
            'seriasId'           => 'nullable|integer',
            'lowStock'           => 'required|integer',
        ]);

        $validated['createdBy'] = auth()->id();

        // ✅ handle image upload
        if ($request->hasFile('productImage')) {
            $file     = $request->file('productImage');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('assets'), $filename);
            $validated['productImage'] = 'assets/' . $filename;
        }

        // Set pricing fields as null - will be filled when stock is added
        $validated['buyingPrice'] = null;
        $validated['sellingPrice'] = null;
        $validated['quantity'] = 0;
        $validated['tax'] = null;
        $validated['profitMargin'] = null;
        $validated['batchNumber'] = null;
        $validated['expiryDate'] = null;
        $validated['purchaseDate'] = null;

        $product = Product::create($validated);

        return response()->json([
            'message' => 'Product created successfully. Add stock to set pricing.',
            'product' => $product,
        ], 201);
    }

    public function addStock(Request $request)
    {
        $mode = $request->input('mode', 'new');

        if ($mode === 'existing') {
            // Adding to existing batch
            $validated = $request->validate([
                'batchId'   => 'required|integer|exists:products,id',
                'quantity'  => 'required|integer|min:1',
            ]);

            $product = Product::findOrFail($validated['batchId']);
            $product->increment('quantity', $validated['quantity']);

            return response()->json([
                'message' => "Added {$validated['quantity']} units to batch {$product->batchNumber}. New stock: {$product->quantity}",
                'stock'   => $product->fresh(),
            ], 200);
        }

        // Creating new batch (existing logic)
        $validated = $request->validate([
            'productId'     => 'required|integer|exists:products,id',
            'buyingPrice'   => 'required|numeric',
            'tax'           => 'nullable|numeric',
            'profitMargin'  => 'nullable|numeric',
            'sellingPrice'  => 'required|numeric',
            'quantity'      => 'required|integer|min:1',
            'batchNumber'   => 'nullable|string',
            'purchaseDate'  => 'nullable|date',
            'expiryDate'    => 'nullable|date',
        ]);

        $product = Product::findOrFail($validated['productId']);

        // If buyingPrice is null (first stock addition), update the existing product
        if (is_null($product->buyingPrice)) {
            $product->update([
                'buyingPrice'   => $validated['buyingPrice'],
                'tax'           => $validated['tax'],
                'profitMargin'  => $validated['profitMargin'],
                'sellingPrice'  => $validated['sellingPrice'],
                'quantity'      => $validated['quantity'],
                'batchNumber'   => $validated['batchNumber'],
                'purchaseDate'  => $validated['purchaseDate'],
                'expiryDate'    => $validated['expiryDate'] ?? null,
            ]);

            return response()->json([
                'message' => 'Stock added to product successfully',
                'stock'   => $product->fresh(),
            ], 200);
        } else {
            // If buyingPrice is not null, create a new product entry (new batch)
            $newProduct = Product::create([
                'productName'        => $product->productName,
                'productCode'        => $product->productCode,
                'productImage'       => $product->productImage,
                'productDescription' => $product->productDescription,
                'unit'               => $product->unit,
                'brand'              => $product->brand,
                'seriasId'           => $product->seriasId,
                'lowStock'           => $product->lowStock,
                'createdBy'          => auth()->id(),
                'buyingPrice'        => $validated['buyingPrice'],
                'tax'                => $validated['tax'],
                'profitMargin'       => $validated['profitMargin'],
                'sellingPrice'       => $validated['sellingPrice'],
                'quantity'           => $validated['quantity'],
                'batchNumber'        => $validated['batchNumber'],
                'purchaseDate'       => $validated['purchaseDate'],
                'expiryDate'         => $validated['expiryDate'] ?? null,
            ]);

            return response()->json([
                'message' => 'New stock batch created successfully',
                'stock'   => $newProduct,
            ], 201);
        }
    }

    public function seriasStore(Request $request)
    {
        $validated = $request->validate([
            'seriasNo' => 'required|string|max:255',
        ]);

        $serias = SeriasNumber::create($validated);

        return response()->json($serias, 201);
    }

        public function show($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json(['product' => $product], 200);
    }

    // 🔹 Update existing product(s)
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'productCode'        => 'nullable|string|max:255',
            'productDescription' => 'nullable|string|max:1000',
            'unit'               => 'nullable|string|max:50',
            'brand'              => 'nullable|string|max:255',
            'seriasId'           => 'nullable|integer',
            'lowStock'           => 'nullable|integer|min:0',
            'productName'        => 'nullable|string|max:255',
            'productImage'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'batch_ids'          => 'nullable|array',
            'batch_ids.*'        => 'integer|exists:products,id',
        ]);

        $idsToUpdate = !empty($validated['batch_ids']) ? $validated['batch_ids'] : [$id];
        
        // Handle image upload once
        if ($request->hasFile('productImage')) {
            $file     = $request->file('productImage');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('assets'), $filename);
            $validated['productImage'] = 'assets/' . $filename;
        }

        // Remove batch_ids from the validated data so it's not passed into the update
        $updateData = collect($validated)->except('batch_ids')->toArray();

        foreach ($idsToUpdate as $targetId) {
            $product = Product::find($targetId);
            if ($product) {
                // If there's an image upload, delete the old image if it exists
                if (isset($updateData['productImage']) && $product->productImage && file_exists(public_path($product->productImage))) {
                    @unlink(public_path($product->productImage));
                }
                
                $product->update($updateData);
            }
        }

        return response()->json([
            'message' => 'Products updated successfully',
            'updated_ids' => $idsToUpdate,
        ], 200);
    }

    public function getBatches($productId)
    {
        // Get all products (batches) with the same product details
        $baseProduct = Product::find($productId);
        
        if (!$baseProduct) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        // Find all batches for this product (same productName and productCode)
        $batches = Product::where('productName', $baseProduct->productName)
            ->where('productCode', $baseProduct->productCode)
            ->whereNotNull('buyingPrice')
            ->select('id', 'batchNumber', 'quantity', 'buyingPrice', 'tax', 'profitMargin', 'sellingPrice', 'purchaseDate')
            ->get();

        return response()->json([
            'batches' => $batches,
        ], 200);
    }
}
