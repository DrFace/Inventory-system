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
            'Item Name',
            'Item Code',
            'Vehicle Description',
            'Buying Price',
            'Selling Price',
            'Tax',
            'Vehicle Type',
            'Profit Margin',
            'Quantity',
            'Unit',
            'Brand',
            'Low Stock Alert',
            'Batch Number',
            'Purchase Date (YYYY-MM-DD)',
        ];
    }
}
