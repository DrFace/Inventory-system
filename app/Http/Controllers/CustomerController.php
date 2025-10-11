<?php
namespace App\Http\Controllers;

use App\Http\Requests\Customer\CustomerRequest;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $customers = Customer::latest()->paginate(10);

        return Inertia::render('Customer/Index', [
            'customers' => $customers,
        ]);
    }

    public function store(CustomerRequest $request)
    {
        $data = $request->validated();

        $customer             = Customer::create($data);
        $customer->netBalance = $customer->creditBalance ?? 0;
        $customer->save();

        return response()->json([
            'message'  => 'Customer added successfully!',
            'customer' => $customer,
        ]);
    }
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
