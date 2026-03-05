<?php

namespace App\Imports;

use App\Models\Customer;
use App\Models\DiscountCategory;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class CustomerImport implements ToModel, WithHeadingRow
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        if (empty($row['name'])) {
            return null;
        }

        $discountCategoryId = null;
        if (!empty($row['discount_category'])) {
            $category = DiscountCategory::firstOrCreate(
                ['name' => trim($row['discount_category'])],
                [
                    'type' => 'percentage', // Default type, admin can change later
                    'value' => 0,           // Default value
                    'status' => 'active',
                ]
            );
            $discountCategoryId = $category->id;
        }

        $rawStatus = strtolower(trim($row['status_active_inactive'] ?? $row['status_activeinactive'] ?? 'active'));
        $status = in_array($rawStatus, ['active', 'inactive']) ? $rawStatus : 'inactive';

        $rawCreditPeriod = trim(str_ireplace('days', '', (string)($row['credit_period_days_eg_30'] ?? $row['credit_period'] ?? '0')));
        $creditPeriod = $rawCreditPeriod . ' days';

        return new Customer([
            'name'                 => $row['name'],
            'contactNumber'        => $row['contact_number'],
            'email'                => $row['email'],
            'vatNumber'            => $row['vat_number'] ?? null,
            'address'              => $row['address'],
            'creditLimit'          => $row['credit_limit'] ?? 0,
            'discount_category_id' => $discountCategoryId,
            'creditPeriod'         => $creditPeriod,
            'status'               => $status,
            'availability'         => true,
        ]);
    }
}
