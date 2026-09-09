import React from "react";
import { useAppSelector } from "@/store/hooks";
import {
  BarChart3,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  Truck,
  Download,
  ShieldAlert,
  MapPin,
  Building2,
  Calendar,
  Layers,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export default function RtoReportsView() {
  const rtoItems = useAppSelector((state) => state.adminRto.items);

  // Financial Metrics
  const totalRtoCount = rtoItems.length;
  const totalRtoValue = rtoItems.reduce((acc, curr) => acc + curr.orderValue, 0);
  const totalForwardFreight = rtoItems.reduce((acc, curr) => acc + curr.forwardFreight, 0);
  const totalReverseFreight = rtoItems.reduce((acc, curr) => acc + (curr.reverseFreight || 0), 0);
  const totalFreightLoss = totalForwardFreight + totalReverseFreight;

  // Fake attempt count & rate
  const fakeAttemptsCount = rtoItems.filter(
    (i) => i.verification.status === "Fake Attempt Confirmed" || i.verification.status === "Dispute Raised"
  ).length;
  const fakeAttemptRate = totalRtoCount > 0 ? ((fakeAttemptsCount / totalRtoCount) * 100).toFixed(1) : 0;

  // COD vs Prepaid Breakdown
  const codCount = rtoItems.filter((i) => i.paymentMode === "Cash on Delivery").length;
  const prepaidCount = rtoItems.filter((i) => i.paymentMode !== "Cash on Delivery").length;
  const codPercent = totalRtoCount > 0 ? Math.round((codCount / totalRtoCount) * 100) : 0;

  // Reason Breakdown
  const reasonMap = {};
  rtoItems.forEach((item) => {
    reasonMap[item.rtoReason] = (reasonMap[item.rtoReason] || 0) + 1;
  });

  const reasonList = Object.entries(reasonMap).map(([reason, count]) => ({
    reason,
    count,
    percentage: Math.round((count / totalRtoCount) * 100),
  }));

  // Courier Comparison Matrix
  const courierMatrix = [
    {
      name: "Delhivery Surface",
      totalHandled: 120,
      rtoCount: rtoItems.filter((i) => i.forwardCourier.includes("Delhivery")).length,
      rtoRate: "4.2%",
      fakeAttempts: 1,
      disputedAmount: "₹2,650",
      status: "Acceptable SLA",
      statusColor: "text-emerald-700 bg-emerald-50",
    },
    {
      name: "BlueDart Express",
      totalHandled: 95,
      rtoCount: rtoItems.filter((i) => i.forwardCourier.includes("BlueDart")).length,
      rtoRate: "3.1%",
      fakeAttempts: 1,
      disputedAmount: "₹2,200",
      status: "High Performance",
      statusColor: "text-blue-700 bg-blue-50",
    },
    {
      name: "Ekart Logistics",
      totalHandled: 80,
      rtoCount: rtoItems.filter((i) => i.forwardCourier.includes("Ekart")).length,
      rtoRate: "5.0%",
      fakeAttempts: 0,
      disputedAmount: "₹0",
      status: "Moderate",
      statusColor: "text-slate-700 bg-slate-100",
    },
    {
      name: "DTDC Express",
      totalHandled: 65,
      rtoCount: rtoItems.filter((i) => i.forwardCourier.includes("DTDC")).length,
      rtoRate: "6.1%",
      fakeAttempts: 0,
      disputedAmount: "₹0",
      status: "Review Required",
      statusColor: "text-amber-700 bg-amber-50",
    },
  ];

  // High RTO Pincode Watchlist
  const pincodeWatchlist = [
    { pincode: "800001", city: "Patna", state: "Bihar", rtoRate: "14.2%", recommendedAction: "Require 20% Prepaid Deposit" },
    { pincode: "208001", city: "Kanpur", state: "Uttar Pradesh", rtoRate: "11.8%", recommendedAction: "IVR Confirmation Before Dispatch" },
    { pincode: "141003", city: "Ludhiana", state: "Punjab", rtoRate: "8.5%", recommendedAction: "Alternate Contact Mandatory" },
    { pincode: "302013", city: "Jaipur", state: "Rajasthan", rtoRate: "6.9%", recommendedAction: "Standard COD Allowed" },
  ];

  const handleDownloadFullReport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        "Metric,Value",
        `Total RTO Shipments,${totalRtoCount}`,
        `Total Merchandise Value At Risk,Rs. ${totalRtoValue}`,
        `Two-way Freight Loss,Rs. ${totalFreightLoss}`,
        `Forward Freight Cost,Rs. ${totalForwardFreight}`,
        `Reverse Freight Cost,Rs. ${totalReverseFreight}`,
        `Fake NDR Attempt Rate,${fakeAttemptRate}%`,
        `COD RTO Share,${codPercent}%`,
        "",
        "Courier,RTO Count,RTO Rate,Fake Attempts,Disputed Freight",
        ...courierMatrix.map(
          (c) => `${c.name},${c.rtoCount},${c.rtoRate},${c.fakeAttempts},${c.disputedAmount}`
        ),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `apexmart_rto_performance_report_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Downloaded comprehensive RTO report");
  };

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-poppins font-black uppercase tracking-wider">
              Logistics Intelligence
            </span>
            <span className="text-xs text-slate-400 font-inter">Loss Mitigation & KPIs</span>
          </div>
          <h1 className="text-2xl font-poppins font-black text-slate-900 tracking-tight mt-1">
            RTO Performance & Cost Reports
          </h1>
          <p className="text-xs text-slate-500 font-inter mt-0.5">
            Evaluate reverse logistics financial impact, courier carrier SLA breaches, fake delivery attempt rates, and high-risk dispatch zones.
          </p>
        </div>

        <button
          onClick={handleDownloadFullReport}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-poppins font-bold text-slate-700 transition-colors shadow-2xs cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Download Audit CSV</span>
        </button>
      </div>

      {/* ── Primary KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Two-Way Freight Loss */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-poppins font-bold uppercase tracking-wider text-slate-400">
              Total Freight Loss
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-black text-rose-600">
            ₹{totalFreightLoss.toLocaleString("en-IN")}
          </p>
          <p className="text-[10px] text-slate-400 font-inter">
            Forward ₹{totalForwardFreight} + Reverse ₹{totalReverseFreight}
          </p>
        </div>

        {/* Total Inventory at Risk */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-poppins font-bold uppercase tracking-wider text-slate-400">
              Value in Reverse Transit
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-black text-slate-900">
            ₹{totalRtoValue.toLocaleString("en-IN")}
          </p>
          <p className="text-[10px] text-slate-400 font-inter">Across {totalRtoCount} shipments</p>
        </div>

        {/* Carrier Fake NDR Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-poppins font-bold uppercase tracking-wider text-slate-400">
              Courier Fake Attempt Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-black text-purple-700">{fakeAttemptRate}%</p>
          <p className="text-[10px] text-purple-600 font-medium font-inter">
            {fakeAttemptsCount} flagged for carrier recovery
          </p>
        </div>

        {/* COD vs Prepaid Share */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-poppins font-bold uppercase tracking-wider text-slate-400">
              COD RTO Proportion
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-accent flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-black text-accent">{codPercent}%</p>
          <p className="text-[10px] text-slate-400 font-inter">
            {codCount} COD orders vs {prepaidCount} Prepaid
          </p>
        </div>
      </div>

      {/* ── Mid Section: Reason Breakdown & Payment Ratio ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RTO Causes Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-poppins font-bold text-slate-900 text-sm">
              Primary Non-Delivery Causes
            </h3>
            <span className="text-xs text-slate-400 font-inter">{reasonList.length} categories</span>
          </div>

          <div className="space-y-3 font-inter">
            {reasonList.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{item.reason}</span>
                  <span className="text-slate-500 font-medium">
                    {item.count} orders ({item.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COD vs Prepaid Risk Comparison */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-poppins font-bold text-slate-900 text-sm mb-1">
              Payment Mode Risk Assessment
            </h3>
            <p className="text-xs text-slate-500 font-inter">
              Cash on Delivery shipments exhibit a significantly higher abandonment rate than prepaid wholesale transactions.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 font-inter">
            <div className="flex items-center justify-between">
              <span className="text-xs font-poppins font-bold text-slate-800">
                Cash on Delivery (COD)
              </span>
              <span className="text-xs font-poppins font-bold text-rose-600">{codPercent}%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-rose-500"
                style={{ width: `${codPercent}%` }}
              />
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${100 - codPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                COD ({codCount} orders)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Prepaid ({prepaidCount} orders)
              </span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 font-inter">
            Tip: Requiring a nominal 10-15% advance deposit on bulk COD orders above ₹25,000 reduces non-acceptance RTO by over 68%.
          </div>
        </div>
      </div>

      {/* ── Courier Partner Performance Matrix ── */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-poppins font-bold text-slate-900 text-sm">
              Courier Carrier Performance & Dispute Matrix
            </h3>
            <p className="text-xs text-slate-400 font-inter">
              Benchmarking delivery success rates and fake attempt dispute volumes.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-inter">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-poppins font-bold uppercase text-[10px]">
                <th className="p-3">Courier Partner</th>
                <th className="p-3 text-center">Dispatched</th>
                <th className="p-3 text-center">RTO Count</th>
                <th className="p-3 text-center">RTO Rate %</th>
                <th className="p-3 text-center">Fake Attempts</th>
                <th className="p-3 text-right">Disputed Freight</th>
                <th className="p-3 text-center">Carrier Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courierMatrix.map((carrier, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80">
                  <td className="p-3 font-poppins font-bold text-slate-900">{carrier.name}</td>
                  <td className="p-3 text-center text-slate-600">{carrier.totalHandled}</td>
                  <td className="p-3 text-center font-bold text-slate-800">{carrier.rtoCount}</td>
                  <td className="p-3 text-center font-bold text-rose-600">{carrier.rtoRate}</td>
                  <td className="p-3 text-center font-bold text-purple-700">{carrier.fakeAttempts}</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-800">{carrier.disputedAmount}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-poppins font-bold ${carrier.statusColor}`}>
                      {carrier.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── High-Risk Pincode Watchlist ── */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-poppins font-bold text-slate-900 text-sm">
              High-Risk Pincodes & Recommended Safeguards
            </h3>
            <p className="text-xs text-slate-400 font-inter">
              Geographic delivery zones requiring operational verification before release.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-inter">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-poppins font-bold uppercase text-[10px]">
                <th className="p-3">Pincode</th>
                <th className="p-3">Hub & State</th>
                <th className="p-3 text-center">Regional RTO Rate</th>
                <th className="p-3">Recommended System Safeguard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pincodeWatchlist.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80">
                  <td className="p-3 font-mono font-bold text-accent">{item.pincode}</td>
                  <td className="p-3 font-medium text-slate-800">
                    {item.city}, {item.state}
                  </td>
                  <td className="p-3 text-center font-bold text-rose-600">{item.rtoRate}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-[11px]">
                      {item.recommendedAction}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
