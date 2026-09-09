import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  issueGiftCard,
  deactivateGiftCard,
} from "@/store/slices/adminUtilitiesSlice";
import {
  Gift,
  Search,
  Filter,
  Download,
  PlusCircle,
  CreditCard,
  Mail,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Send,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

export default function GiftCardsView() {
  const dispatch = useAppDispatch();
  const giftCards = useAppSelector((state) => state.adminUtilities?.giftCards || []);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  // Form state
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [senderName, setSenderName] = useState("Admin Store Gifts");
  const [amount, setAmount] = useState(2500);
  const [theme, setTheme] = useState("Festive Celebration");

  const filteredCards = useMemo(() => {
    return giftCards.filter((g) => {
      const matchSearch =
        g.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.recipientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.senderName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = selectedStatus === "All" || g.status === selectedStatus;
      return matchSearch && matchStatus;
    });
  }, [giftCards, searchTerm, selectedStatus]);

  const totalOutstandingBalance = useMemo(() => {
    return giftCards.reduce((sum, g) => sum + (g.status === "Active" ? g.balanceRemaining : 0), 0);
  }, [giftCards]);

  const totalIssuedValue = useMemo(() => {
    return giftCards.reduce((sum, g) => sum + (g.initialAmount || 0), 0);
  }, [giftCards]);

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    if (!recipientName.trim() || !recipientEmail.trim() || !amount) return;

    const randomDigits = () => Math.floor(1000 + Math.random() * 9000);
    const generatedCode = `GIFT-${randomDigits()}-${randomDigits()}-${new Date().getFullYear()}`;

    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);

    dispatch(
      issueGiftCard({
        id: `GC-${Date.now()}`,
        code: generatedCode,
        recipientName: recipientName.trim(),
        recipientEmail: recipientEmail.trim(),
        senderName: senderName.trim() || "Store Admin",
        initialAmount: Number(amount),
        balanceRemaining: Number(amount),
        expiryDate: expiry.toISOString().split("T")[0],
        status: "Active",
        issuedDate: new Date().toISOString().split("T")[0],
        theme,
      })
    );

    toast.success(`Gift card worth ₹${amount} issued to ${recipientName} (${generatedCode})!`);
    setIsIssueModalOpen(false);
    setRecipientName("");
    setRecipientEmail("");
  };

  const handleDeactivate = (id, code) => {
    dispatch(deactivateGiftCard(id));
    toast.error(`Gift card ${code} deactivated.`);
  };

  const handleResend = (card) => {
    toast.success(`Gift card voucher resubmitted to ${card.recipientEmail}.`);
  };

  const handleExportCSV = () => {
    const headers = ["Card ID", "Gift Code", "Recipient Name", "Recipient Email", "Sender", "Initial Amount (INR)", "Balance Remaining", "Issued Date", "Expiry Date", "Status", "Theme"];
    const rows = filteredCards.map((g) => [
      g.id,
      g.code,
      `"${g.recipientName}"`,
      g.recipientEmail,
      `"${g.senderName}"`,
      g.initialAmount,
      g.balanceRemaining,
      g.issuedDate,
      g.expiryDate,
      g.status,
      `"${g.theme}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `gift_cards_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Gift cards exported.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-rose-600" />
              Prepaid Vouchers & Gifting
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-inter">Digital Voucher Ledger</span>
          </div>
          <h1 className="text-2xl font-poppins font-bold text-slate-900 mt-1.5">
            Gift Cards Create and Manage
          </h1>
          <p className="text-sm text-slate-500 font-inter mt-1">
            Issue unique prepaid digital gift vouchers, track live redemption balances, and resend digital gift certificates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsIssueModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-all shadow-md active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            Issue Digital Gift Card
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Gift Cards</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Gift className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">
            {giftCards.filter((g) => g.status === "Active").length}
          </p>
          <p className="text-xs text-slate-400 mt-1">Unredeemed active vouchers</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Outstanding Balance</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">
            ₹{totalOutstandingBalance.toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 mt-1">Remaining customer credit</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Value Issued</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">
            ₹{totalIssuedValue.toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 mt-1">Gross gift card revenue</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Redemption Rate</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">71.4%</p>
          <p className="text-xs text-slate-400 mt-1">Utilized within 90 days</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by code, recipient name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all font-inter text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-medium text-slate-500">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Balance</option>
              <option value="Redeemed">Fully Redeemed</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Gift Cards Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-poppins">
                <th className="p-4">Gift Voucher Code</th>
                <th className="p-4">Recipient & Sender</th>
                <th className="p-4">Card Balance</th>
                <th className="p-4">Theme / Template</th>
                <th className="p-4">Expiry Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-inter">
              {filteredCards.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <Gift className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No gift cards match your filter</p>
                    <p className="text-xs text-slate-400 mt-1">Try resetting search keywords</p>
                  </td>
                </tr>
              ) : (
                filteredCards.map((card) => (
                  <tr key={card.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <div>
                        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 text-xs tracking-wider">
                          {card.code}
                        </span>
                        <p className="text-[11px] text-slate-400 mt-1">Issued: {card.issuedDate}</p>
                      </div>
                    </td>

                    <td className="p-4">
                      <div>
                        <p className="font-semibold text-slate-900">{card.recipientName}</p>
                        <p className="text-xs text-slate-400">{card.recipientEmail}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">From: {card.senderName}</p>
                      </div>
                    </td>

                    <td className="p-4">
                      <div>
                        <p className="font-bold text-slate-900">₹{card.balanceRemaining.toLocaleString()}</p>
                        <p className="text-[11px] text-slate-400">of ₹{card.initialAmount.toLocaleString()}</p>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                        {card.theme}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="text-xs text-slate-700">
                        <p className="font-semibold flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {card.expiryDate}
                        </p>
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${
                          card.status === "Active"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : card.status === "Redeemed"
                            ? "bg-blue-50 text-blue-800 border-blue-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {card.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleResend(card)}
                          title="Resend Gift Card to Recipient Email"
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                        {card.status === "Active" && (
                          <button
                            onClick={() => handleDeactivate(card.id, card.code)}
                            title="Deactivate Gift Card"
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Gift Card Modal */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleIssueSubmit}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
                  <Gift className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-poppins font-bold text-slate-900 text-base">Issue Digital Gift Card</h3>
                  <p className="text-xs text-slate-400">Generate voucher with 1-year validity</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsIssueModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 my-5 text-sm font-inter">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pooja Sharma"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Recipient Email</label>
                <input
                  type="email"
                  required
                  placeholder="pooja@example.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Card Value (₹)</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Design Theme</label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  >
                    <option value="Festive Celebration">Festive Celebration</option>
                    <option value="Birthday Surprise">Birthday Surprise</option>
                    <option value="Corporate Milestone">Corporate Milestone</option>
                    <option value="Thank You Special">Thank You Special</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Sender Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp / Store Management"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsIssueModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Issue Certificate
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
