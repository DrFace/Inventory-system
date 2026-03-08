import { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { toast } from "react-toastify";
import AddSupplierModal from "./AddSupplierModal";

interface Product {
  id: number;
  productName: string;
  productCode: string;
  quantity: number;
  lowStock: number;
  buyingPrice: string;
}

interface Supplier {
  id: number;
  supplierName: string;
}

interface Props {
  products: Product[];
  suppliers: Supplier[];
}

export default function PurchaseOrderCreate() {
  const { products, suppliers: initialSuppliers } = usePage().props as unknown as Props;
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [supplierId, setSupplierId] = useState("");
  const [cart, setCart] = useState<{ product: Product; quantity: number; price: number }[]>([]);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      setCart(cart.map((item) => 
        item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1, price: parseFloat(product.buyingPrice || "0") }]);
    }
    toast.info(`${product.productName} added to order.`);
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, qty: number) => {
    setCart(cart.map((item) => 
      item.product.id === productId ? { ...item, quantity: Math.max(1, qty) } : item
    ));
  };

  const updatePrice = (productId: number, price: number) => {
    setCart(cart.map((item) => 
      item.product.id === productId ? { ...item, price: Math.max(0, price) } : item
    ));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId) {
      toast.error("Please select a supplier");
      return;
    }
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setIsSaving(true);
    router.post(route("purchase-orders.store"), {
      supplier_id: supplierId,
      notes: notes,
      items: cart.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.price
      }))
    }, {
      onSuccess: () => {
        toast.success("Purchase Order created!");
        setIsSaving(false);
      },
      onError: () => {
        toast.error("Failed to create PO");
        setIsSaving(false);
      }
    });
  };

  return (
    <Authenticated>
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Create Purchase Order</h2>
          <Link href={route("purchase-orders.index")} className="text-blue-600 hover:underline">
            Back to List
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Selection */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-4">Select Products</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
                {products.map((product) => {
                  const isLowStock = product.quantity <= (product.lowStock || 0);
                  const isOutOfStock = product.quantity === 0;

                  return (
                    <div 
                      key={product.id} 
                      className={`p-4 border rounded-xl flex flex-col justify-between transition-all hover:shadow-md cursor-pointer ${
                        isOutOfStock ? "border-red-500 bg-red-50" : isLowStock ? "border-yellow-500 bg-yellow-50" : "border-gray-200"
                      }`}
                      onClick={() => addToCart(product)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-gray-800">{product.productName}</p>
                          <p className="text-xs text-gray-500">{product.productCode}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isOutOfStock ? "bg-red-600 text-white" : isLowStock ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"
                        }`}>
                          Stock: {product.quantity}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-sm font-semibold text-gray-700">Buying: {parseFloat(product.buyingPrice || "0").toFixed(2)}</span>
                        <button 
                          className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* PO Details & Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h3 className="text-lg font-bold mb-4">Order Summary</h3>
              
              <div className="mb-4">
                <div className="flex justify-between items-end mb-1">
                  <label className="block text-sm font-medium text-gray-700">Supplier</label>
                  <button 
                    type="button" 
                    onClick={() => setIsSupplierModalOpen(true)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    + Add New
                  </button>
                </div>
                <select 
                  className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.supplierName}</option>)}
                </select>
              </div>

              <div className="mb-6 max-h-[300px] overflow-y-auto space-y-3">
                {cart.length === 0 ? (
                  <p className="text-center py-4 text-gray-400 italic text-sm">No items added yet</p>
                ) : (
                  cart.map(item => (
                    <div key={item.product.id} className="p-3 bg-gray-50 border rounded-lg group">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-sm font-bold text-gray-800 line-clamp-1">{item.product.productName}</p>
                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="text-[10px] text-gray-400 uppercase">Qty</label>
                          <input 
                            type="number" 
                            className="w-full text-xs p-1 border rounded"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                          />
                        </div>
                        <div className="flex-[2]">
                          <label className="text-[10px] text-gray-400 uppercase">Unit Price</label>
                          <input 
                            type="number" 
                            step="0.01"
                            className="w-full text-xs p-1 border rounded"
                            value={item.price}
                            onChange={(e) => updatePrice(item.product.id, parseFloat(e.target.value))}
                          />
                        </div>
                        <div className="flex flex-col justify-end text-right">
                          <p className="text-xs font-bold">{(item.quantity * item.price).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t pt-4 space-y-2 mb-6">
                <div className="flex justify-between items-center text-xl font-bold text-blue-600">
                  <span>Total</span>
                  <span>{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <textarea 
                  className="w-full border-gray-300 rounded-lg text-sm"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional order instructions..."
                ></textarea>
              </div>

              <button 
                onClick={handleSubmit}
                disabled={isSaving || cart.length === 0}
                className={`w-full py-3 rounded-xl font-bold transition-all shadow-md ${
                  isSaving || cart.length === 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isSaving ? "Creating..." : "Create Purchase Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <AddSupplierModal 
        isOpen={isSupplierModalOpen} 
        onClose={() => setIsSupplierModalOpen(false)} 
        onSuccess={(newSupplier) => {
            setSuppliers(prev => [...prev, newSupplier]);
            setSupplierId(newSupplier.id.toString());
        }}
      />
    </Authenticated>
  );
}
