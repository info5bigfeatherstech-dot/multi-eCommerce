import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { processRefund } from "@/store/slices/adminReturnsSlice";
import {
  CreditCard,
  Search,
  CheckCircle2,
  Clock,
  Send,
  Download,
  Receipt,
  FileCheck2,
  X,
  Building2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Printer,
  Sparkles,
} from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "sonner";

export default function RefundsView() {
  const dispatch = useAppDispatch();
  const returnsList = useAppSelector((state) => state.adminReturns.items);

  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [payoutModalReturn, setPayoutModalReturn] = useState(null);
  const [payoutMethod, setPayoutMethod] = useState("Instant UPI Payout");
  const [customUtr, setCustomUtr] = useState("");
  const [receiptReturn, setReceiptReturn] = useState(null);

  const filteredRefunds = returnsList.filter((ret) => {
    if (activeTab !== "All" && ret.refundStatus !== activeTab) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ret.id.toLowerCase().includes(q) ||
        ret.orderId.toLowerCase().includes(q) ||
        ret.customer.name.toLowerCase().includes(q) ||
        ret.customer.businessName.toLowerCase().includes(q) ||
        (ret.payoutUtr && ret.payoutUtr.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const totalRefundedAmount = returnsList
    .filter((r) => r.refundStatus === "Refunded")
    .reduce((sum, r) => sum + r.refundAmount, 0);

  const pendingPayoutAmount = returnsList
    .filter((r) => r.refundStatus === "Approved" || r.refundStatus === "Processing" || r.refundStatus === "Pending")
    .reduce((sum, r) => sum + r.refundAmount, 0);

  const pendingCount = returnsList.filter((r) => r.refundStatus === "Pending" || r.refundStatus === "Processing" || r.refundStatus === "Approved").length;
  const refundedCount = returnsList.filter((r) => r.refundStatus === "Refunded").length;

  const handleOpenPayout = (ret) => {
    setPayoutModalReturn(ret);
    setPayoutMethod(ret.payoutMethod || "Instant UPI Payout");
    setCustomUtr(`UPI-${Math.floor(100000000000 + Math.random() * 900000000000)}`);
  };

  const handleConfirmPayout = (e) => {
    e.preventDefault();
    if (!payoutModalReturn) return;
    dispatch(
      processRefund({
        returnId: payoutModalReturn.id,
        payoutMethod,
        utr: customUtr,
      })
    );
    toast.success(`Refund of ${formatCurrency(payoutModalReturn.refundAmount)} credited to ${payoutModalReturn.customer.name}!`);
    setPayoutModalReturn(null);
  };

  const handleExportRefunds = () => {
    const headers = ["Return ID", "Order ID", "Customer", "Business", "Amount", "Method", "Status", "UTR Ref"];
    const rows = filteredRefunds.map((r) => [
      r.id,
      r.orderId,
      `"${r.customer.name}"`,
      `"${r.customer.businessName}"`,
      r.refundAmount,
      `"${r.payoutMethod}"`,
      `"${r.refundStatus}"`,
      `"${r.payoutUtr || "Pending"}"`,
    ]);
    const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `ApexMart_Refunds_Ledger_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Refunds ledger exported to CSV!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-inter">
            <span>Returns & Refunds</span>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Refunds</span>
          </div>
          <h1 className="text-2xl font-poppins font-black text-slate-900 mt-1">
            Customer Refunds & Disbursements
          </h1>
          <p className="text-xs text-slate-500 font-inter">
            Approve and disburse wholesale customer refunds, record bank UTRs, and generate credit notes
          </p>
        </div>

        <button
          onClick={handleExportRefunds}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-poppins font-bold rounded-xl shadow-2xs flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-accent" />
          <span>Export Refunds CSV</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-poppins font-bold text-slate-500 uppercase tracking-wider">Total Disbursed</span>
          <p className="text-2xl font-poppins font-black text-emerald-600">{formatCurrency(totalRefundedAmount)}</p>
          <p className="text-[11px] text-slate-400 font-inter">{refundedCount} refund transactions settled</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-poppins font-bold text-amber-600 uppercase tracking-wider">Pending Payout Queue</span>
          <p className="text-2xl font-poppins font-black text-amber-700">{formatCurrency(pendingPayoutAmount)}</p>
          <p className="text-[11px] text-amber-600/70 font-inter">{pendingCount} claims awaiting disbursement</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-poppins font-bold text-blue-600 uppercase tracking-wider">Gateway Settle Time</span>
          <p className="text-2xl font-poppins font-black text-blue-700">&lt; 2 Hours</p>
          <p className="text-[11px] text-blue-600/70 font-inter">Instant UPI & NEFT Rails</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-poppins font-bold text-slate-500 uppercase tracking-wider">Disbursement Rate</span>
          <p className="text-2xl font-poppins font-black text-slate-900">98.4%</p>
          <p className="text-[11px] text-slate-400 font-inter">Zero chargeback disputes</p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-slate-100">
          {[
            { label: "All Refunds", key: "All", count: returnsList.length },
            { label: "Pending Payout", key: "Approved", count: returnsList.filter((r) => r.refundStatus === "Approved" || r.refundStatus === "Pending").length },
            { label: "Processing", key: "Processing", count: returnsList.filter((r) => r.refundStatus === "Processing").length },
            { label: "Refunded (Completed)", key: "Refunded", count: refundedCount },
            { label: "Rejected", key: "Rejected", count: returnsList.filter((r) => r.refundStatus === "Rejected").length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-poppins font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer",
                activeTab === tab.key
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              <span>{tab.label}</span>
              <span className={cn("px-1.5 py-0.2 rounded-full text-[10px]", activeTab === tab.key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600")}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search refunds by Return ID, Order ID, Customer name, or UTR reference number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-accent font-inter transition-colors"
          />
        </div>
      </div>

      {/* Refunds Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-inter">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-poppins font-black text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Claim & Order</th>
                <th className="py-3.5 px-4">Beneficiary (Customer)</th>
                <th className="py-3.5 px-4">Returned Item</th>
                <th className="py-3.5 px-4">Refund Amount</th>
                <th className="py-3.5 px-4">Payout Mode</th>
                <th className="py-3.5 px-4">Status & UTR</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRefunds.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <CreditCard className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-poppins font-bold text-sm text-slate-600">No refunds found</p>
                    <p className="text-xs text-slate-400 mt-1">Try another filter tab or search query.</p>
                  </td>
                </tr>
              ) : (
                filteredRefunds.map((ret) => (
                  <tr key={ret.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-poppins font-bold text-slate-900 block">{ret.id}</span>
                      <span className="text-slate-400 font-mono text-[11px]">{ret.orderId}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 block">{ret.customer.name}</span>
                      <span className="text-[11px] text-slate-500 block truncate max-w-[150px]">{ret.customer.businessName}</span>
                      <span className="text-[10px] text-slate-400">{ret.customer.city}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 line-clamp-1 max-w-[180px]">{ret.item.name}</span>
                      <span className="text-[11px] text-slate-500">{ret.item.qty} units ({ret.reasonCategory})</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-poppins font-bold text-base text-slate-900 block">
                        {formatCurrency(ret.refundAmount)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-poppins font-semibold text-[11px] inline-block">
                        {ret.payoutMethod}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-[10px] font-poppins font-bold inline-block border",
                          ret.refundStatus === "Refunded" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                          ret.refundStatus === "Processing" && "bg-purple-50 text-purple-700 border-purple-200",
                          ret.refundStatus === "Approved" && "bg-blue-50 text-blue-700 border-blue-200",
                          ret.refundStatus === "Pending" && "bg-amber-50 text-amber-700 border-amber-200",
                          ret.refundStatus === "Rejected" && "bg-rose-50 text-rose-700 border-rose-200"
                        )}
                      >
                        {ret.refundStatus}
                      </span>
                      {ret.payoutUtr && (
                        <p className="font-mono text-[10px] text-slate-500 mt-1 truncate max-w-[130px]" title={ret.payoutUtr}>
                          {ret.payoutUtr}
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      {ret.refundStatus !== "Refunded" && ret.refundStatus !== "Rejected" ? (
                        <button
                          onClick={() => handleOpenPayout(ret)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-poppins font-bold text-xs rounded-xl shadow-2xs transition-all active:scale-95 inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>Disburse</span>
                        </button>
                      ) : ret.refundStatus === "Refunded" ? (
                        <button
                          onClick={() => setReceiptReturn(ret)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-poppins font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Receipt className="w-3.5 h-3.5 text-accent" />
                          <span>Credit Note</span>
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disburse Refund Modal */}
      {payoutModalReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="font-poppins font-bold text-sm">Disburse Customer Refund</span>
              <button onClick={() => setPayoutModalReturn(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmPayout} className="p-6 space-y-4 text-xs font-inter">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                <p className="text-[11px] font-poppins font-bold text-emerald-800 uppercase">Payout Destination</p>
                <p className="text-sm font-bold text-slate-900">{payoutModalReturn.customer.name}</p>
                <p className="text-slate-600">{payoutModalReturn.customer.businessName}</p>
                <p className="text-base font-poppins font-black text-emerald-700 mt-2">
                  Amount: {formatCurrency(payoutModalReturn.refundAmount)}
                </p>
              </div>

              <div>
                <label className="block text-xs font-poppins font-semibold text-slate-700 mb-1.5">
                  Disbursement Rail
                </label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-poppins text-xs font-semibold text-slate-800 focus:outline-none focus:border-accent"
                >
                  <option value="Instant UPI Payout">Instant UPI Payout (Zero Fee)</option>
                  <option value="Bank NEFT / RTGS Credit">Bank NEFT / RTGS Direct Account Credit</option>
                  <option value="Store Credit Voucher">ApexMart B2B Store Credit Voucher</option>
                  <option value="Original Payment Gateway Reversal">Original Payment Gateway Reversal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-poppins font-semibold text-slate-700 mb-1.5">
                  Bank Reference UTR / Transaction ID
                </label>
                <input
                  type="text"
                  value={customUtr}
                  onChange={(e) => setCustomUtr(e.target.value)}
                  required
                  placeholder="e.g. UPI-901829384910"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPayoutModalReturn(null)}
                  className="px-4 py-2 rounded-xl text-xs font-poppins font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-poppins font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Execute Disbursement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Credit Note Receipt Modal */}
      {receiptReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="font-poppins font-bold text-sm">Credit Note & Refund Receipt</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-2.5 py-1 bg-accent hover:bg-accent-hover text-white text-xs font-bold rounded-lg flex items-center gap-1"
                >
                  <Printer className="w-3 h-3" />
                  <span>Print</span>
                </button>
                <button onClick={() => setReceiptReturn(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 text-xs font-inter">
              <div className="text-center pb-3 border-b border-slate-200">
                <h3 className="font-poppins font-black text-lg text-slate-900">ApexMart Wholesale Ltd</h3>
                <span className="text-[10px] font-poppins font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  OFFICIAL CREDIT MEMORANDUM
                </span>
                <p className="text-[11px] text-slate-400 mt-1">Ref ID: CN-{receiptReturn.id.replace("RET-", "")}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Refunded To:</span>
                  <p className="font-bold text-slate-900">{receiptReturn.customer.name}</p>
                  <p>{receiptReturn.customer.businessName}</p>
                  <p className="text-slate-500">{receiptReturn.customer.city}, {receiptReturn.customer.state}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Original Order:</span>
                  <p className="font-mono font-bold text-accent">{receiptReturn.orderId}</p>
                  <p>Method: {receiptReturn.payoutMethod}</p>
                  <p className="font-mono text-[11px] text-slate-600">UTR: {receiptReturn.payoutUtr}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>{receiptReturn.item.name} (x{receiptReturn.item.qty})</span>
                  <span>{formatCurrency(receiptReturn.refundAmount)}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Reason: {receiptReturn.reasonCategory}</p>
              </div>

              <div className="pt-2 flex justify-between items-center text-sm font-poppins font-black text-slate-900 border-t border-slate-200">
                <span>Total Refund Credited:</span>
                <span className="text-emerald-600 text-base">{formatCurrency(receiptReturn.refundAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
