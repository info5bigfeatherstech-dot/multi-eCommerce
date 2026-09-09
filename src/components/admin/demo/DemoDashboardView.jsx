import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setDemoMode,
  simulateIncomingOrder,
  resetDemoData,
} from "@/store/slices/adminDemoSlice";
import {
  Sparkles,
  TrendingUp,
  ShoppingBag,
  Store,
  Truck,
  Users,
  ShieldCheck,
  Zap,
  Download,
  RotateCcw,
  ArrowUpRight,
  Clock,
  Layers,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function DemoDashboardView() {
  const dispatch = useAppDispatch();
  const activeMode = useAppSelector((state) => state.adminDemo?.activeMode || "unified");
  const metrics = useAppSelector((state) => state.adminDemo?.metrics);
  const sampleOrders = useAppSelector((state) => state.adminDemo?.sampleOrders || []);
  const sampleProducts = useAppSelector((state) => state.adminDemo?.sampleProducts || []);

  const [isSimulating, setIsSimulating] = useState(false);

  const personas = [
    { id: "unified", label: "Unified Enterprise", desc: "All sales channels aggregated" },
    { id: "retail", label: "Retail B2C", desc: "Direct consumer storefront" },
    { id: "wholesale", label: "Wholesale B2B", desc: "Bulk tiered buyers & credit lines" },
    { id: "dropshipping", label: "Dropshipping Hub", desc: "Automated reseller network" },
    { id: "franchise", label: "Franchise Fleet", desc: "Digital & physical retail outlets" },
  ];

  const handleSimulateOrder = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const randomCustomers = [
        { name: "Rohit Deshmukh", city: "Pune", amount: 4999, channel: "Retail (Prepaid)" },
        { name: "Global Electronics Mart", city: "Ahmedabad", amount: 82500, channel: "B2B Wholesale" },
        { name: "FashionForward Dropship", city: "Surat", amount: 6750, channel: "Dropshipping" },
        { name: "Franchise Store #12 - Powai", city: "Mumbai", amount: 42000, channel: "Physical Franchise" },
      ];
      const selected = randomCustomers[Math.floor(Math.random() * randomCustomers.length)];
      dispatch(simulateIncomingOrder({
        customer: selected.name,
        totalAmount: selected.amount,
        channel: selected.channel,
      }));
      setIsSimulating(false);
      toast.success(`⚡ Live Order Simulated: ₹${selected.amount.toLocaleString()} from ${selected.name} (${selected.channel})`);
    }, 600);
  };

  const handleResetDemo = () => {
    dispatch(resetDemoData());
    toast.info("Demo metrics and orders reset to factory defaults.");
  };

  const handleExportReport = () => {
    const csvContent = [
      ["Metric", "Value", "Benchmark"].join(","),
      ["Gross Merchandise Value (GMV)", `₹${metrics?.totalRevenue?.toLocaleString()}`, "Ahead of Target"],
      ["Total Processed Orders", metrics?.totalOrders, "Growing +18% MoM"],
      ["Retail Share", `${metrics?.retailShare}%`, "B2C Consumer"],
      ["Wholesale B2B Share", `${metrics?.wholesaleShare}%`, "High Margin Volume"],
      ["Dropshipping Share", `${metrics?.dropshipShare}%`, "Zero Inventory Cost"],
      ["Franchise Share", `${metrics?.franchiseShare}%`, "Fast Offline Expansion"],
      ["Active Franchise Stores", metrics?.activeFranchiseOutlets, "48 Outlets Live"],
      ["Active Wholesale Accounts", metrics?.activeWholesaleBuyers, "Verified GSTIN"],
      ["Active Dropshippers", metrics?.activeDropshippers, "API Synced"],
      ["Anti-RTO Protection Rate", `${metrics?.antiRtoProtectionRate}%`, "Top Industry Standard"],
      ["Average Fulfillment SLA", `${metrics?.avgFulfillmentHours} Hours`, "Same-Day Dispatch"],
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `demo_enterprise_performance_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Demo executive summary downloaded.");
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-poppins font-black text-slate-900 tracking-tight">
                  Interactive Demo Showcase
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-100 text-amber-800 border border-amber-200">
                  Live Sandbox
                </span>
              </div>
              <p className="text-xs text-slate-500 font-inter mt-0.5">
                Experience the multi-eCommerce engine with live workflow simulations, persona switching, and performance metrics.
              </p>
            </div>
          </div>
        </div>

        {/* Global Demo Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSimulateOrder}
            disabled={isSimulating}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-accent text-white text-xs font-poppins font-bold shadow-xs hover:bg-accent/90 transition-all cursor-pointer disabled:opacity-50"
          >
            <Zap className={cn("w-3.5 h-3.5", isSimulating && "animate-spin")} />
            <span>{isSimulating ? "Simulating..." : "Simulate Incoming Order"}</span>
          </button>

          <button
            onClick={handleExportReport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-poppins font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Demo Report</span>
          </button>

          <button
            onClick={handleResetDemo}
            title="Reset to initial demo data"
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Persona Mode Switcher Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {personas.map((persona) => {
            const isSelected = activeMode === persona.id;
            return (
              <button
                key={persona.id}
                onClick={() => {
                  dispatch(setDemoMode(persona.id));
                  toast.info(`Switched demo view to: ${persona.label}`);
                }}
                className={cn(
                  "text-left p-3 rounded-xl transition-all cursor-pointer border",
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-white text-slate-700 border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-poppins font-bold tracking-tight">
                    {persona.label}
                  </span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                </div>
                <p className={cn("text-[11px] font-inter mt-0.5 truncate", isSelected ? "text-slate-300" : "text-slate-400")}>
                  {persona.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top 4 High-Impact KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-poppins font-bold text-slate-500 uppercase tracking-wider">
              {activeMode === "wholesale"
                ? "Wholesale GMV"
                : activeMode === "dropshipping"
                ? "Dropship GMV"
                : activeMode === "franchise"
                ? "Franchise GMV"
                : "Total Platform GMV"}
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-poppins font-black text-slate-900 tracking-tight">
              ₹
              {activeMode === "wholesale"
                ? Math.round((metrics?.totalRevenue || 0) * 0.31).toLocaleString()
                : activeMode === "dropshipping"
                ? Math.round((metrics?.totalRevenue || 0) * 0.15).toLocaleString()
                : activeMode === "franchise"
                ? Math.round((metrics?.totalRevenue || 0) * 0.12).toLocaleString()
                : (metrics?.totalRevenue || 0).toLocaleString()}
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +24.8%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-inter mt-1">
            Simulated annualized gross merchandise volume
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-poppins font-bold text-slate-500 uppercase tracking-wider">
              Total Processed Orders
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-poppins font-black text-slate-900 tracking-tight">
              {(metrics?.totalOrders || 0).toLocaleString()}
            </span>
            <span className="text-[11px] font-semibold text-indigo-600 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +18.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-inter mt-1">
            Across online, B2B wholesale, dropship & stores
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-poppins font-bold text-slate-500 uppercase tracking-wider">
              Active Network Partners
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-poppins font-black text-slate-900 tracking-tight">
              {(
                (metrics?.activeWholesaleBuyers || 0) +
                (metrics?.activeDropshippers || 0) +
                (metrics?.activeFranchiseOutlets || 0)
              ).toLocaleString()}
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
              B2B Fleet
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-inter mt-1">
            {metrics?.activeFranchiseOutlets} Outlets • {metrics?.activeWholesaleBuyers} B2B • {metrics?.activeDropshippers} Resellers
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-poppins font-bold text-slate-500 uppercase tracking-wider">
              Anti-RTO Protection
            </span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600 border border-teal-100">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-poppins font-black text-slate-900 tracking-tight">
              {metrics?.antiRtoProtectionRate}%
            </span>
            <span className="text-[11px] font-semibold text-teal-600 flex items-center">
              <CheckCircle2 className="w-3 h-3 mr-0.5" /> High Delivery Success
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-inter mt-1">
            Automated OTP, pincode risk filter & courier routing
          </p>
        </div>
      </div>

      {/* Channel Distribution & Quick Feature Launchpad */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Channel Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-poppins font-bold text-slate-900">
                Revenue by Sales Channel
              </h2>
              <p className="text-[11px] text-slate-400 font-inter">
                Multi-channel contribution breakdown
              </p>
            </div>
            <span className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
              <Layers className="w-4 h-4" />
            </span>
          </div>

          <div className="space-y-3.5">
            {/* Retail */}
            <div>
              <div className="flex items-center justify-between text-xs font-poppins font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  Retail Storefront (B2C)
                </span>
                <span>{metrics?.retailShare}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${metrics?.retailShare}%` }} />
              </div>
            </div>

            {/* Wholesale */}
            <div>
              <div className="flex items-center justify-between text-xs font-poppins font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                  B2B Wholesale Accounts
                </span>
                <span>{metrics?.wholesaleShare}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${metrics?.wholesaleShare}%` }} />
              </div>
            </div>

            {/* Dropshipping */}
            <div>
              <div className="flex items-center justify-between text-xs font-poppins font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Dropshipping Network
                </span>
                <span>{metrics?.dropshipShare}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${metrics?.dropshipShare}%` }} />
              </div>
            </div>

            {/* Franchise */}
            <div>
              <div className="flex items-center justify-between text-xs font-poppins font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Physical & Virtual Franchises
                </span>
                <span>{metrics?.franchiseShare}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${metrics?.franchiseShare}%` }} />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Dispatch Speed</span>
            <span className="font-poppins font-bold text-slate-800 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-accent" />
              {metrics?.avgFulfillmentHours} Hours Avg SLA
            </span>
          </div>
        </div>

        {/* Demo Sub-Module Jump Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/admin/demo/products"
            className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-accent hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600 w-fit group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-poppins font-bold text-slate-900 mt-4 group-hover:text-accent transition-colors">
                Demo Products Showcase
              </h3>
              <p className="text-xs text-slate-500 font-inter mt-1 leading-relaxed">
                Explore multi-tier pricing matrices for Retail, B2B wholesale slabs, dropshipper costs, and franchise profits.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-poppins font-bold text-accent">
              <span>View Sample Catalog</span>
              <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            to="/admin/demo/orders"
            className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-accent hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 w-fit group-hover:scale-105 transition-transform">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-poppins font-bold text-slate-900 mt-4 group-hover:text-accent transition-colors">
                Order Workflow Simulator
              </h3>
              <p className="text-xs text-slate-500 font-inter mt-1 leading-relaxed">
                Step-by-step lifecycle simulator: Placed → Verified → Courier Assigned → Packing → Transit → Delivered.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-poppins font-bold text-accent">
              <span>Test Order Lifecycle</span>
              <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            to="/admin/demo/features"
            className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-accent hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="p-3 rounded-xl bg-amber-50 text-amber-600 w-fit group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-poppins font-bold text-slate-900 mt-4 group-hover:text-accent transition-colors">
                Live Feature Sandboxes
              </h3>
              <p className="text-xs text-slate-500 font-inter mt-1 leading-relaxed">
                Hands-on sandboxes to test Anti-RTO risk calculation, live courier rate comparison, and WhatsApp broadcast blasts.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-poppins font-bold text-accent">
              <span>Open Sandboxes</span>
              <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Real-Time Simulated Orders Stream */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <h2 className="text-sm font-poppins font-bold text-slate-900">
                Live Simulated Activity Stream
              </h2>
              <p className="text-[11px] text-slate-500 font-inter">
                Demonstrating real-time transactions across wholesale, dropshipping, and retail
              </p>
            </div>
          </div>
          <Link
            to="/admin/demo/orders"
            className="text-xs font-poppins font-bold text-accent hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Manage All Demo Orders ({sampleOrders.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {sampleOrders.slice(0, 4).map((order) => (
            <div key={order.id} className="p-4 sm:px-6 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 font-poppins font-bold text-xs">
                  {order.id.replace("ORD-DEMO-", "#")}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-poppins font-bold text-slate-900">
                      {order.customer}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {order.channel}
                    </span>
                    <span className="text-[11px] text-slate-400 font-inter">
                      • {order.orderDate}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-inter mt-0.5">
                    {order.itemsCount} item(s) • {order.items[0]?.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="text-right">
                  <p className="text-xs font-poppins font-black text-slate-900">
                    ₹{order.totalAmount.toLocaleString()}
                  </p>
                  <p className="text-[10px] font-medium text-slate-400 font-inter">
                    {order.paymentMethod}
                  </p>
                </div>

                <span
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[11px] font-poppins font-bold whitespace-nowrap",
                    order.stage === "Delivered"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : order.stage === "In Transit"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : order.stage === "Courier Assigned"
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  )}
                >
                  {order.stage}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
