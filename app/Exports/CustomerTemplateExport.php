<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class CustomerTemplateExport implements WithHeadings, ShouldAutoSize
{
    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'Name',
            'Contact Number',
            'Email',
            'VAT Number',
            'Address',
            'Credit Limit',
            'Discount Category',
            'Credit Period (days, e.g. 30)',
            'Status (active/Inactive)',
        ];
    }
}
