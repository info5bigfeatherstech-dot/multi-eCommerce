import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addCustomerFeedback } from "@/store/slices/adminReviewsSlice";
import {
  MessageSquareHeart,
  Search,
  PlusCircle,
  Download,
  Truck,
  Headphones,
  TrendingUp,
  Smile,
  Meh,
  Frown,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export default function CustomerFeedbackView() {
  const dispatch = useAppDispatch();
  const feedbackList = useAppSelector(
    (state) => state.adminReviews?.customerFeedback || []
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New feedback form
  const [newCustomer, setNewCustomer] = useState("");
  const [newOrderId, setNewOrderId] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newNps, setNewNps] = useState(10);
  const [newDeliveryRating, setNewDeliveryRating] = useState(5);
  const [newSupportRating, setNewSupportRating] = useState(5);
  const [newText, setNewText] = useState("");

  const filteredFeedback = useMemo(() => {
    return feedbackList.filter((f) => {
      const matchSearch =
        f.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.feedbackText.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSentiment =
        sentimentFilter === "All" || f.sentiment === sentimentFilter;
      return matchSearch && matchSentiment;
    });
  }, [feedbackList, searchTerm, sentimentFilter]);

  const promotersCount = useMemo(
    () => feedbackList.filter((f) => f.sentiment === "Promoter").length,
    [feedbackList]
  );
  const detractorsCount = useMemo(
    () => feedbackList.filter((f) => f.sentiment === "Detractor").length,
    [feedbackList]
  );

  const npsScore = useMemo(() => {
    if (feedbackList.length === 0) return 0;
    const promoterPct = (promotersCount / feedbackList.length) * 100;
    const detractorPct = (detractorsCount / feedbackList.length) * 100;
    return (promoterPct - detractorPct).toFixed(0);
  }, [promotersCount, detractorsCount, feedbackList.length]);

  const avgDelivery = useMemo(() => {
    if (feedbackList.length === 0) return 0;
    const total = feedbackList.reduce((sum, f) => sum + f.deliveryRating, 0);
    return (total / feedbackList.length).toFixed(1);
  }, [feedbackList]);

  const avgSupport = useMemo(() => {
    if (feedbackList.length === 0) return 0;
    const total = feedbackList.reduce((sum, f) => sum + f.supportRating, 0);
    return (total / feedbackList.length).toFixed(1);
  }, [feedbackList]);

  const handleCreateFeedback = (e) => {
    e.preventDefault();
    if (!newCustomer.trim() || !newText.trim()) {
      toast.error("Customer name and feedback comments are required.");
      return;
    }

    const npsNum = parseInt(newNps, 10);
    let sentiment = "Promoter";
    if (npsNum <= 6) sentiment = "Detractor";
    else if (npsNum <= 8) sentiment = "Passive";

    const newObj = {
      id: `CFB-${Date.now().toString().slice(-4)}`,
      customerName: newCustomer.trim(),
      orderId:
        newOrderId.trim().toUpperCase() ||
        `ORD-${Math.floor(Math.random() * 8000) + 1000}`,
      city: newCity.trim() || "Mumbai, Maharashtra",
      npsScore: npsNum,
      sentiment,
      deliveryRating: parseInt(newDeliveryRating, 10),
      supportRating: parseInt(newSupportRating, 10),
      feedbackText: newText.trim(),
      createdAt: new Date().toISOString().split("T")[0],
    };

    dispatch(addCustomerFeedback(newObj));
    toast.success(`Customer feedback from ${newCustomer} recorded!`);
    setIsAddModalOpen(false);
    setNewCustomer("");
    setNewOrderId("");
    setNewText("");
  };

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Customer Name",
      "Order ID",
      "City",
      "NPS Score (1-10)",
      "Sentiment",
      "Delivery CSAT (1-5)",
      "Support CSAT (1-5)",
      "Feedback Text",
      "Date",
    ];

    const rows = filteredFeedback.map((f) => [
      f.id,
      `"${f.customerName.replace(/"/g, '""')}"`,
      f.orderId,
      `"${f.city}"`,
      f.npsScore,
      f.sentiment,
      f.deliveryRating,
      f.supportRating,
      `"${f.feedbackText.replace(/"/g, '""')}"`,
      f.createdAt,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `customer_feedback_csat_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Customer feedback ledger exported as CSV.");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              General Customer Feedback & CSAT
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-200">
              <Smile className="h-3 w-3" /> Voice of Customer
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Monitor Net Promoter Score (NPS), delivery fulfillment ratings, packaging satisfaction, and customer support CSAT.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="h-4 w-4 text-slate-500" />
            Export Feedback
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            Add Feedback Entry
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Net Promoter Score (NPS)
            </span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-emerald-600">
            +{npsScore}
          </div>
          <p className="mt-1 text-xs text-slate-500">World-class satisfaction benchmark</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Delivery Logistics CSAT
            </span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Truck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            {avgDelivery} <span className="text-sm font-normal text-slate-500">/ 5.0</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Speed, tracking & parcel integrity</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Support Resolution CSAT
            </span>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <Headphones className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-purple-600">
            {avgSupport} <span className="text-sm font-normal text-slate-500">/ 5.0</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Helpdesk agent helpfulness</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Feedbacks Logged
            </span>
            <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            {feedbackList.length}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {promotersCount} Promoters • {detractorsCount} Detractors
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search customer, order ID, city, or comment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          {["All", "Promoter", "Passive", "Detractor"].map((st) => (
            <button
              key={st}
              onClick={() => setSentimentFilter(st)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                sentimentFilter === st
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {st === "All" ? "All Sentiments" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/75 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Customer & Order</th>
                <th className="px-6 py-3.5 text-center">NPS Score</th>
                <th className="px-6 py-3.5 text-center">Sentiment</th>
                <th className="px-6 py-3.5 text-center">Delivery</th>
                <th className="px-6 py-3.5 text-center">Support</th>
                <th className="px-6 py-3.5">Feedback Experience</th>
                <th className="px-6 py-3.5 text-center">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredFeedback.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    No customer feedback entries found matching your query.
                  </td>
                </tr>
              ) : (
                filteredFeedback.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/75 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-slate-900">
                          {item.customerName}
                        </div>
                        <div className="font-mono text-xs text-indigo-600 mt-0.5">
                          {item.orderId}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {item.city}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-base text-slate-900 font-mono">
                        {item.npsScore}/10
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          item.sentiment === "Promoter"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : item.sentiment === "Passive"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {item.sentiment === "Promoter" ? (
                          <Smile className="h-3 w-3" />
                        ) : item.sentiment === "Passive" ? (
                          <Meh className="h-3 w-3" />
                        ) : (
                          <Frown className="h-3 w-3" />
                        )}
                        {item.sentiment}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center font-semibold text-slate-800 text-xs">
                      {item.deliveryRating} ★
                    </td>

                    <td className="px-6 py-4 text-center font-semibold text-slate-800 text-xs">
                      {item.supportRating} ★
                    </td>

                    <td className="px-6 py-4 max-w-md">
                      <p className="text-xs text-slate-700 leading-relaxed">
                        "{item.feedbackText}"
                      </p>
                    </td>

                    <td className="px-6 py-4 text-center text-xs text-slate-500 font-mono">
                      {item.createdAt}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Feedback Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form
            onSubmit={handleCreateFeedback}
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                Log Customer Feedback Entry
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Apte"
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Order ID Reference
                </label>
                <input
                  type="text"
                  placeholder="ORD-9450"
                  value={newOrderId}
                  onChange={(e) => setNewOrderId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  NPS Score (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={newNps}
                  onChange={(e) => setNewNps(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Delivery (1-5★)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  required
                  value={newDeliveryRating}
                  onChange={(e) => setNewDeliveryRating(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Support (1-5★)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  required
                  value={newSupportRating}
                  onChange={(e) => setNewSupportRating(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Customer Feedback Text *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Enter customer comments regarding overall experience..."
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 shadow-sm"
              >
                Record Feedback
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
