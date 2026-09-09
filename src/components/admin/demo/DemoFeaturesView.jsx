import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  runAntiRtoSimulation,
  runCourierAllocationSimulation,
  runMultiTierPricingSimulation,
} from "@/store/slices/adminDemoSlice";
import {
  Cpu,
  ShieldCheck,
  Truck,
  Sparkles,
  ShoppingBag,
  MessageSquare,
  Boxes,
  Award,
  LifeBuoy,
  Zap,
  Play,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Send,
  Calculator,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function DemoFeaturesView() {
  const dispatch = useAppDispatch();
  const sandboxes = useAppSelector((state) => state.adminDemo?.sandboxes);

  // Sandbox 1: Anti-RTO State
  const [antiRtoPincode, setAntiRtoPincode] = useState("400050");
  const [antiRtoPayment, setAntiRtoPayment] = useState("COD");
  const [antiRtoCartValue, setAntiRtoCartValue] = useState("2499");

  // Sandbox 2: Courier Routing State
  const [courierWeight, setCourierWeight] = useState("1.5");
  const [courierDestination, setCourierDestination] = useState("Karnataka");

  // Sandbox 3: Margin Calculator State
  const [calculatorMrp, setCalculatorMrp] = useState(2999);

  // Sandbox 4: WhatsApp Blast State
  const [whatsappTemplate, setWhatsappTemplate] = useState("cart_recovery");
  const [testPhoneNumber, setTestPhoneNumber] = useState("+91 98201 12345");

  const handleRunAntiRto = (e) => {
    e.preventDefault();
    dispatch(runAntiRtoSimulation({
      pincode: antiRtoPincode,
      paymentType: antiRtoPayment,
      cartValue: antiRtoCartValue,
    }));
    toast.success("Anti-RTO Risk Evaluation Engine executed.");
  };

  const handleRunCourierCompare = (e) => {
    e.preventDefault();
    dispatch(runCourierAllocationSimulation({
      weight: courierWeight,
      destinationPincode: courierDestination,
    }));
    toast.success("Courier rates & SLAs recalculated across 3 carrier APIs.");
  };

  const handleRunMarginCalc = (val) => {
    const num = Number(val) || 0;
    setCalculatorMrp(num);
    dispatch(runMultiTierPricingSimulation(num));
  };

  const handleTestWhatsAppBroadcast = () => {
    toast.success(`⚡ Simulated WhatsApp broadcast dispatched to ${testPhoneNumber}!`);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-poppins font-black text-slate-900 tracking-tight">
                  System Architecture & Feature Demonstration
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-amber-100 text-amber-800 border border-amber-200">
                  Interactive Lab
                </span>
              </div>
              <p className="text-xs text-slate-500 font-inter mt-0.5">
                Explore the core engineering capabilities powering retail storefronts, B2B wholesale portals, dropshipping hubs, and franchise fleets.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Flagship Features Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-poppins font-bold text-slate-900 uppercase tracking-wider">
            Flagship Enterprise Capabilities
          </h2>
          <span className="text-xs text-slate-400 font-inter">
            Integrated end-to-end without third-party plugin bloat
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 w-fit">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-poppins font-bold text-slate-900 mt-3">
                Omnichannel Selling Engine
              </h3>
              <p className="text-[11px] text-slate-500 font-inter mt-1 leading-relaxed">
                Single unified catalog with dynamic price tiers for B2C Retail, B2B Wholesale bulk slabs, Dropship reseller pricing, and Franchise payouts.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-[11px] font-semibold text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Multi-Persona Ready
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 w-fit">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-poppins font-bold text-slate-900 mt-3">
                AI Anti-RTO & Fraud Shield
              </h3>
              <p className="text-[11px] text-slate-500 font-inter mt-1 leading-relaxed">
                Automated risk assessment analyzing buyer order history, pincode deliverability, and mandatory WhatsApp OTP for high-risk COD orders.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-[11px] font-semibold text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> 97.8% Delivery Success
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 w-fit">
                <Truck className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-poppins font-bold text-slate-900 mt-3">
                Smart Courier Allocation
              </h3>
              <p className="text-[11px] text-slate-500 font-inter mt-1 leading-relaxed">
                Dynamic least-cost routing engine comparing Delhivery, Shiprocket, and BlueDart in real time with instant thermal shipping label generation.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-[11px] font-semibold text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Automated AWB Dispatch
            </div>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 w-fit">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-poppins font-bold text-slate-900 mt-3">
                WhatsApp & Push Automation
              </h3>
              <p className="text-[11px] text-slate-500 font-inter mt-1 leading-relaxed">
                Event-triggered transactional alerts (dispatched, out for delivery, COD OTP) plus automated abandoned cart recovery with conversion tracking.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-[11px] font-semibold text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> High Engagement Rate
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Sandboxes Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-sm font-poppins font-bold text-slate-900 uppercase tracking-wider">
            Live Interactive Feature Sandboxes
          </h2>
          <p className="text-xs text-slate-400 font-inter mt-0.5">
            Test and experience how the platform algorithms behave in real-world scenarios.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sandbox 1: Anti-RTO Risk Evaluator */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-poppins font-bold text-slate-900">
                    Sandbox 1: Anti-RTO Risk Assessment
                  </h3>
                  <p className="text-[11px] text-slate-400 font-inter">
                    Simulate customer checkout risk evaluation
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 text-[10px] font-bold">
                Live Algorithm
              </span>
            </div>

            <form onSubmit={handleRunAntiRto} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Delivery PIN Code
                  </label>
                  <input
                    type="text"
                    value={antiRtoPincode}
                    onChange={(e) => setAntiRtoPincode(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono text-xs focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Payment Method
                  </label>
                  <select
                    value={antiRtoPayment}
                    onChange={(e) => setAntiRtoPayment(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-accent"
                  >
                    <option value="COD">Cash on Delivery</option>
                    <option value="Prepaid">Prepaid (UPI / Card)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Cart Value (₹)
                  </label>
                  <input
                    type="number"
                    value={antiRtoCartValue}
                    onChange={(e) => setAntiRtoCartValue(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-slate-900 text-white font-poppins font-bold text-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Evaluate Risk & Fraud Confidence</span>
              </button>
            </form>

            {/* Sandbox Result Output */}
            {sandboxes?.antiRtoResult && (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-poppins font-bold text-slate-700">
                    Evaluation Result ({sandboxes.antiRtoResult.city}):
                  </span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full font-poppins font-bold text-[10px]",
                      sandboxes.antiRtoResult.riskScore > 75
                        ? "bg-emerald-100 text-emerald-800"
                        : sandboxes.antiRtoResult.riskScore > 50
                        ? "bg-amber-100 text-amber-800"
                        : "bg-rose-100 text-rose-800"
                    )}
                  >
                    {sandboxes.antiRtoResult.riskLevel} ({sandboxes.antiRtoResult.riskScore}/100)
                  </span>
                </div>
                <p className="text-slate-600 font-inter text-[11px] leading-relaxed">
                  <strong>Recommendation:</strong> {sandboxes.antiRtoResult.recommendation}
                </p>
              </div>
            )}
          </div>

          {/* Sandbox 2: Smart Courier Allocation */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-poppins font-bold text-slate-900">
                    Sandbox 2: Smart Courier Rate Router
                  </h3>
                  <p className="text-[11px] text-slate-400 font-inter">
                    Simulate fastest vs cheapest carrier calculation
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                API Rate Matrix
              </span>
            </div>

            <form onSubmit={handleRunCourierCompare} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Shipment Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={courierWeight}
                    onChange={(e) => setCourierWeight(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Destination Zone / State
                  </label>
                  <select
                    value={courierDestination}
                    onChange={(e) => setCourierDestination(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-accent"
                  >
                    <option value="Karnataka">Karnataka (Zone C)</option>
                    <option value="Maharashtra">Maharashtra (Zone A - Local)</option>
                    <option value="Delhi NCR">Delhi NCR (Zone B)</option>
                    <option value="North East">North East (Zone E)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-slate-900 text-white font-poppins font-bold text-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Compare Courier Rates & ETAs</span>
              </button>
            </form>

            {/* Carrier Table Output */}
            <div className="space-y-1.5">
              {sandboxes?.courierComparison?.map((carrier) => (
                <div
                  key={carrier.name}
                  className={cn(
                    "p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors",
                    carrier.recommended
                      ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                      : "bg-slate-50 border-slate-100 text-slate-700"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-poppins font-bold">{carrier.name}</span>
                    {carrier.recommended && (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-200/80 text-emerald-800 text-[9px] font-extrabold uppercase">
                        Recommended
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-500 font-inter">{carrier.eta}</span>
                    <span className="font-poppins font-black text-slate-900">₹{carrier.rate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sandbox 3: Multi-Tier Pricing Engine Calculator */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-poppins font-bold text-slate-900">
                    Sandbox 3: Dynamic Multi-Tier Pricing Calculator
                  </h3>
                  <p className="text-[11px] text-slate-400 font-inter">
                    Enter any MRP to see automated tier price derivation
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">
                Margin Engine
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Product Retail MRP (₹)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={calculatorMrp}
                    onChange={(e) => handleRunMarginCalc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-poppins font-bold text-sm focus:outline-none focus:border-accent"
                  />
                  <button
                    onClick={() => handleRunMarginCalc(4999)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer whitespace-nowrap"
                  >
                    Set ₹4,999
                  </button>
                </div>
              </div>

              {/* Calculated Results */}
              {sandboxes?.marginCalculator && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-inter">B2B Wholesale Price</span>
                    <span className="font-poppins font-black text-indigo-700 text-sm">
                      ₹{sandboxes.marginCalculator.wholesalePrice}
                    </span>
                    <span className="text-[10px] text-indigo-500 font-semibold block">
                      Margin: {sandboxes.marginCalculator.wholesaleMargin}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-inter">Dropship Procurement Cost</span>
                    <span className="font-poppins font-black text-amber-700 text-sm">
                      ₹{sandboxes.marginCalculator.dropshipPrice}
                    </span>
                    <span className="text-[10px] text-amber-600 font-semibold block">
                      Reseller Profit: ₹{sandboxes.marginCalculator.dropshipProfit}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-inter">Franchise Outlet Commission</span>
                    <span className="font-poppins font-black text-emerald-700 text-sm">
                      +₹{sandboxes.marginCalculator.franchisePayout}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold block">
                      Per physical/digital unit sold
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-inter">Gross Platform Profit</span>
                    <span className="font-poppins font-black text-slate-900 text-sm">
                      ₹{sandboxes.marginCalculator.retailProfit}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold block">
                      Net of production cost
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sandbox 4: WhatsApp Automation Blast Simulator */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-poppins font-bold text-slate-900">
                    Sandbox 4: WhatsApp Automation Simulator
                  </h3>
                  <p className="text-[11px] text-slate-400 font-inter">
                    Simulate customer notification and recovery templates
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                Cloud API
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Event Trigger
                  </label>
                  <select
                    value={whatsappTemplate}
                    onChange={(e) => setWhatsappTemplate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-accent"
                  >
                    <option value="cart_recovery">Abandoned Cart Recovery</option>
                    <option value="cod_otp">COD Verification OTP</option>
                    <option value="dispatch">Dispatched with Live AWB</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Test Customer Mobile
                  </label>
                  <input
                    type="text"
                    value={testPhoneNumber}
                    onChange={(e) => setTestPhoneNumber(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Message Preview Bubble */}
              <div className="bg-emerald-50/50 rounded-xl p-3.5 border border-emerald-100 text-slate-800 text-xs font-inter relative">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                  Meta Verified Template Preview
                </span>
                <p className="leading-relaxed">
                  {whatsappTemplate === "cart_recovery"
                    ? "Hi Priya! 👋 We noticed you left your Apex Wireless Headphones in your cart. Complete your order today and get an extra 10% OFF with code DEMO10: https://store.demo/cart"
                    : whatsappTemplate === "cod_otp"
                    ? "Your OTP to confirm Cash on Delivery order #ORD-DEMO-802 is 849201. Valid for 10 minutes. Click to confirm: https://store.demo/otp/849201"
                    : "Great news! 🚚 Your order #ORD-DEMO-801 has been dispatched via Delhivery (AWB: DLH-99210488). Live track here: https://track.demo/dlh"}
                </p>
              </div>

              <button
                onClick={handleTestWhatsAppBroadcast}
                className="w-full py-2 rounded-xl bg-emerald-600 text-white font-poppins font-bold text-xs hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Simulate Dispatch to Customer Mobile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
