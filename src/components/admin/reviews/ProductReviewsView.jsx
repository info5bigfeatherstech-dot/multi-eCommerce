import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addProductReview } from "@/store/slices/adminReviewsSlice";
import {
  Star,
  Search,
  PlusCircle,
  Download,
  CheckCircle2,
  ShieldCheck,
  Image as ImageIcon,
  SlidersHorizontal,
  Clock,
  Layers,
  Sparkles,
  MessageSquare,
  Eye,
  Camera,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";

export default function ProductReviewsView() {
  const dispatch = useAppDispatch();
  const reviews = useAppSelector(
    (state) => state.adminReviews?.productReviews || []
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRating, setSelectedRating] = useState("All"); // "All" | "5" | "4" | "3" | "1-2"
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [previewImage, setPreviewImage] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add review state
  const [newProduct, setNewProduct] = useState(
    "Pure Handloom Chanderi Silk Saree"
  );
  const [newSku, setNewSku] = useState("APX-FSH-001");
  const [newCategory, setNewCategory] = useState("Fashion & Apparel");
  const [newReviewer, setNewReviewer] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState("");
  const [newComment, setNewComment] = useState("");

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchSearch =
        r.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.reviewerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.comment.toLowerCase().includes(searchTerm.toLowerCase());

      let matchRating = true;
      if (selectedRating === "5") matchRating = r.rating === 5;
      else if (selectedRating === "4") matchRating = r.rating === 4;
      else if (selectedRating === "3") matchRating = r.rating === 3;
      else if (selectedRating === "1-2") matchRating = r.rating <= 2;

      const matchStatus =
        selectedStatus === "All" || r.status === selectedStatus;

      return matchSearch && matchRating && matchStatus;
    });
  }, [reviews, searchTerm, selectedRating, selectedStatus]);

  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  const photoCount = useMemo(() => {
    return reviews.filter((r) => r.images && r.images.length > 0).length;
  }, [reviews]);

  const verifiedCount = useMemo(() => {
    return reviews.filter((r) => r.verifiedPurchase).length;
  }, [reviews]);

  const verifiedRate = useMemo(() => {
    if (reviews.length === 0) return 0;
    return ((verifiedCount / reviews.length) * 100).toFixed(0);
  }, [verifiedCount, reviews.length]);

  const handleCreateReview = (e) => {
    e.preventDefault();
    if (!newReviewer.trim() || !newTitle.trim() || !newComment.trim()) {
      toast.error("Please fill all required review fields.");
      return;
    }

    const reviewObj = {
      id: `REV-${Date.now().toString().slice(-4)}`,
      sku: newSku,
      productName: newProduct,
      category: newCategory,
      reviewerName: newReviewer.trim(),
      city: newCity.trim() || "Mumbai, Maharashtra",
      rating: parseInt(newRating, 10),
      title: newTitle.trim(),
      comment: newComment.trim(),
      verifiedPurchase: true,
      images: [],
      status: "Approved",
      createdAt: new Date().toISOString().split("T")[0],
      merchantReply: null,
    };

    dispatch(addProductReview(reviewObj));
    toast.success(`Review from ${newReviewer} added successfully!`);
    setIsAddModalOpen(false);
    setNewReviewer("");
    setNewTitle("");
    setNewComment("");
  };

  const handleExportCSV = () => {
    const headers = [
      "Review ID",
      "SKU",
      "Product Name",
      "Category",
      "Reviewer Name",
      "City",
      "Rating",
      "Headline",
      "Comment",
      "Verified Purchase",
      "Status",
      "Date",
    ];

    const rows = filteredReviews.map((r) => [
      r.id,
      r.sku,
      `"${r.productName.replace(/"/g, '""')}"`,
      r.category,
      `"${r.reviewerName.replace(/"/g, '""')}"`,
      `"${r.city}"`,
      r.rating,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.comment.replace(/"/g, '""')}"`,
      r.verifiedPurchase ? "Yes" : "No",
      r.status,
      r.createdAt,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `product_reviews_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Product reviews exported as CSV.");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Product-Specific Customer Reviews
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> Catalog Ratings
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Browse verified buyer ratings, customer photo unboxings, and product quality feedback.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="h-4 w-4 text-slate-500" />
            Export Reviews
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            Add Sample Review
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Product Reviews
            </span>
            <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            {reviews.length}
          </div>
          <p className="mt-1 text-xs text-slate-500">Across entire catalog SKUs</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Average Product Rating
            </span>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900 flex items-center gap-1.5">
            {avgRating} <span className="text-sm font-normal text-slate-500">/ 5.0</span>
          </div>
          <p className="mt-1 text-xs text-emerald-600 font-medium">★★★★★ 94% positive</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Photo Unboxings
            </span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Camera className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-blue-600">{photoCount}</div>
          <p className="mt-1 text-xs text-slate-500">Real verified buyer photos</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Verified Buyer Rate
            </span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-emerald-600">{verifiedRate}%</div>
          <p className="mt-1 text-xs text-slate-500">Orders verified with GST invoice</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search product, SKU, reviewer, or review text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Rating filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {[
              { label: "All Stars", val: "All" },
              { label: "5 ★", val: "5" },
              { label: "4 ★", val: "4" },
              { label: "3 ★", val: "3" },
              { label: "1-2 ★", val: "1-2" },
            ].map((star) => (
              <button
                key={star.val}
                onClick={() => setSelectedRating(star.val)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  selectedRating === star.val
                    ? "bg-white text-slate-900 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {star.label}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="w-36">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-9 text-xs bg-white border-slate-300">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/75 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Product Details</th>
                <th className="px-6 py-3.5">Reviewer</th>
                <th className="px-6 py-3.5 text-center">Rating</th>
                <th className="px-6 py-3.5">Review Content</th>
                <th className="px-6 py-3.5 text-center">Photo</th>
                <th className="px-6 py-3.5 text-center">Status</th>
                <th className="px-6 py-3.5 text-center">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    No product reviews found matching your search.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((rev) => (
                  <tr
                    key={rev.id}
                    className="hover:bg-slate-50/75 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-slate-900">
                          {rev.productName}
                        </div>
                        <div className="font-mono text-xs text-indigo-600 mt-0.5">
                          {rev.sku}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {rev.category}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">
                        {rev.reviewerName}
                      </div>
                      <div className="text-xs text-slate-500">{rev.city}</div>
                      {rev.verifiedPurchase && (
                        <div className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded mt-0.5">
                          <ShieldCheck className="h-3 w-3 text-emerald-600" />
                          Verified Buyer
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`h-3.5 w-3.5 ${
                              s <= rev.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 mt-0.5 block">
                        {rev.rating}.0 / 5.0
                      </span>
                    </td>

                    <td className="px-6 py-4 max-w-md">
                      <div className="font-bold text-slate-900 text-xs">
                        {rev.title}
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                        {rev.comment}
                      </p>
                      {rev.merchantReply && (
                        <div className="mt-2 rounded-lg bg-slate-50 border border-slate-200 p-2 text-xs text-slate-700">
                          <span className="font-bold text-slate-900 flex items-center gap-1">
                            <MessageSquare className="h-3 w-3 text-indigo-600" />
                            Merchant Response:
                          </span>
                          <p className="mt-0.5 text-[11px] text-slate-600">
                            {rev.merchantReply}
                          </p>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {rev.images && rev.images.length > 0 ? (
                        <button
                          onClick={() => setPreviewImage(rev.images[0])}
                          className="relative h-11 w-11 rounded-lg overflow-hidden border border-slate-200 hover:opacity-90 group mx-auto"
                        >
                          <img
                            src={rev.images[0]}
                            alt="Review Attachment"
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute inset-0 bg-black/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <Eye className="h-3.5 w-3.5" />
                          </span>
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          rev.status === "Approved"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : rev.status === "Pending"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {rev.status === "Approved" ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <Clock className="h-3 w-3" />
                        )}
                        {rev.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center text-xs text-slate-500 font-mono">
                      {rev.createdAt}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative max-w-xl rounded-2xl bg-white p-4 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 rounded-full bg-slate-900/60 p-1.5 text-white hover:bg-slate-900"
            >
              ✕
            </button>
            <img
              src={previewImage}
              alt="Buyer unboxing"
              className="w-full h-80 object-cover rounded-xl"
            />
            <div className="mt-3 text-center text-xs text-slate-500 font-medium">
              Verified Buyer Unboxing Photo
            </div>
          </div>
        </div>
      )}

      {/* Add Review Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form
            onSubmit={handleCreateReview}
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                Add Customer Review
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Target Product
              </label>
              <input
                type="text"
                value={newProduct}
                onChange={(e) => setNewProduct(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Customer / Reviewer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shilpa Mehta"
                  value={newReviewer}
                  onChange={(e) => setNewReviewer(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Customer City
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pune, Maharashtra"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Star Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setNewRating(s)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        s <= newRating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-700 ml-2">
                  {newRating} Star Rating
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Review Headline *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Absolutely loved the finish and timely delivery"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Full Comment *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Enter customer feedback details..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
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
                Publish Review
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
