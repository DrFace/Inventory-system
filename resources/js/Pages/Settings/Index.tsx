import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { toast } from "react-toastify";

interface CurrencyRate {
  id: number;
  from_currency: string;
  to_currency: string;
  rate: string;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
  updated_by_user?: {
    name: string;
  };
}

interface Props {
  vatNumber: string;
  currencyRate: CurrencyRate;
  defaultPrintMode: "full" | "details";
}

export default function SettingsIndex() {
  const { vatNumber: initialVatNumber, currencyRate, defaultPrintMode: initialPrintMode } = usePage().props as unknown as Props;
  const [vatNumber, setVatNumber] = useState(initialVatNumber || "");
  const [exchangeRate, setExchangeRate] = useState(currencyRate?.rate || "320.00");
  const [defaultPrintMode, setDefaultPrintMode] = useState<"full" | "details">(initialPrintMode || "details");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    router.post(
      route("settings.update"),
      {
        vat_number: vatNumber,
        exchange_rate: exchangeRate,
        default_print_mode: defaultPrintMode,
      },
      {
        onSuccess: () => {
          toast.success("Settings updated successfully!");
          setIsSaving(false);
        },
        onError: (errors) => {
          toast.error("Error updating settings");
          setIsSaving(false);
        },
      }
    );
  };

  return (
    <Authenticated>
      <div className="flex-1 p-6">
        <div className="max-w-4xl">
          <h2 className="text-2xl font-bold mb-6">Company Settings</h2>

          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit}>
              {/* VAT Number Section */}
              <div className="mb-6">
                <label
                  htmlFor="vatNumber"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Company VAT Number
                </label>
                <input
                  type="text"
                  id="vatNumber"
                  value={vatNumber}
                  onChange={(e) => setVatNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter VAT registration number"
                />
                <p className="mt-2 text-sm text-gray-500">
                  This VAT number will be displayed on all invoices in the "Invoice From" section.
                </p>
              </div>

              {/* Currency Exchange Rate Section */}
              <div className="mb-6 pt-6 border-t border-gray-200">
                <label
                  htmlFor="exchangeRate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Currency Exchange Rate
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">1 USD =</span>
                  <input
                    type="number"
                    id="exchangeRate"
                    step="0.01"
                    min="0.01"
                    value={exchangeRate}
                    onChange={(e) => setExchangeRate(e.target.value)}
                    className="flex-1 max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="320.00"
                  />
                  <span className="text-gray-700">LKR</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  This rate will be used when entering product prices in USD and displaying invoices in different currencies.
                </p>
                {currencyRate?.updated_at && (
                  <p className="mt-2 text-xs text-gray-400">
                    Last updated: {new Date(currencyRate.updated_at).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Default Print Mode Section */}
              <div className="mb-6 pt-6 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Default Invoice Printing Mode
                </label>
                <div className="flex p-1 bg-gray-100 rounded-xl border w-fit">
                  <button
                    type="button"
                    onClick={() => setDefaultPrintMode("details")}
                    className={`px-6 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${defaultPrintMode === "details"
                        ? "text-blue-600 bg-white shadow-md scale-105"
                        : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    Details Only
                  </button>
                  <button
                    type="button"
                    onClick={() => setDefaultPrintMode("full")}
                    className={`px-6 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${defaultPrintMode === "full"
                        ? "text-blue-600 bg-white shadow-md scale-105"
                        : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    Full Invoice
                  </button>
                </div>
                <p className="mt-3 text-sm text-gray-500">
                  Choose which mode should be selected by default on the Billing and Invoice View pages.
                </p>
              </div>

              {/* Invoice Template Section */}
              <div className="mb-6 pt-6 border-t border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Invoice Template
                    </label>
                    <p className="text-sm text-gray-500">
                      Download or print the background template to use with "Details Only" printing mode.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      window.open(route("billing.invoice", { id: "template", mode: "template", download: "1" }), "_blank");
                    }}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-green-700 border-2 border-green-600 rounded-xl hover:bg-green-50 transition-all font-bold shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Template
                  </button>
                </div>
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-yellow-700">
                    <b>Tip:</b> If you have pre-printed letterheads or stationery, you can use the "Details Only" mode in Billing to print only the data. Otherwise, print this template first or use "Full Invoice" mode.
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${isSaving
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md"
                    }`}
                >
                  {isSaving ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Authenticated>
  );
}
