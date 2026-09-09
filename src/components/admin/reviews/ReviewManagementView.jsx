import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  approveReview,
  rejectReview,
  replyToReview,
  batchApprovePending,
} from "../../../store/slices/adminReviewsSlice";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  Search,
  Filter,
  Download,
  Star,
  CornerDownRight,
  ExternalLink,
  Check,
  X,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

const ReviewManagementView = () => {
  const dispatch = useAppDispatch();
  const productReviews = useAppSelector(
    (state) => state.adminReviews?.productReviews || []
  );

  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'pending' | 'approved' | 'rejected'
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all"); // 'all' | '5' | '4' | '3' | '2' | '1'

  // Reply Modal State
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedReviewForReply, setSelectedReviewForReply] = useState(null);
  const [replyText, setReplyText] = useState("");

  // Metrics
  const totalReviews = productReviews.length;
  const pendingCount = productReviews.filter((r) => r.status === "Pending").length;
  const approvedCount = productReviews.filter((r) => r.status === "Approved").length;
  const rejectedCount = productReviews.filter((r) => r.status === "Rejected").length;

  // Filtered list
  const filteredReviews = useMemo(() => {
    return productReviews.filter((item) => {
      // Tab filter
      if (activeTab === "pending" && item.status !== "Pending") return false;
      if (activeTab === "approved" && item.status !== "Approved") return false;
      if (activeTab === "rejected" && item.status !== "Rejected") return false;

      // Rating filter
      if (ratingFilter !== "all" && item.rating !== parseInt(ratingFilter)) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesProduct = item.productName.toLowerCase().includes(query);
        const matchesSku = item.sku.toLowerCase().includes(query);
        const matchesReviewer = item.reviewerName.toLowerCase().includes(query);
        const matchesComment = item.comment.toLowerCase().includes(query);
        const matchesTitle = item.title.toLowerCase().includes(query);
        return (
          matchesProduct ||
          matchesSku ||
          matchesReviewer ||
          matchesComment ||
          matchesTitle
        );
      }
      return true;
    });
  }, [productReviews, activeTab, ratingFilter, searchQuery]);

  // Handlers
  const handleApprove = (id, reviewer) => {
    dispatch(approveReview(id));
    toast.success(`Review from ${reviewer} approved & published!`);
  };

  const handleReject = (id, reviewer) => {
    dispatch(rejectReview(id));
    toast.error(`Review from ${reviewer} moved to Rejected queue.`);
  };

  const handleBatchApprove = () => {
    if (pendingCount === 0) {
      toast.info("No pending reviews to approve.");
      return;
    }
    dispatch(batchApprovePending());
    toast.success(`Batch approved ${pendingCount} pending reviews!`);
  };

  const openReplyModal = (review) => {
    setSelectedReviewForReply(review);
    setReplyText(review.merchantReply || "");
    setReplyModalOpen(true);
  };

  const handleSaveReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedReviewForReply) return;

    dispatch(
      replyToReview({
        id: selectedReviewForReply.id,
        reply: replyText.trim(),
      })
    );
    toast.success(`Merchant reply posted to ${selectedReviewForReply.reviewerName}!`);
    setReplyModalOpen(false);
    setSelectedReviewForReply(null);
    setReplyText("");
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      "Review ID",
      "SKU",
      "Product Name",
      "Category",
      "Reviewer",
      "Rating",
      "Title",
      "Comment",
      "Status",
      "Merchant Reply",
      "Date",
    ];

    const rows = filteredReviews.map((r) => [
      r.id,
      r.sku,
      `"${r.productName.replace(/"/g, '""')}"`,
      r.category,
      `"${r.reviewerName}"`,
      r.rating,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.comment.replace(/"/g, '""')}"`,
      r.status,
      r.merchantReply ? `"${r.merchantReply.replace(/"/g, '""')}"` : '""',
      r.createdAt,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `review_moderation_${activeTab}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Moderation queue exported to CSV!");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Review Management
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Reviews approve, reject and manage across catalog products with merchant response tools.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export CSV
          </button>
          {pendingCount > 0 && (
            <button
              onClick={handleBatchApprove}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              Approve All Pending ({pendingCount})
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total in Queue */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Catalog Reviews
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {totalReviews}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Storewide product feedbacks
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-slate-600 border border-slate-100">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Moderation */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Pending Moderation
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {pendingCount}
            </div>
            <div className="text-xs text-amber-700 mt-1 flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5" />
              Requires merchant review
            </div>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600 border border-amber-100">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Approved */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Approved & Published
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {approvedCount}
            </div>
            <div className="text-xs text-emerald-700 mt-1 font-medium">
              {totalReviews ? Math.round((approvedCount / totalReviews) * 100) : 0}% publish rate
            </div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Rejected */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
              Rejected / Hidden
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {rejectedCount}
            </div>
            <div className="text-xs text-rose-600 mt-1 font-medium">
              Filtered spam or policy violations
            </div>
          </div>
          <div className="p-3 bg-rose-50 rounded-xl text-rose-600 border border-rose-100">
            <XCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Tabs & Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tab Navigation */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === "all"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All ({totalReviews})
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "pending"
                  ? "bg-white text-amber-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Pending Approval
              {pendingCount > 0 && (
                <span className="w-4 h-4 text-[10px] rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("approved")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === "approved"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Approved ({approvedCount})
            </button>
            <button
              onClick={() => setActiveTab("rejected")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === "rejected"
                  ? "bg-white text-rose-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Rejected ({rejectedCount})
            </button>
          </div>

          {/* Search & Star Rating Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search SKU, product, buyer..."
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="w-full sm:w-auto py-1.5 px-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Moderation Items Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredReviews.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <ShieldCheck className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-semibold text-slate-700">
              No reviews found in this moderation queue
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try switching tabs or clearing your search filter to review other customer feedbacks.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Review ID / Date</th>
                  <th className="py-3 px-4">Product Info</th>
                  <th className="py-3 px-4">Reviewer</th>
                  <th className="py-3 px-4">Rating & Content</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs text-slate-600">
                {filteredReviews.map((review) => (
                  <tr
                    key={review.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* ID & Date */}
                    <td className="py-4 px-4 align-top">
                      <div className="font-mono font-medium text-slate-900">
                        {review.id}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {review.createdAt}
                      </div>
                    </td>

                    {/* Product Info */}
                    <td className="py-4 px-4 align-top max-w-[220px]">
                      <div className="font-semibold text-slate-900 line-clamp-2">
                        {review.productName}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                          {review.sku}
                        </span>
                        <span className="text-[11px] text-slate-400 truncate">
                          {review.category}
                        </span>
                      </div>
                    </td>

                    {/* Reviewer */}
                    <td className="py-4 px-4 align-top whitespace-nowrap">
                      <div className="font-semibold text-slate-900">
                        {review.reviewerName}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {review.city}
                      </div>
                      {review.verifiedPurchase && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 border border-emerald-100">
                          <Check className="w-2.5 h-2.5" />
                          Verified
                        </span>
                      )}
                    </td>

                    {/* Rating & Content */}
                    <td className="py-4 px-4 align-top max-w-sm">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <div className="flex text-amber-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= review.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] font-bold text-slate-700">
                          {review.rating}.0
                        </span>
                      </div>
                      <div className="font-semibold text-slate-800 text-[13px] mb-1">
                        "{review.title}"
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                        {review.comment}
                      </p>

                      {/* Photo preview thumbnail if present */}
                      {review.images && review.images.length > 0 && (
                        <div className="mt-2 flex items-center gap-1.5">
                          {review.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt="Review attachment"
                              className="w-9 h-9 rounded object-cover border border-slate-200"
                            />
                          ))}
                          <span className="text-[10px] text-slate-400 font-medium">
                            {review.images.length} customer photo(s)
                          </span>
                        </div>
                      )}

                      {/* Merchant Reply banner if present */}
                      {review.merchantReply && (
                        <div className="mt-2.5 p-2 bg-slate-50 rounded-md border-l-2 border-indigo-500 text-[11px] text-slate-700">
                          <div className="font-semibold text-indigo-700 flex items-center gap-1 mb-0.5">
                            <CornerDownRight className="w-3 h-3" />
                            Store Merchant Reply:
                          </div>
                          <p className="italic">{review.merchantReply}</p>
                        </div>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4 align-top whitespace-nowrap">
                      {review.status === "Approved" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Approved
                        </span>
                      )}
                      {review.status === "Pending" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <Clock className="w-3 h-3" />
                          Pending Review
                        </span>
                      )}
                      {review.status === "Rejected" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <XCircle className="w-3 h-3" />
                          Rejected
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 align-top text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {review.status !== "Approved" && (
                          <button
                            onClick={() =>
                              handleApprove(review.id, review.reviewerName)
                            }
                            title="Approve & Publish"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md border border-slate-200 hover:border-emerald-300 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}

                        {review.status !== "Rejected" && (
                          <button
                            onClick={() =>
                              handleReject(review.id, review.reviewerName)
                            }
                            title="Reject Review"
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md border border-slate-200 hover:border-rose-300 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => openReplyModal(review)}
                          title={
                            review.merchantReply
                              ? "Edit Merchant Reply"
                              : "Reply as Store Support"
                          }
                          className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md border border-indigo-200 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          {review.merchantReply ? "Edit Reply" : "Reply"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Merchant Reply Modal */}
      {replyModalOpen && selectedReviewForReply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-md bg-indigo-100 text-indigo-700">
                  <MessageSquare className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Official Merchant Reply
                </h3>
              </div>
              <button
                onClick={() => setReplyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReply} className="p-5 space-y-4">
              {/* Review snippet context */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div className="flex items-center justify-between font-semibold text-slate-800 mb-1">
                  <span>
                    {selectedReviewForReply.reviewerName} rated {selectedReviewForReply.rating}★
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {selectedReviewForReply.id}
                  </span>
                </div>
                <div className="font-medium text-slate-700 italic">
                  "{selectedReviewForReply.title}"
                </div>
                <p className="text-slate-500 mt-1 line-clamp-2">
                  {selectedReviewForReply.comment}
                </p>
              </div>

              {/* Reply Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Your Response (Visible publicly beneath the customer review)
                </label>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Thank the customer or address specific delivery/firmware questions in a polite tone..."
                  className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReplyModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Publish Reply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewManagementView;
