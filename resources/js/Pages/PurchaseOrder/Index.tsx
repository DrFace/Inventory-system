import { Link, usePage } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";

interface PurchaseOrder {
  id: number;
  po_number: string;
  supplier_id: number;
  total_amount: string;
  status: string;
  created_at: string;
  supplier?: {
    supplierName: string;
  };
  user?: {
    name: string;
  };
}

interface Props {
  purchaseOrders: PurchaseOrder[];
}

export default function PurchaseOrderIndex() {
  const { purchaseOrders } = usePage().props as unknown as Props;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'ordered': return 'bg-blue-100 text-blue-700';
      case 'received': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Authenticated>
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Purchase Orders</h2>
          <Link 
            href={route("purchase-orders.create")} 
            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition"
          >
            Create New PO
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">PO Number</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Supplier</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {purchaseOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                      No purchase orders found.
                    </td>
                  </tr>
                ) : (
                  purchaseOrders.map((po) => (
                    <tr key={po.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900">{po.po_number}</span>
                        <div className="text-[10px] text-gray-400">Created by {po.user?.name}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {po.supplier?.supplierName || "Default Supplier"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(po.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        {parseFloat(po.total_amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${getStatusColor(po.status)}`}>
                          {po.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <Link 
                          href={route("purchase-orders.show", po.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-bold"
                        >
                          View
                        </Link>
                        <a 
                          href={route("purchase-orders.download", po.id)}
                          className="text-green-600 hover:text-green-800 text-sm font-bold"
                          target="_blank"
                        >
                          PDF
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Authenticated>
  );
}
