import React, { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import {
  FileSpreadsheet,
  Download,
  Calendar,
  DollarSign,
  Receipt,
  Boxes,
  Clock,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ArrowDownToLine,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";

export default function StoreReportsView() {
  const [reportDateRange, setReportDateRange] = useState("Current Month (Sep 2026)");
  const salesFinancials = useAppSelector((state) => state.adminAnalytics.salesFinancials);
  const stateSales = useAppSelector((state) => state.adminAnalytics.stateSales);
  const topProducts = useAppSelector((state) => state.adminAnalytics.topProducts);
  const topCustomers = useAppSelector((state) => state.adminAnalytics.topCustomers);
  const rtoItems = useAppSelector((state) => state.adminRto.items);

  const downloadCSV = (filename, headers, rows) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Generated and downloaded ${filename}.csv`);
  };

  // 1. P&L Financial Statement Report
  const handleDownloadPnL = () => {
    const headers = ["Account Head", "Amount (INR)", "Notes"];
    const rows = [
      ["Gross Wholesale Sales", salesFinancials.grossSales, "Total billed revenue"],
      ["Trade & Quantity Discounts", `-${salesFinancials.tradeDiscounts}`, "Tier discounts given to wholesale buyers"],
      ["Net Sales Revenue", salesFinancials.netSales, "Realized sales before taxes"],
      ["Estimated Cost of Goods Sold (COGS)", Math.round(salesFinancials.netSales * 0.72), "72% average manufacturing & procurement cost"],
      ["Gross Operating Margin", Math.round(salesFinancials.netSales * 0.28), "28% gross margin"],
      ["Shipping & Forward Logistics Cost", 285000, "Two-way shipping and carrier freight"],
      ["Estimated Net Operating Profit", 1140000, "Operating bottom line"],
    ];
    downloadCSV("apexmart_pnl_statement", headers, rows);
  };

  // 2. GSTR-1 Tax Summary Report
  const handleDownloadGSTR1 = () => {
    const headers = ["Tax Head", "Rate (%)", "Taxable Value (INR)", "Tax Amount (INR)", "Compliance Status"];
    const rows = [
      ["Intra-State CGST", "9%", Math.round(salesFinancials.netSales * 0.45), Math.round(salesFinancials.netSales * 0.45 * 0.09), "Reconciled"],
      ["Intra-State SGST", "9%", Math.round(salesFinancials.netSales * 0.45), Math.round(salesFinancials.netSales * 0.45 * 0.09), "Reconciled"],
      ["Inter-State IGST", "18%", Math.round(salesFinancials.netSales * 0.55), Math.round(salesFinancials.netSales * 0.55 * 0.18), "Reconciled"],
      ["Total Output GST Liability", "18% Avg", salesFinancials.netSales, salesFinancials.gstTaxCollected, "Ready for Filing"],
    ];
    downloadCSV("apexmart_gstr1_tax_summary", headers, rows);
  };

  // 3. Inventory Valuation Ledger
  const handleDownloadInventoryValuation = () => {
    const headers = ["SKU", "Product Description", "Warehouse Location", "In Stock Units", "Wholesale Unit Cost", "Total Inventory Asset (INR)"];
    const rows = topProducts.map((p) => [
      p.sku,
      `"${p.name}"`,
      "Bay 2 / Rack A",
      p.stock,
      Math.round(p.revenue / p.unitsSold),
      p.stock * Math.round(p.revenue / p.unitsSold),
    ]);
    downloadCSV("apexmart_inventory_valuation_ledger", headers, rows);
  };

  // 4. B2B Credit Aging Report
  const handleDownloadCreditAging = () => {
    const headers = ["Account ID", "Customer Name", "Company", "Credit Limit", "Outstanding Balance", "Aging Bucket", "Payment Status"];
    const rows = topCustomers.map((c, i) => [
      c.id,
      `"${c.name}"`,
      `"${c.company}"`,
      "Rs. 2,00,000",
      `Rs. ${Math.round(c.totalSpend * 0.25).toLocaleString("en-IN")}`,
      i === 0 ? "0-15 Days (Current)" : i === 1 ? "16-30 Days (Current)" : "0-15 Days (Current)",
      "Normal / In-Good-Standing",
    ]);
    downloadCSV("apexmart_b2b_credit_aging_report", headers, rows);
  };

  // 5. Logistics & RTO Cost Impact Report
  const handleDownloadRtoImpact = () => {
    const headers = ["RTO ID", "Order ID", "Carrier", "Order Value (INR)", "Forward Freight", "Reverse Freight", "Total Freight Loss", "NDR Dispute Status"];
    const rows = rtoItems.map((r) => [
      r.id,
      r.orderId,
      r.forwardCourier,
      r.orderValue,
      r.forwardFreight,
      r.reverseFreight || 0,
      r.forwardFreight + (r.reverseFreight || 0),
      r.verification.status,
    ]);
    downloadCSV("apexmart_logistics_rto_cost_report", headers, rows);
  };

  const reportCards = [
    {
      title: "Comprehensive P&L Statement",
      description: "Itemized gross sales, trade volume discounts, COGS procurement cost, logistics expenses, and net margins.",
      icon: DollarSign,
      action: handleDownloadPnL,
      color: "bg-emerald-50 text-emerald-700",
      tag: "Executive Finance",
    },
    {
      title: "GSTR-1 Tax Filing Summary",
      description: "Consolidated intra-state (CGST/SGST) and inter-state (IGST) tax liabilities prepared for monthly GST portal submission.",
      icon: Receipt,
      action: handleDownloadGSTR1,
      color: "bg-blue-50 text-blue-700",
      tag: "GST Compliance",
    },
    {
      title: "Warehouse Inventory Valuation",
      description: "Detailed stock ledger with warehouse bay allocations, available unit counts, and total asset valuation at wholesale cost.",
      icon: Boxes,
      action: handleDownloadInventoryValuation,
      color: "bg-orange-50 text-accent",
      tag: "Asset Ledger",
    },
    {
      title: "B2B Buyer Credit Aging Report",
      description: "Tracks active Net-30 credit lines, current outstanding payables, overdue balances, and buyer reliability ratings.",
      icon: Clock,
      action: handleDownloadCreditAging,
      color: "bg-purple-50 text-purple-700",
      tag: "Credit Control",
    },
    {
      title: "Logistics & RTO Cost Impact Report",
      description: "Carrier performance audit, two-way freight expense analysis, fake attempt dispute logs, and NDR loss recovery.",
      icon: RotateCcw,
      action: handleDownloadRtoImpact,
      color: "bg-rose-50 text-rose-700",
      tag: "Logistics Audit",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-poppins font-black uppercase tracking-wider">
              Data Exports
            </span>
            <span className="text-xs text-slate-400 font-inter">Audit-Ready Spreadsheets</span>
          </div>
          <h1 className="text-2xl font-poppins font-black text-slate-900 tracking-tight mt-1">
            Detailed Business Reports
          </h1>
          <p className="text-xs text-slate-500 font-inter mt-0.5">
            Generate and export institutional-grade financial, tax, logistics, inventory, and accounts receivable reports in CSV format.
          </p>
        </div>

        {/* Date Preset Selector */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <Select value={reportDateRange} onValueChange={setReportDateRange}>
            <SelectTrigger className="w-[230px] rounded-xl border-slate-200 text-xs font-poppins font-semibold text-slate-700 bg-white">
              <SelectValue placeholder="Select Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Current Month (Sep 2026)">Current Month (Sep 2026)</SelectItem>
              <SelectItem value="Last Month (Aug 2026)">Last Month (Aug 2026)</SelectItem>
              <SelectItem value="Current Quarter (Q2 FY26)">Current Quarter (Q2 FY26)</SelectItem>
              <SelectItem value="Full Financial Year (FY26)">Full Financial Year (FY26)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Report Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reportCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-poppins font-bold text-[10px] uppercase">
                    {card.tag}
                  </span>
                </div>

                <div>
                  <h3 className="font-poppins font-bold text-slate-900 text-base">{card.title}</h3>
                  <p className="text-xs text-slate-500 font-inter mt-1 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400 font-inter">
                  Range: <strong className="text-slate-700">{reportDateRange}</strong>
                </span>

                <button
                  onClick={card.action}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white font-poppins font-bold text-xs transition-all shadow-2xs active:scale-98 cursor-pointer"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5" />
                  <span>Download CSV</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
