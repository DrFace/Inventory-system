import { Link, usePage } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";

interface PurchaseOrderItem {
  id: number;
  product: {
    productName: string;
    productCode: string;
  };
  quantity: number;
  unit_price: string;
  total_price: string;
}

interface PurchaseOrder {
  id: number;
  po_number: string;
  supplier: {
    supplierName: string;
  };
  user: {
    name: string;
  };
  total_amount: string;
  status: string;
  notes: string | null;
  items: PurchaseOrderItem[];
  created_at: string;
}

interface Props {
  purchaseOrder: PurchaseOrder;
}

export default function PurchaseOrderView() {
  const { purchaseOrder } = usePage().props as unknown as Props;

  return (
    <Authenticated>
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href={route("purchase-orders.index")} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h2 className="text-2xl font-bold">Purchase Order Details</h2>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full uppercase">
              {purchaseOrder.status}
            </span>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => window.print()}
              className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg shadow-sm hover:bg-gray-50 transition"
            >
              Print PO
            </button>
            <a 
              href={route("purchase-orders.download", purchaseOrder.id)}
              className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg shadow hover:bg-green-700 transition"
              target="_blank"
            >
              Download PDF
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 overflow-hidden">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Order Items
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-xs font-bold text-gray-400 uppercase border-b">
                    <tr>
                      <th className="pb-4">Product</th>
                      <th className="pb-4 text-center">Qty</th>
                      <th className="pb-4 text-right">Unit Price</th>
                      <th className="pb-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {purchaseOrder.items.map((item) => (
                      <tr key={item.id} className="group">
                        <td className="py-4">
                          <p className="font-bold text-gray-800">{item.product.productName}</p>
                          <p className="text-xs text-gray-400">{item.product.productCode}</p>
                        </td>
                        <td className="py-4 text-center text-sm font-medium text-gray-600">
                          {item.quantity}
                        </td>
                        <td className="py-4 text-right text-sm font-medium text-gray-600">
                          {parseFloat(item.unit_price).toFixed(2)}
                        </td>
                        <td className="py-4 text-right font-bold text-gray-900">
                          {parseFloat(item.total_price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="pt-6 text-right font-bold text-gray-500">Subtotal</td>
                      <td className="pt-6 text-right font-bold text-gray-900">{parseFloat(purchaseOrder.total_amount).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="pt-2 text-right text-xl font-bold text-blue-600 uppercase tracking-wider">Grand Total</td>
                      <td className="pt-2 text-right text-xl font-bold text-blue-600">{parseFloat(purchaseOrder.total_amount).toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
            {purchaseOrder.notes && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-wider">Additional Notes</h3>
                <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed">{purchaseOrder.notes}</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase mb-6 tracking-wider">Order Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest block mb-1">PO Number</label>
                  <p className="font-bold text-gray-800">{purchaseOrder.po_number}</p>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest block mb-1">Supplier</label>
                  <p className="font-bold text-gray-800">{purchaseOrder.supplier.supplierName}</p>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest block mb-1">Date Created</label>
                  <p className="font-bold text-gray-800">{new Date(purchaseOrder.created_at).toLocaleString()}</p>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest block mb-1">Ordered By</label>
                  <p className="font-bold text-gray-800">{purchaseOrder.user.name}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 rounded-xl shadow-lg p-6 text-white overflow-hidden relative">
              <svg className="absolute -right-6 -bottom-6 w-32 h-32 text-blue-500 opacity-20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11 20H4a2 2 0 01-2-2V5a2 2 0 012-2h3.18a4 4 0 017.64 0H20a2 2 0 012 2v13a2 2 0 01-2 2h-7l-2 2-2-2z" />
              </svg>
              <h3 className="text-sm font-bold text-blue-200 uppercase mb-2 tracking-widest relative z-10">Account Payable</h3>
              <p className="text-4xl font-black relative z-10">{parseFloat(purchaseOrder.total_amount).toFixed(2)}</p>
              <p className="text-xs text-blue-200 mt-2 relative z-10">Pending Payment</p>
            </div>
          </div>
        </div>
      </div>
    </Authenticated>
  );
}
