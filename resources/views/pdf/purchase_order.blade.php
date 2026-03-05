<!DOCTYPE html>
<html>
<head>
    <title>Purchase Order {{ $purchaseOrder->po_number }}</title>
    <style>
        body { font-family: sans-serif; font-size: 14px; }
        .header { text-align: center; margin-bottom: 30px; }
        .po-info { margin-bottom: 20px; }
        .items-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .items-table th { background-color: #f2f2f2; }
        .footer { margin-top: 40px; text-align: right; }
    </style>
</head>
<body>
    <div class="header">
        <h1>PURCHASE ORDER</h1>
        <p>{{ $purchaseOrder->po_number }}</p>
    </div>

    <div class="po-info">
        <strong>Supplier:</strong> {{ $purchaseOrder->supplier->supplierName }}<br>
        <strong>Date:</strong> {{ $purchaseOrder->created_at->format('Y-m-d') }}<br>
        <strong>Created By:</strong> {{ $purchaseOrder->user->name }}
    </div>

    <table class="items-table">
        <thead>
            <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($purchaseOrder->items as $item)
            <tr>
                <td>{{ $item->product->productName }} ({{ $item->product->productCode }})</td>
                <td>{{ $item->quantity }}</td>
                <td>{{ number_format($item->unit_price, 2) }}</td>
                <td>{{ number_format($item->total_price, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <td colspan="3" style="text-align: right;"><strong>Total Amount:</strong></td>
                <td><strong>{{ number_format($purchaseOrder->total_amount, 2) }}</strong></td>
            </tr>
        </tfoot>
    </table>

    @if($purchaseOrder->notes)
    <div style="margin-top: 20px;">
        <strong>Notes:</strong><br>
        {{ $purchaseOrder->notes }}
    </div>
    @endif
</body>
</html>
