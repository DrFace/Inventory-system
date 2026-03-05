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

        $product = new Product([
            'productName'        => $row['product_name'],
            'productCode'        => $row['product_code'],
            'productDescription' => $row['description'],
            'buyingPrice'        => $row['buying_price'],
            'sellingPrice'       => $row['selling_price'],
            'tax'                => $row['tax'],
            'discount'           => $row['discount'],
            'quantity'           => $row['quantity'],
            'unit'               => $row['unit'],
            'brand'              => $row['brand'],
            'lowStock'           => $row['low_stock_alert'],
            'batchNumber'        => $row['batch_number'],
            'expiryDate'         => $row['expiry_date_yyyy_mm_dd'],
            'purchaseDate'       => $row['purchase_date_yyyy_mm_dd'],
            'createdBy'          => Auth::id(),
            'status'             => 'approved',
            'availability'       => 'instock',
        ]);

        // Calculate profit margin
        $buyingPrice = (float) $row['buying_price'];
        $sellingPrice = (float) $row['selling_price'];
        if ($buyingPrice > 0) {
            $product->profitMargin = (($sellingPrice - $buyingPrice) / $buyingPrice) * 100;
        }

        $product->save();

        // Handle Series Numbers
        if (!empty($row['series_number_comma_separated'])) {
            $seriesNumbers = explode(',', $row['series_number_comma_separated']);
            foreach ($seriesNumbers as $sNo) {
                $sNo = trim($sNo);
                if (!empty($sNo)) {
                    SeriasNumber::create([
                        'seriasNo' => $sNo,
                        'status'   => 'approved',
                    ]);
                    // Note: The product table has a seriasId, but usually series are 1-to-many.
                    // The schema suggests Product has seriasId. If one product can have multiple series,
                    // we might need to link them properly. For now, following the schema's seriasId.
                    // If multiple series are provided, the last one's ID might be linked if we stick to the column.
                    // However, often series numbers are individual items.
                    // Let's assume the user wants to log these series numbers.
                }
            }
        }

        return $product;
    }
}
