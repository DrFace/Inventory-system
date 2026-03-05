<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class ProductTemplateExport implements WithHeadings, ShouldAutoSize
{
    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'Product Name',
            'Product Code',
            'Description',
            'Buying Price',
            'Selling Price',
            'Tax',
            'Discount',
            'Quantity',
            'Unit',
            'Brand',
            'Low Stock Alert',
            'Batch Number',
            'Series Number (comma separated)',
            'Expiry Date (YYYY-MM-DD)',
            'Purchase Date (YYYY-MM-DD)',
        ];
    }
}
