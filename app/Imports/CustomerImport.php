<?php

namespace App\Imports;

use App\Models\Customer;
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

        return new Customer([
            'name'          => $row['name'],
            'contactNumber' => $row['contact_number'],
            'email'         => $row['email'],
            'address'       => $row['address'],
            'creditLimit'   => $row['credit_limit'] ?? 0,
            'creditPeriod'  => ($row['credit_period_days_eg_30'] ?? 0) . ' days',
            'status'        => strtolower($row['status_active_inactive'] ?? 'active'),
            'availability'  => true,
        ]);
    }
}
