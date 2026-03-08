<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Exports\ProductTemplateExport;
use App\Imports\ProductImport;
use App\Exports\CustomerTemplateExport;
use App\Imports\CustomerImport;
use Maatwebsite\Excel\Facades\Excel;
use Inertia\Inertia;

class BulkDataController extends Controller
{
    public function downloadProductTemplate()
    {
        return Excel::download(new ProductTemplateExport, 'product_template.xlsx');
    }

    public function uploadProducts(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv',
        ]);

        try {
            Excel::import(new ProductImport, $request->file('file'));
            return back()->with('success', 'Products imported successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['file' => 'Error importing products: ' . $e->getMessage()]);
        }
    }

    public function downloadCustomerTemplate()
    {
        return Excel::download(new CustomerTemplateExport, 'customer_template.xlsx');
    }

    public function uploadCustomers(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv',
        ]);

        try {
            Excel::import(new CustomerImport, $request->file('file'));
            return back()->with('success', 'Customers imported successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['file' => 'Error importing customers: ' . $e->getMessage()]);
        }
    }
}
