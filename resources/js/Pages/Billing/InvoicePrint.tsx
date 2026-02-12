import React, { useEffect } from "react";

interface InvoiceItem {
    id: number;
    salesId: number;
    productId: number;
    productName?: string;
    productCode?: string;
    quantity: number;
    salePrice: string;
    descount: string;
    totalAmount: string;
    returnQuantity: number;
    created_at: string;
    updated_at: string;
}

interface InvoiceData {
    id: number;
    customerId: number | null;
    productId: number[];
    returnProductId: any;
    totalQuantity: number;
    totalAmount: string;
    paidAmount: string;
    dueAmount: string;
    creditAmount: string;
    cardAmount: string;
    cashAmount: string;
    paymentMethod: string;
    createdBy: number;
    status: string;
    billNumber: string;
    created_at: string;
    updated_at: string;
    discount_value: number;
    items: InvoiceItem[];
    customer_name?: string;
    customer_contact?: string;
    company?: string;
    customer_email?: string;
    customer_address?: string;
    customer_vat_number?: string;
    discount_category_name?: string;
    discount_category_type?: string;
    discount_category_value?: number;
}

export default function InvoicePrint({
    invoice,
    vatNumber,
    currency = "LKR",
    exchangeRate,
    printMode = "full",
}: {
    invoice: InvoiceData;
    vatNumber?: string;
    currency?: string;
    exchangeRate?: number | null;
    printMode?: "full" | "template" | "details";
}) {
    useEffect(() => {
        setTimeout(() => window.print(), 500);
    }, []);

    // Helper functions...
    const convertPrice = (lkrAmount: string | number): number => {
        const amount =
            typeof lkrAmount === "string" ? parseFloat(lkrAmount) : lkrAmount;
        if (currency === "USD" && exchangeRate) {
            return amount / exchangeRate;
        }
        return amount;
    };

    const formatCurrency = (amount: number): string => {
        if (currency === "USD") {
            return `$${amount.toFixed(2)}`;
        }
        return `Rs. ${amount.toFixed(2)}`;
    };

    const allItems = invoice.items || [];
    const itemsPerPage = 5;
    const totalPages = Math.ceil(allItems.length / itemsPerPage);

    const itemChunks = [];
    for (let i = 0; i < allItems.length; i += itemsPerPage) {
        itemChunks.push(allItems.slice(i, i + itemsPerPage));
    }

    const goodsValue = Number.parseFloat(String(invoice.totalAmount || 0)) || 0;
    const discountValue =
        Number.parseFloat(String(invoice.discount_value || 0)) || 0;
    const totalAfterDiscount = Math.max(0, goodsValue - discountValue);
    const vatAmount = totalAfterDiscount - (totalAfterDiscount * 100) / 118;
    const grandTotal = totalAfterDiscount + vatAmount;

    // Helper to decide visibility
    const showTemplate = printMode === "full" || printMode === "template";
    const showDetails = printMode === "full" || printMode === "details";

    // Style for hiding but keeping layout
    const detailStyle = (isVisible: boolean) => ({
        visibility: isVisible ? ("visible" as const) : ("hidden" as const),
    });

    // Style for completely hiding (for template mode where we don't want to see data)
    const templateOnlyStyle = (isVisible: boolean) => ({
        display: isVisible ? undefined : "none",
    });

    return (
        <>
            {itemChunks.map((pageItems, pageIndex) => (
                <div
                    key={pageIndex}
                    className={pageIndex > 0 ? "page-break" : ""}
                >
                    <style>{`
                        @media print {
                            .page-break {
                                page-break-before: always;
                            }
                        }
                    `}</style>

                    <div className="bg-white font-sans text-[13px] text-gray-900 leading-tight p-6">
                        <div className="max-w-[800px] mx-auto border border-gray-300 shadow-sm my-6 p-6">
                            {/* HEADER */}
                            <div
                                className="flex items-center gap-4 mb-3"
                                style={detailStyle(showTemplate)}
                            >
                                <div className="flex gap-2">
                                    <img
                                        src="/images/eep_logo.jpeg"
                                        alt="EEP Logo"
                                        className="h-36 w-auto object-contain"
                                    />
                                    <img
                                        src="/images/nmd_logo.png"
                                        alt="NMD logo"
                                        className="h-36 w-auto object-contain"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <h1 className="text-4xl font-bold text-black tracking-wide leading-tight">
                                        NAMARATNA
                                    </h1>
                                    <h2 className="text-xl font-semibold text-gray-800 leading-tight">
                                        Motor Distributors
                                    </h2>
                                    <p className="text-xs text-gray-600 mt-1">
                                        Direct importers and island-wide
                                        distributors for ESP shock absorbers
                                    </p>
                                </div>
                            </div>

                            <div
                                className="mb-2"
                                style={detailStyle(showTemplate)}
                            >
                                <p className="text-lg font-semibold text-gray-900">
                                    Tax Invoice
                                </p>
                            </div>

                            <div className="flex justify-between items-start border-b-2 border-pink-600 pb-2 mb-2">
                                <div className="mt-2 space-y-1 text-xs">
                                    <p
                                        style={detailStyle(
                                            showTemplate || showDetails,
                                        )}
                                    >
                                        <strong
                                            style={detailStyle(showTemplate)}
                                        >
                                            Invoice Number:
                                        </strong>{" "}
                                        <span style={detailStyle(showDetails)}>
                                            {invoice.billNumber ||
                                                "_____________________"}
                                        </span>
                                    </p>
                                    {totalPages > 1 && (
                                        <p style={detailStyle(showTemplate)}>
                                            <strong>Page:</strong>{" "}
                                            {pageIndex + 1} of {totalPages}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-2 space-y-1 text-xs">
                                    <p
                                        style={detailStyle(
                                            showTemplate || showDetails,
                                        )}
                                    >
                                        <strong
                                            style={detailStyle(showTemplate)}
                                        >
                                            Invoice Date:
                                        </strong>{" "}
                                        <span style={detailStyle(showDetails)}>
                                            {invoice.created_at.split("T")[0] ||
                                                "___________________________"}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* INVOICE TO / FROM */}
                            <div className="border-2 border-gray-400 flex mb-3 text-xs">
                                <div className="w-1/2 p-3 border-r-2 border-gray-400">
                                    <p
                                        className="font-semibold mb-2"
                                        style={detailStyle(showTemplate)}
                                    >
                                        Invoice To:
                                    </p>
                                    <p
                                        style={detailStyle(
                                            showTemplate || showDetails,
                                        )}
                                    >
                                        <span style={detailStyle(showTemplate)}>
                                            Client Name:
                                        </span>{" "}
                                        <span style={detailStyle(showDetails)}>
                                            {invoice.customer_name ||
                                                "__________________________"}
                                        </span>
                                    </p>
                                    <p
                                        style={detailStyle(
                                            showTemplate || showDetails,
                                        )}
                                    >
                                        <span style={detailStyle(showTemplate)}>
                                            Company:
                                        </span>{" "}
                                        <span style={detailStyle(showDetails)}>
                                            {invoice.company ||
                                                "_____________________________"}
                                        </span>
                                    </p>
                                    <p
                                        style={detailStyle(
                                            showTemplate || showDetails,
                                        )}
                                    >
                                        <span style={detailStyle(showTemplate)}>
                                            Phone No:
                                        </span>{" "}
                                        <span style={detailStyle(showDetails)}>
                                            {invoice.customer_contact ||
                                                "____________________________"}
                                        </span>
                                    </p>
                                    <p
                                        style={detailStyle(
                                            showTemplate || showDetails,
                                        )}
                                    >
                                        <span style={detailStyle(showTemplate)}>
                                            Email:
                                        </span>{" "}
                                        <span style={detailStyle(showDetails)}>
                                            {invoice.customer_email ||
                                                "_______________________________"}
                                        </span>
                                    </p>
                                    <p
                                        style={detailStyle(
                                            showTemplate || showDetails,
                                        )}
                                    >
                                        <span style={detailStyle(showTemplate)}>
                                            Address:
                                        </span>{" "}
                                        <span style={detailStyle(showDetails)}>
                                            {invoice.customer_address ||
                                                "_____________________________"}
                                        </span>
                                    </p>
                                    <p
                                        style={detailStyle(
                                            showTemplate || showDetails,
                                        )}
                                    >
                                        <span style={detailStyle(showTemplate)}>
                                            VAT No:
                                        </span>{" "}
                                        <span style={detailStyle(showDetails)}>
                                            {invoice.customer_vat_number ||
                                                "__________________________"}
                                        </span>
                                    </p>
                                </div>
                                <div
                                    className="w-1/2 p-3"
                                    style={detailStyle(showTemplate)}
                                >
                                    <p className="font-semibold mb-2">
                                        Invoice From:
                                    </p>
                                    <p>Namaratne Motor Distributors</p>
                                    <p>143/19B, Salawa Rd, Mirihana</p>
                                    <p>Tel: 0777756095</p>
                                    <p>Email: saleinfo.nmd@gmail.com</p>
                                    <p>
                                        VAT No:{" "}
                                        {vatNumber || "___________________"}
                                    </p>
                                </div>
                            </div>

                            {/* ITEMS TABLE */}
                            <table
                                className="w-full border-collapse text-xs mb-4"
                                style={detailStyle(showTemplate || showDetails)}
                            >
                                <thead style={detailStyle(showTemplate)}>
                                    <tr className="bg-pink-100 border border-gray-400 text-[12px]">
                                        <th className="border border-gray-400 p-1 text-left w-[20%]">
                                            ITEM CODE
                                        </th>
                                        <th className="border border-gray-400 p-1 text-left w-[35%]">
                                            ITEM NAME
                                        </th>
                                        <th className="border border-gray-400 p-1 text-right w-[15%]">
                                            UNIT PRICE
                                        </th>
                                        <th className="border border-gray-400 p-1 text-center w-[10%]">
                                            QTY
                                        </th>
                                        <th className="border border-gray-400 p-1 text-right w-[20%]">
                                            TOTAL
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(() => {
                                        const minRows = 5;
                                        const rows = [];

                                        pageItems.forEach((item, i) => {
                                            const price = convertPrice(
                                                item.salePrice,
                                            );
                                            const qty = item.quantity;
                                            const total = convertPrice(
                                                item.totalAmount,
                                            );
                                            rows.push(
                                                <tr key={i}>
                                                    <td
                                                        className="border border-gray-300 p-1"
                                                        style={detailStyle(
                                                            showTemplate,
                                                        )}
                                                    >
                                                        <span
                                                            style={detailStyle(
                                                                showDetails,
                                                            )}
                                                        >
                                                            {item.productCode ||
                                                                "-"}
                                                        </span>
                                                    </td>
                                                    <td
                                                        className="border border-gray-300 p-1"
                                                        style={detailStyle(
                                                            showTemplate,
                                                        )}
                                                    >
                                                        <span
                                                            style={detailStyle(
                                                                showDetails,
                                                            )}
                                                        >
                                                            {item.productName ||
                                                                "-"}
                                                        </span>
                                                    </td>
                                                    <td
                                                        className="border border-gray-300 p-1 text-right"
                                                        style={detailStyle(
                                                            showTemplate,
                                                        )}
                                                    >
                                                        <span
                                                            style={detailStyle(
                                                                showDetails,
                                                            )}
                                                        >
                                                            {formatCurrency(
                                                                price,
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td
                                                        className="border border-gray-300 p-1 text-center"
                                                        style={detailStyle(
                                                            showTemplate,
                                                        )}
                                                    >
                                                        <span
                                                            style={detailStyle(
                                                                showDetails,
                                                            )}
                                                        >
                                                            {qty}
                                                        </span>
                                                    </td>
                                                    <td
                                                        className="border border-gray-300 p-1 text-right"
                                                        style={detailStyle(
                                                            showTemplate,
                                                        )}
                                                    >
                                                        <span
                                                            style={detailStyle(
                                                                showDetails,
                                                            )}
                                                        >
                                                            {formatCurrency(
                                                                total,
                                                            )}
                                                        </span>
                                                    </td>
                                                </tr>,
                                            );
                                        });

                                        for (
                                            let i = pageItems.length;
                                            i < minRows;
                                            i++
                                        ) {
                                            rows.push(
                                                <tr key={`empty-${i}`}>
                                                    <td className="border border-gray-300 p-1">
                                                        &nbsp;
                                                    </td>
                                                    <td className="border border-gray-300 p-1">
                                                        &nbsp;
                                                    </td>
                                                    <td className="border border-gray-300 p-1">
                                                        &nbsp;
                                                    </td>
                                                    <td className="border border-gray-300 p-1">
                                                        &nbsp;
                                                    </td>
                                                    <td className="border border-gray-300 p-1">
                                                        &nbsp;
                                                    </td>
                                                </tr>,
                                            );
                                        }

                                        return rows;
                                    })()}

                                    {pageIndex === itemChunks.length - 1 && (
                                        <>
                                            <tr>
                                                <td
                                                    className="p-1"
                                                    colSpan={2}
                                                ></td>
                                                <td
                                                    className="border border-gray-300 p-1 font-medium text-left"
                                                    colSpan={2}
                                                    style={detailStyle(
                                                        showTemplate,
                                                    )}
                                                >
                                                    GOODS VALUE
                                                </td>
                                                <td
                                                    className="border border-gray-300 p-1 text-right"
                                                    style={detailStyle(
                                                        showTemplate,
                                                    )}
                                                >
                                                    <span
                                                        style={detailStyle(
                                                            showDetails,
                                                        )}
                                                    >
                                                        {formatCurrency(
                                                            convertPrice(
                                                                goodsValue,
                                                            ),
                                                        )}
                                                    </span>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td
                                                    className="p-1"
                                                    colSpan={2}
                                                ></td>
                                                <td
                                                    className="border border-gray-300 p-1 font-medium text-left"
                                                    colSpan={2}
                                                    style={detailStyle(
                                                        showTemplate,
                                                    )}
                                                >
                                                    DISCOUNT
                                                    {invoice.discount_category_name && (
                                                        <span className="font-normal text-xs">
                                                            {" "}
                                                            (
                                                            {
                                                                invoice.discount_category_name
                                                            }
                                                            )
                                                        </span>
                                                    )}
                                                </td>
                                                <td
                                                    className="border border-gray-300 p-1 text-right"
                                                    style={detailStyle(
                                                        showTemplate,
                                                    )}
                                                >
                                                    <span
                                                        style={detailStyle(
                                                            showDetails,
                                                        )}
                                                    >
                                                        -{" "}
                                                        {formatCurrency(
                                                            convertPrice(
                                                                discountValue,
                                                            ),
                                                        )}
                                                    </span>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td
                                                    className="p-1"
                                                    colSpan={2}
                                                ></td>
                                                <td
                                                    className="border border-gray-300 p-1 font-medium text-left"
                                                    colSpan={2}
                                                    style={detailStyle(
                                                        showTemplate,
                                                    )}
                                                >
                                                    TOTAL
                                                </td>
                                                <td
                                                    className="border border-gray-300 p-1 text-right"
                                                    style={detailStyle(
                                                        showTemplate,
                                                    )}
                                                >
                                                    <span
                                                        style={detailStyle(
                                                            showDetails,
                                                        )}
                                                    >
                                                        {formatCurrency(
                                                            convertPrice(
                                                                totalAfterDiscount,
                                                            ),
                                                        )}
                                                    </span>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td
                                                    className="p-1"
                                                    colSpan={2}
                                                ></td>
                                                <td
                                                    className="border border-gray-300 p-1 font-medium text-left"
                                                    colSpan={2}
                                                    style={detailStyle(
                                                        showTemplate,
                                                    )}
                                                >
                                                    VAT 18%
                                                </td>
                                                <td
                                                    className="border border-gray-300 p-1 text-right"
                                                    style={detailStyle(
                                                        showTemplate,
                                                    )}
                                                >
                                                    <span
                                                        style={detailStyle(
                                                            showDetails,
                                                        )}
                                                    >
                                                        {formatCurrency(
                                                            convertPrice(
                                                                vatAmount,
                                                            ),
                                                        )}
                                                    </span>
                                                </td>
                                            </tr>

                                            <tr className="font-bold">
                                                <td
                                                    className="p-1"
                                                    colSpan={2}
                                                ></td>
                                                <td
                                                    className="border border-gray-300 bg-pink-100 p-1 text-left"
                                                    colSpan={2}
                                                    style={detailStyle(
                                                        showTemplate,
                                                    )}
                                                >
                                                    GRAND TOTAL
                                                </td>
                                                <td
                                                    className="border border-gray-300 bg-pink-100 p-1 text-right"
                                                    style={detailStyle(
                                                        showTemplate,
                                                    )}
                                                >
                                                    <span
                                                        style={detailStyle(
                                                            showDetails,
                                                        )}
                                                    >
                                                        {formatCurrency(
                                                            convertPrice(
                                                                grandTotal,
                                                            ),
                                                        )}
                                                    </span>
                                                </td>
                                            </tr>
                                        </>
                                    )}
                                </tbody>
                            </table>

                            {pageIndex === itemChunks.length - 1 && (
                                <div
                                    className="border-t border-gray-300 pt-2 mt-2"
                                    style={detailStyle(showTemplate)}
                                >
                                    <p className="text-center text-xs italic">
                                        NOTE: All Cheques to be drawn in favour
                                        of <b>Namaratne Motor Distributors</b>{" "}
                                        and crossed 'Account Payee'
                                    </p>
                                </div>
                            )}

                            {pageIndex === itemChunks.length - 1 && (
                                <div
                                    className="flex justify-between mt-10 text-xs"
                                    style={detailStyle(showTemplate)}
                                >
                                    <div className="text-center">
                                        <div className="mb-2">
                                            ...........................................................
                                        </div>
                                        <p>Customer Signature</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="mb-2">
                                            ...........................................................
                                        </div>
                                        <p>NMD Representative Signature</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}
