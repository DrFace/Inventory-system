<?php

namespace App\Imports;

use App\Models\Product;
use App\Models\SeriasNumber;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Auth;

class ProductImport implements ToModel, WithHeadingRow
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        if (empty($row['product_name'])) {
            return null;
        }

        $seriasId = null;
        if (!empty($row['vehicle_type'])) {
            $serias = SeriasNumber::firstOrCreate(
                ['seriasNo' => trim($row['vehicle_type'])],
                ['status' => 'approved']
            );
            $seriasId = $serias->id;
        }

        $product = new Product([
            'productName'        => $row['product_name'],
            'productCode'        => $row['product_code'],
            'productDescription' => $row['description'],
            'buyingPrice'        => $row['buying_price'],
            'sellingPrice'       => $row['selling_price'],
            'tax'                => $row['tax'],
            'seriasId'           => $seriasId,
            'quantity'           => $row['quantity'],
            'unit'               => $row['unit'],
            'brand'              => $row['brand'],
            'lowStock'           => $row['low_stock_alert'],
            'batchNumber'        => $row['batch_number'],
            'purchaseDate'       => $row['purchase_date_yyyy_mm_dd'],
            'createdBy'          => Auth::id(),
            'status'             => 'approved',
            'availability'       => 'instock',
        ]);

        // Profit margin: Use the value from the file if provided, otherwise compute it
        $buyingPrice = (float) $row['buying_price'];
        $sellingPrice = (float) $row['selling_price'];
        
        if (isset($row['profit_margin']) && $row['profit_margin'] !== '' && $row['profit_margin'] !== null) {
            $product->profitMargin = (float) $row['profit_margin'];
        } elseif ($buyingPrice > 0) {
            $product->profitMargin = (($sellingPrice - $buyingPrice) / $buyingPrice) * 100;
        }

        $product->save();

        // Handle Series Numbers
        // Series numbers have been omitted from the template, so we don't handle them for now

        return $product;
    }
}
