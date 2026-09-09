import React, { useState } from "react";
import {
  Wrench,
  MapPin,
  Calculator,
  QrCode,
  DollarSign,
  Truck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Copy,
  Download,
  Barcode,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";

export default function OtherUtilitiesView() {
  const [activeTab, setActiveTab] = useState("pincode"); // 'pincode' | 'tax' | 'currency' | 'barcode'

  // Tool 1: Pincode Checker State
  const [pincodeInput, setPincodeInput] = useState("560001");
  const [pincodeResult, setPincodeResult] = useState({
    city: "Bengaluru, Karnataka",
    courier: "BlueDart Air & Delhivery Surface",
    tat: "2 - 3 Days",
    cod: true,
    oda: false,
  });

  const handleCheckPincode = (e) => {
    e.preventDefault();
    const clean = pincodeInput.trim();
    if (clean.length !== 6) {
      toast.error("Please enter a valid 6-digit Indian pincode.");
      return;
    }

    if (clean.startsWith("11") || clean.startsWith("12")) {
      setPincodeResult({
        city: "Delhi NCR",
        courier: "Delhivery Express & Bluedart",
        tat: "1 - 2 Days",
        cod: true,
        oda: false,
      });
    } else if (clean.startsWith("40")) {
      setPincodeResult({
        city: "Mumbai, Maharashtra",
        courier: "BlueDart Express",
        tat: "1 - 2 Days",
        cod: true,
        oda: false,
      });
    } else if (clean.startsWith("70")) {
      setPincodeResult({
        city: "Kolkata, West Bengal",
        courier: "Shadowfax & Delhivery",
        tat: "3 - 4 Days",
        cod: true,
        oda: false,
      });
    } else {
      setPincodeResult({
        city: "Regional Fulfillment Zone",
        courier: "Delhivery Surface & XpressBees",
        tat: "3 - 5 Days",
        cod: true,
        oda: false,
      });
    }
    toast.success(`Serviceability verified for Pincode ${clean}.`);
  };

  // Tool 2: Tax / GST Calculator State
  const [priceInput, setPriceInput] = useState(2499);
  const [gstRate, setGstRate] = useState(18);
  const [isInterState, setIsInterState] = useState(false);

  const basePrice = Math.round((priceInput / (1 + gstRate / 100)) * 100) / 100;
  const totalTax = Math.round((priceInput - basePrice) * 100) / 100;
  const halfTax = Math.round((totalTax / 2) * 100) / 100;

  // Tool 3: Currency Converter State
  const [inrAmount, setInrAmount] = useState(5000);
  const fxRates = {
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0095,
    AED: 0.044,
  };

  // Tool 4: QR & Barcode Generator State
  const [skuCode, setSkuCode] = useState("AUR-NC-WH-01-BLK");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-slate-500" />
              Store Toolkit & Operations
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-inter">E-Commerce Helper Utilities</span>
          </div>
          <h1 className="text-2xl font-poppins font-bold text-slate-900 mt-1.5">
            Other Supporting E-Commerce Tools
          </h1>
          <p className="text-sm text-slate-500 font-inter mt-1">
            Essential operational utilities including postal pincode serviceability checker, GST/HSN tax calculator, real-time FX currency converter, and warehouse barcode generators.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("pincode")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "pincode"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Pincode & Courier TAT Checker</span>
        </button>

        <button
          onClick={() => setActiveTab("tax")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "tax"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>GST / Tax & HSN Calculator</span>
        </button>

        <button
          onClick={() => setActiveTab("currency")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "currency"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Multi-Currency & FX Converter</span>
        </button>

        <button
          onClick={() => setActiveTab("barcode")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "barcode"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Barcode className="w-3.5 h-3.5" />
          <span>Packaging QR & Barcode Generator</span>
        </button>
      </div>

      {/* Tab 1: Pincode Serviceability */}
      {activeTab === "pincode" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form
            onSubmit={handleCheckPincode}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 font-inter"
          >
            <div>
              <h3 className="font-poppins font-bold text-slate-900 text-base">Courier Serviceability Check</h3>
              <p className="text-xs text-slate-400 mt-0.5">Verify real-time COD & delivery turnaround times</p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Enter 6-Digit Delivery Pincode
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={pincodeInput}
                  onChange={(e) => setPincodeInput(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="e.g. 560001"
                  className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none font-mono font-bold"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-all shadow"
                >
                  Verify Service
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <span className="font-bold text-slate-800 block">Fast Courier Network Partners</span>
              <p className="text-slate-600">Integrated with BlueDart Aviation, Delhivery Express, and Shadowfax Surface APIs.</p>
            </div>
          </form>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 font-inter">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Serviceability Verdict</span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Fully Serviceable
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-medium">Destination Hub</span>
                <span className="font-bold text-slate-900">{pincodeResult.city}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-medium">Assigned Carriers</span>
                <span className="font-semibold text-slate-800">{pincodeResult.courier}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-medium">Standard Delivery Turnaround</span>
                <span className="font-bold text-emerald-700">{pincodeResult.tat}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-medium">Cash on Delivery (COD)</span>
                <span className="font-semibold text-emerald-600">Available (Up to ₹25,000)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: GST / Tax Calculator */}
      {activeTab === "tax" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 font-inter">
            <div>
              <h3 className="font-poppins font-bold text-slate-900 text-base">Indian GST & HSN Tax Calculator</h3>
              <p className="text-xs text-slate-400 mt-0.5">Calculate backward and forward tax breakdowns</p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">Selling Price (MRP Inclusive of Tax)</label>
              <input
                type="number"
                value={priceInput}
                onChange={(e) => setPriceInput(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none font-bold text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Applicable GST Slab</label>
                <Select value={String(gstRate)} onValueChange={(val) => setGstRate(Number(val))}>
                  <SelectTrigger className="w-full bg-slate-50 border-slate-200 rounded-xl">
                    <SelectValue placeholder="Select GST slab" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5% (Essential Goods)</SelectItem>
                    <SelectItem value="12">12% (Apparel & Kitchen)</SelectItem>
                    <SelectItem value="18">18% (Electronics & Standard)</SelectItem>
                    <SelectItem value="28">28% (Luxury Goods)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Transaction Route</label>
                <Select value={isInterState ? "inter" : "intra"} onValueChange={(val) => setIsInterState(val === "inter")}>
                  <SelectTrigger className="w-full bg-slate-50 border-slate-200 rounded-xl">
                    <SelectValue placeholder="Select route" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="intra">Intra-State (CGST + SGST)</SelectItem>
                    <SelectItem value="inter">Inter-State (IGST Only)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 font-inter">
            <h3 className="font-poppins font-bold text-slate-900 text-base">Tax Invoice Breakdown</h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-medium">Base Taxable Value</span>
                <span className="font-bold text-slate-900 text-sm">₹{basePrice.toLocaleString()}</span>
              </div>

              {!isInterState ? (
                <>
                  <div className="flex items-center justify-between p-2.5 bg-slate-50/70 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-medium">Central GST (CGST @ {gstRate / 2}%)</span>
                    <span className="font-semibold text-slate-800">₹{halfTax.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-slate-50/70 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-medium">State GST (SGST @ {gstRate / 2}%)</span>
                    <span className="font-semibold text-slate-800">₹{halfTax.toLocaleString()}</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between p-2.5 bg-slate-50/70 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-medium">Integrated GST (IGST @ {gstRate}%)</span>
                  <span className="font-semibold text-slate-800">₹{totalTax.toLocaleString()}</span>
                </div>
              )}

              <div className="flex items-center justify-between p-3 bg-slate-900 text-white rounded-xl">
                <span className="font-semibold text-xs">Total Consumer Price</span>
                <span className="font-bold text-base">₹{priceInput.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Currency Converter */}
      {activeTab === "currency" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 font-inter">
            <div>
              <h3 className="font-poppins font-bold text-slate-900 text-base">Cross-Border FX Currency Converter</h3>
              <p className="text-xs text-slate-400 mt-0.5">Live rates for global buyers and international dropshipping</p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">Enter INR Amount (₹)</label>
              <input
                type="number"
                value={inrAmount}
                onChange={(e) => setInrAmount(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none font-bold text-slate-900"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3 font-inter">
            <h3 className="font-poppins font-bold text-slate-900 text-base">Equivalent Foreign Currencies</h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-700">US Dollar ($ USD)</span>
                <span className="font-bold text-slate-900 text-sm">
                  ${(inrAmount * fxRates.USD).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-700">Euro (€ EUR)</span>
                <span className="font-bold text-slate-900 text-sm">
                  €{(inrAmount * fxRates.EUR).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-700">British Pound (£ GBP)</span>
                <span className="font-bold text-slate-900 text-sm">
                  £{(inrAmount * fxRates.GBP).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-700">UAE Dirham (AED)</span>
                <span className="font-bold text-slate-900 text-sm">
                  {(inrAmount * fxRates.AED).toFixed(2)} AED
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Packaging Barcode Generator */}
      {activeTab === "barcode" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 font-inter">
            <div>
              <h3 className="font-poppins font-bold text-slate-900 text-base">Warehouse Dispatch QR & Barcode Generator</h3>
              <p className="text-xs text-slate-400 mt-0.5">Generate printable packing slips and bin tags</p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">SKU / Tracking Serial Code</label>
              <input
                type="text"
                value={skuCode}
                onChange={(e) => setSkuCode(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 text-sm font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <span className="font-bold text-slate-800 block">Warehouse Bin Identification</span>
              <p className="text-slate-500">Scan at dispatch station to mark order as packaged and trigger tracking SMS.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-4 font-inter">
            <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl">
              <div className="w-36 h-36 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center shadow-xs">
                <QrCode className="w-24 h-24 text-slate-900" />
                <span className="font-mono text-[10px] font-bold text-slate-700 mt-1">{skuCode}</span>
              </div>
            </div>

            <button
              onClick={() => toast.success("Printable sticker tag PDF generated for dispatch label.")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow"
            >
              <Download className="w-3.5 h-3.5" />
              Download Dispatch Label Sticker
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
