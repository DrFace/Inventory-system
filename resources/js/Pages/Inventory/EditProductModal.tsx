import { useState, useEffect } from "react";
import axios from "axios";

export default function EditProductModal({
    isOpen,
    onClose,
    onUpdated,
    product,
    seriasList,
}: {
    isOpen: boolean;
    onClose: () => void;
    onUpdated: () => void;
    product: any;
    seriasList: { id: number; seriasNo: string }[];
}) {
    const [form, setForm] = useState({
        productName: "", // ✅ NEW
        productCode: "",
        productDescription: "",
        unit: "",
        brand: "",
        seriasId: "",
        lowStock: "",
        productImage: null as File | null,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    
    // ✅ NEW: Track selected batches
    const [selectedBatchIds, setSelectedBatchIds] = useState<number[]>([]);

    // ✅ Populate form when modal opens OR product changes
    useEffect(() => {
        if (isOpen && product) {
            setForm({
                productName: product.productName || "", // ✅ NEW
                productCode: product.productCode || "",
                productDescription: product.productDescription || "",
                unit: product.unit || "",
                brand: product.brand || "",
                seriasId: product.seriasId?.toString() || "",
                lowStock: product.lowStock?.toString() || "",
                productImage: null,
            });

            // Set existing image preview
            if (product.productImage) {
                setImagePreview(`/${product.productImage}`);
            } else {
                setImagePreview(null);
            }

            // Initialize batch selection
            if (product.batches && product.batches.length > 0) {
                setSelectedBatchIds(product.batches.map((b: any) => b.id));
            } else if (product.id) {
                setSelectedBatchIds([product.id]);
            } else {
                setSelectedBatchIds([]);
            }

            setErrors({});
            setShowSuccess(false);
        }
    }, [isOpen, product]);

    // Handle input changes
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: [] }));
    };

    const handleBatchToggle = (batchId: number) => {
        setSelectedBatchIds((prev) =>
            prev.includes(batchId)
                ? prev.filter((id) => id !== batchId)
                : [...prev, batchId]
        );
    };

    // Handle file change with preview
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setForm({ ...form, productImage: file });
            setErrors({ ...errors, productImage: [] });

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            axios.defaults.withCredentials = true;
            await axios.get("/sanctum/csrf-cookie");

            const formData = new FormData();
            formData.append("_method", "PUT");

            Object.entries(form).forEach(([key, value]) => {
                if (value !== "" && value !== null) {
                    formData.append(key, value as any);
                }
            });

            // Append selected batches arrays
            selectedBatchIds.forEach((id) => {
                formData.append("batch_ids[]", id.toString());
            });

            await axios.post(`/inventory/${product.id}`, formData, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data",
                },
            });

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                onUpdated();
                onClose();
                window.location.reload();
            }, 1500);
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
            } else {
                console.error("Submit error:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto shadow-lg">
                <h2 className="text-lg font-bold mb-4">
                    Edit Item: {product?.productName}
                </h2>

                {showSuccess && (
                    <div className="bg-green-100 text-green-700 p-2 rounded mb-2 text-sm">
                        ✅ Product updated successfully!
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        {/* ✅ NEW: Product Name */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium">
                                Item Name
                            </label>
                            <input
                                type="text"
                                name="productName"
                                value={form.productName}
                                onChange={handleChange}
                                placeholder="Item Name"
                                className="w-full border p-2 rounded"
                            />
                            {errors.productName && (
                                <p className="text-red-500 text-sm">
                                    {errors.productName[0]}
                                </p>
                            )}
                        </div>

                        {/* Product Code */}
                        <div>
                            <label className="block text-sm font-medium">
                                Part Number
                            </label>
                            <input
                                type="text"
                                name="productCode"
                                value={form.productCode}
                                onChange={handleChange}
                                placeholder="Part Number"
                                className="w-full border p-2 rounded"
                            />
                            {errors.productCode && (
                                <p className="text-red-500 text-sm">
                                    {errors.productCode[0]}
                                </p>
                            )}
                        </div>

                        {/* Unit */}
                        <div>
                            <label className="block text-sm font-medium">
                                Unit
                            </label>
                            <input
                                type="text"
                                name="unit"
                                value={form.unit}
                                onChange={handleChange}
                                placeholder="Unit (pcs, kg)"
                                className="w-full border p-2 rounded"
                            />
                            {errors.unit && (
                                <p className="text-red-500 text-sm">
                                    {errors.unit[0]}
                                </p>
                            )}
                        </div>

                        {/* Brand */}
                        <div>
                            <label className="block text-sm font-medium">
                                Brand
                            </label>
                            <input
                                type="text"
                                name="brand"
                                value={form.brand}
                                onChange={handleChange}
                                placeholder="Brand"
                                className="w-full border p-2 rounded"
                            />
                            {errors.brand && (
                                <p className="text-red-500 text-sm">
                                    {errors.brand[0]}
                                </p>
                            )}
                        </div>

                        {/* Series */}
                        <div>
                            <label className="block text-sm font-medium">
                                Vehicle Type
                            </label>
                            <select
                                name="seriasId"
                                value={form.seriasId}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                            >
                                <option value="">
                                    -- Select Vehicle Type --
                                </option>
                                {seriasList?.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.seriasNo}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Low Stock */}
                        <div>
                            <label className="block text-sm font-medium">
                                Low Stock Level
                            </label>
                            <input
                                type="number"
                                name="lowStock"
                                value={form.lowStock}
                                onChange={handleChange}
                                placeholder="Low Stock Level"
                                className="w-full border p-2 rounded"
                            />
                            {errors.lowStock && (
                                <p className="text-red-500 text-sm">
                                    {errors.lowStock[0]}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium">
                                Vehicle Description
                            </label>
                            <textarea
                                name="productDescription"
                                value={form.productDescription}
                                onChange={handleChange}
                                placeholder="Description"
                                rows={3}
                                className="w-full border p-2 rounded"
                            />
                            {errors.productDescription && (
                                <p className="text-red-500 text-sm">
                                    {errors.productDescription[0]}
                                </p>
                            )}
                        </div>

                        {/* Product Image */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium">
                                Product Image
                            </label>
                            {imagePreview && (
                                <div className="mb-2">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-32 h-32 object-cover rounded border"
                                    />
                                </div>
                            )}
                            <input
                                type="file"
                                name="productImage"
                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                onChange={handleFileChange}
                                className="w-full border p-2 rounded"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Max 2MB. Formats: JPG, PNG, WebP
                            </p>
                            {errors.productImage && (
                                <p className="text-red-500 text-sm">
                                    {errors.productImage[0]}
                                </p>
                            )}
                        </div>

                        {/* Batch Selection */}
                        {product?.batches && product.batches.length > 0 && (
                            <div className="col-span-2 pt-3 border-t mt-2">
                                <label className="block text-sm font-medium mb-2">
                                    Apply Changes to Selected Batches
                                </label>
                                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                    {product.batches.map((batch: any) => (
                                        <label
                                            key={batch.id}
                                            className="flex items-center p-2 border rounded hover:bg-gray-50 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedBatchIds.includes(batch.id)}
                                                onChange={() => handleBatchToggle(batch.id)}
                                                className="w-4 h-4 text-blue-600 rounded border-gray-300 mr-3"
                                            />
                                            <div className="flex-1 text-sm">
                                                <div className="font-medium text-gray-700">
                                                    Batch: {batch.batchNumber || batch.id}
                                                </div>
                                                <div className="text-gray-500 text-xs flex gap-3 mt-1">
                                                    <span>Qty: {batch.quantity}</span>
                                                    <span>Buy: LKR {batch.buyingPrice || "-"}</span>
                                                    <span>Sell: LKR {batch.sellingPrice || "-"}</span>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {errors.batch_ids && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.batch_ids[0]}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                        >
                            {loading ? "Saving..." : "Update Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
