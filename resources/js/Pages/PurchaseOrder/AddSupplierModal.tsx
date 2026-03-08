import { useState } from "react";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import { toast } from "react-toastify";

interface AddSupplierModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (supplier: any) => void;
}

export default function AddSupplierModal({ isOpen, onClose, onSuccess }: AddSupplierModalProps) {
    const [formData, setFormData] = useState({
        supplierName: "",
        companyName: "",
        supplierPhone: "",
        supplierEmail: "",
        supplierAddress: "",
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const response = await axios.post(route("suppliers.store"), formData);
            toast.success("Supplier added successfully!");
            onSuccess(response.data.supplier);
            onClose();
            setFormData({
                supplierName: "",
                companyName: "",
                supplierPhone: "",
                supplierEmail: "",
                supplierAddress: "",
            });
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to add supplier");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                    <Dialog.Title className="text-xl font-bold mb-4">Add New Supplier</Dialog.Title>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Supplier Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={formData.supplierName}
                                onChange={(e) => setFormData({...formData, supplierName: e.target.value})}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Company Name</label>
                            <input
                                type="text"
                                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={formData.companyName}
                                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                <input
                                    type="text"
                                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    value={formData.supplierPhone}
                                    onChange={(e) => setFormData({...formData, supplierPhone: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    value={formData.supplierEmail}
                                    onChange={(e) => setFormData({...formData, supplierEmail: e.target.value})}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <textarea
                                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                rows={2}
                                value={formData.supplierAddress}
                                onChange={(e) => setFormData({...formData, supplierAddress: e.target.value})}
                            ></textarea>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                                    isSaving ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            >
                                {isSaving ? "Saving..." : "Save Supplier"}
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
