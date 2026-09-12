import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Plus,
  Trash2,
  Check,
  X,
  Pencil,
  Home,
  Briefcase,
  Building,
  Gift,
  AlertTriangle,
  Info,
  Sparkles,
  Phone,
  User,
  Navigation,
  FileText,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  useAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useSetDefaultAddressMutation,
  useDeleteAddressMutation,
} from "@/hooks/useAddressesQuery";
import { calculateCourierLengths, validateAddress } from "@/api/addresses";

const INITIAL_FORM_STATE = {
  fullName: "",
  phone: "",
  houseNumber: "",
  building: "",
  floor: "",
  area: "",
  landmark: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  addressType: "home", // "home" | "work" | "other"
  isDefault: false,
  isGift: false,
  deliveryInstructions: "",
};

export const ProfileAddressesTab = React.memo(function ProfileAddressesTab() {
  const { data: addressData, isLoading, isError, refetch } = useAddressesQuery();
  const createMutation = useCreateAddressMutation();
  const updateMutation = useUpdateAddressMutation();
  const setDefaultMutation = useSetDefaultAddressMutation();
  const deleteMutation = useDeleteAddressMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState(INITIAL_FORM_STATE);
  const [clientErrors, setClientErrors] = useState({});
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const defaultAddress = addressData?.defaultAddress || null;
  const nonDefaultAddresses = addressData?.addresses || [];
  const totalCount = addressData?.count ?? (defaultAddress ? 1 : 0) + nonDefaultAddresses.length;

  // Real-time calculation of courier length for the modal form
  const courierStats = useMemo(() => {
    return calculateCourierLengths(addressForm);
  }, [addressForm]);

  // Lock body scroll and handle Escape key when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e) => {
        if (e.key === "Escape") setIsModalOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isModalOpen]);

  const handleOpenAdd = () => {
    setEditingAddressId(null);
    setAddressForm({
      ...INITIAL_FORM_STATE,
      // If there are no saved addresses yet, default to true
      isDefault: totalCount === 0,
    });
    setClientErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addr) => {
    setEditingAddressId(addr._id || addr.id);
    setAddressForm({
      fullName: addr.fullName || "",
      phone: addr.phone || "",
      houseNumber: addr.houseNumber || "",
      building: addr.building || "",
      floor: addr.floor || "",
      area: addr.area || "",
      landmark: addr.landmark || "",
      addressLine1: addr.addressLine1 || "",
      addressLine2: addr.addressLine2 || "",
      city: addr.city || "",
      state: addr.state || "",
      postalCode: addr.postalCode || "",
      country: addr.country || "India",
      addressType: addr.addressType || "home",
      isDefault: Boolean(addr.isDefault),
      isGift: Boolean(addr.isGift),
      deliveryInstructions: addr.deliveryInstructions || "",
    });
    setClientErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteMutation.mutateAsync(id);
      setDeleteConfirmId(null);
    } catch {
      // Handled in mutation onError
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultMutation.mutateAsync(id);
    } catch {
      // Handled in mutation onError
    }
  };

  const handlePincodeChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, "").slice(0, 6);
    setAddressForm((prev) => ({ ...prev, postalCode: rawVal }));

    // Instant auto-fill suggestions for well-known Indian postal zones
    if (rawVal.length === 6) {
      if (rawVal.startsWith("40")) {
        setAddressForm((prev) => ({ ...prev, postalCode: rawVal, city: prev.city || "Mumbai", state: prev.state || "Maharashtra" }));
      } else if (rawVal.startsWith("11")) {
        setAddressForm((prev) => ({ ...prev, postalCode: rawVal, city: prev.city || "New Delhi", state: prev.state || "Delhi" }));
      } else if (rawVal.startsWith("56")) {
        setAddressForm((prev) => ({ ...prev, postalCode: rawVal, city: prev.city || "Bengaluru", state: prev.state || "Karnataka" }));
      } else if (rawVal.startsWith("38")) {
        setAddressForm((prev) => ({ ...prev, postalCode: rawVal, city: prev.city || "Ahmedabad", state: prev.state || "Gujarat" }));
      } else if (rawVal.startsWith("60")) {
        setAddressForm((prev) => ({ ...prev, postalCode: rawVal, city: prev.city || "Chennai", state: prev.state || "Tamil Nadu" }));
      } else if (rawVal.startsWith("70")) {
        setAddressForm((prev) => ({ ...prev, postalCode: rawVal, city: prev.city || "Kolkata", state: prev.state || "West Bengal" }));
      }
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();

    // Client-side validation
    const validation = validateAddress(addressForm);
    if (!validation.isValid) {
      setClientErrors(validation.errors);
      const firstError = Object.values(validation.errors)[0];
      toast.error(firstError);
      return;
    }

    setClientErrors({});

    try {
      if (editingAddressId) {
        await updateMutation.mutateAsync({
          id: editingAddressId,
          data: addressForm,
        });
      } else {
        await createMutation.mutateAsync(addressForm);
      }
      setIsModalOpen(false);
      setEditingAddressId(null);
      setAddressForm(INITIAL_FORM_STATE);
    } catch (err) {
      // If backend returns field-level validation errors
      if (err.errors && Array.isArray(err.errors)) {
        const mappedErrors = {};
        err.errors.forEach((e) => {
          if (e.field) mappedErrors[e.field] = e.message;
        });
        setClientErrors(mappedErrors);
      }
    }
  };

  const renderAddressCard = (addr, isPrimaryDefault = false) => {
    const fullStreetLine = [
      addr.houseNumber,
      addr.building,
      addr.floor ? `Floor ${addr.floor}` : null,
      addr.addressLine1,
      addr.addressLine2,
      addr.area,
      addr.landmark ? `Near ${addr.landmark}` : null,
    ]
      .filter(Boolean)
      .join(", ");

    const typeIcons = {
      home: <Home size={13} className="text-blue-500" />,
      work: <Briefcase size={13} className="text-amber-500" />,
      other: <Building size={13} className="text-purple-500" />,
    };

    const isPendingDelete = deleteConfirmId === (addr._id || addr.id);

    return (
      <div
        key={addr._id || addr.id}
        className={cn(
          "p-5 sm:p-6 rounded-3xl border transition-all duration-200 relative flex flex-col justify-between shadow-xs",
          isPrimaryDefault
            ? "border-accent/40 bg-gradient-to-br from-orange-50/50 via-white to-white ring-2 ring-accent/10"
            : "border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-md"
        )}
      >
        <div>
          {/* Top Bar: Recipient & Badges */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-poppins font-bold text-sm sm:text-base text-slate-900 flex items-center gap-1.5">
                <MapPin
                  size={16}
                  className={isPrimaryDefault ? "text-accent fill-accent/15" : "text-slate-400"}
                />
                {addr.fullName}
              </span>

              {/* Address Type Badge */}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-poppins font-semibold capitalize bg-slate-100 text-slate-600 border border-slate-200">
                {typeIcons[addr.addressType] || typeIcons.home}
                <span>{addr.addressType || "Home"}</span>
              </span>

              {/* Gift Badge */}
              {addr.isGift && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-poppins font-bold bg-pink-50 text-pink-600 border border-pink-200">
                  <Gift size={11} />
                  <span>Gift Address</span>
                </span>
              )}
            </div>

            {/* Default Badge */}
            {isPrimaryDefault && (
              <span className="text-[10px] font-poppins font-bold uppercase tracking-wider bg-accent text-white px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                <Check size={11} strokeWidth={3} />
                <span>Default</span>
              </span>
            )}
          </div>

          {/* Contact Details */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 font-inter mb-2">
            <Phone size={13} className="text-slate-400" />
            <span>+91 {addr.phone}</span>
          </div>

          {/* Full Street Address */}
          <p className="text-xs text-slate-600 font-inter leading-relaxed mb-1">
            {fullStreetLine}
          </p>

          <p className="text-xs font-semibold text-slate-800 font-inter">
            {addr.city}, {addr.state} -{" "}
            <span className="font-mono font-bold text-accent">{addr.postalCode}</span>
            {addr.country && `, ${addr.country}`}
          </p>

          {/* Delivery Instructions */}
          {addr.deliveryInstructions && (
            <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 font-inter flex items-start gap-1.5">
              <FileText size={13} className="text-slate-400 mt-0.5 flex-shrink-0" />
              <span>
                <strong className="text-slate-700">Instructions:</strong> {addr.deliveryInstructions}
              </span>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            {!isPrimaryDefault ? (
              <button
                type="button"
                onClick={() => handleSetDefault(addr._id || addr.id)}
                disabled={setDefaultMutation.isPending}
                className="text-xs font-poppins font-bold text-accent hover:underline cursor-pointer disabled:opacity-50"
              >
                Set as Default
              </button>
            ) : (
              <span className="text-xs font-poppins font-bold text-emerald-600 flex items-center gap-1">
                <Check size={13} strokeWidth={3} /> Primary Shipping Hub
              </span>
            )}

            {/* Edit Address Button */}
            <button
              type="button"
              onClick={() => handleOpenEdit(addr)}
              className="inline-flex items-center gap-1 text-xs font-poppins font-semibold text-slate-600 hover:text-accent cursor-pointer transition-colors"
            >
              <Pencil size={12} />
              <span>Edit</span>
            </button>
          </div>

          {/* Delete confirmation or trash button */}
          {isPendingDelete ? (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-rose-600 font-bold">Delete?</span>
              <button
                type="button"
                onClick={() => handleDelete(addr._id || addr.id)}
                className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold rounded-lg cursor-pointer"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold rounded-lg cursor-pointer"
              >
                No
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setDeleteConfirmId(addr._id || addr.id)}
              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
              aria-label="Delete address"
              title="Delete address"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
      {/* Header */}
      <div className="border-b border-slate-100 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-poppins font-black text-xl text-slate-900 tracking-tight">
              Saved Delivery Addresses
            </h2>
            <span className="text-xs font-bold font-poppins px-2.5 py-0.5 rounded-full bg-accent/10 text-accent">
              {totalCount} {totalCount === 1 ? "Address" : "Addresses"}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-inter mt-1">
            Addresses are scoped to your storefront with automatic carrier-compliant street length verification.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-accent hover:bg-accent-hover text-white font-poppins text-xs font-bold transition-all shadow-md shadow-accent/20 cursor-pointer self-start sm:self-auto active:scale-95"
        >
          <Plus size={15} strokeWidth={2.5} />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="p-6 rounded-3xl border border-slate-200 bg-slate-50/50 animate-pulse space-y-4"
            >
              <div className="h-4 bg-slate-200 rounded-md w-1/3" />
              <div className="h-3 bg-slate-200 rounded-md w-1/2" />
              <div className="h-3 bg-slate-200 rounded-md w-full" />
              <div className="h-3 bg-slate-200 rounded-md w-2/3" />
            </div>
          ))}
        </div>
      )}

      {/* Error Banner */}
      {!isLoading && isError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-inter flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} />
            <span>Could not load addresses from server.</span>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-3 py-1 bg-rose-600 text-white rounded-lg font-bold text-[11px] cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !defaultAddress && nonDefaultAddresses.length === 0 && (
        <div className="text-center py-12 px-4 max-w-md mx-auto space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 text-accent mx-auto flex items-center justify-center">
            <MapPin size={28} />
          </div>
          <h3 className="font-poppins font-bold text-base text-slate-900">
            No saved addresses found
          </h3>
          <p className="text-xs text-slate-500 font-inter leading-relaxed">
            Add your primary warehouse, retail shop, or residence address to enable fast, single-click checkout.
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="mt-2 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-accent text-white text-xs font-bold shadow-md cursor-pointer hover:bg-accent-hover transition-all"
          >
            <Plus size={14} />
            <span>Add Your First Address</span>
          </button>
        </div>
      )}

      {/* Addresses Listing */}
      {!isLoading && (defaultAddress || nonDefaultAddresses.length > 0) && (
        <div className="space-y-6">
          {/* 1. Default Primary Address Banner & Card */}
          {defaultAddress && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-poppins font-bold text-slate-700">
                <Sparkles size={14} className="text-accent" />
                <span>Primary Default Destination</span>
              </div>
              <div className="grid grid-cols-1">
                {renderAddressCard(defaultAddress, true)}
              </div>
            </div>
          )}

          {/* 2. Other Saved Addresses */}
          {nonDefaultAddresses.length > 0 && (
            <div className="space-y-3">
              {defaultAddress && (
                <div className="text-xs font-poppins font-bold text-slate-500 pt-2">
                  Additional Delivery Locations ({nonDefaultAddresses.length})
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nonDefaultAddresses.map((addr) => renderAddressCard(addr, false))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Modal for Adding / Editing Address (Portal to document.body) ── */}
      {isModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-sm transition-all duration-200 animate-fadeIn"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsModalOpen(false);
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="address-modal-title"
          >
            <div className="relative bg-white rounded-3xl p-5 sm:p-7 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-fadeIn font-poppins">
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all hover:rotate-90 cursor-pointer"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>

              <div className="mb-5 pr-8">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-accent/10 text-accent">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h3
                      id="address-modal-title"
                      className="font-black text-lg text-slate-900 tracking-tight"
                    >
                      {editingAddressId ? "Edit Delivery Address" : "Add New Delivery Address"}
                    </h3>
                    <p className="text-xs text-slate-500 font-inter mt-0.5">
                      Ensure all fields match courier dispatch rules (combined street ≤ 190 characters).
                    </p>
                  </div>
                </div>
              </div>

              {/* Courier Length Live Gauge */}
              <div
                className={cn(
                  "p-3 rounded-2xl border mb-4 transition-all text-xs font-inter",
                  courierStats.isTooLong
                    ? "bg-rose-50 border-rose-300 text-rose-800"
                    : courierStats.combinedLength > 160
                    ? "bg-amber-50 border-amber-300 text-amber-800"
                    : "bg-slate-50 border-slate-200 text-slate-600"
                )}
              >
                <div className="flex items-center justify-between mb-1.5 font-poppins font-bold text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <Navigation size={13} />
                    <span>Courier Address Character Gauge:</span>
                  </span>
                  <span
                    className={cn(
                      courierStats.isTooLong ? "text-rose-600 font-black" : "text-slate-700"
                    )}
                  >
                    {courierStats.combinedLength} / {courierStats.maxLength} chars
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-300 rounded-full",
                      courierStats.isTooLong
                        ? "bg-rose-600"
                        : courierStats.combinedLength > 160
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    )}
                    style={{
                      width: `${Math.min(100, (courierStats.combinedLength / courierStats.maxLength) * 100)}%`,
                    }}
                  />
                </div>

                {courierStats.isTooLong && (
                  <p className="text-[11px] font-bold text-rose-600 mt-1.5 flex items-center gap-1">
                    <AlertTriangle size={12} />
                    <span>
                      Exceeds 190-character courier limit. Please shorten street, building, or landmark details.
                    </span>
                  </p>
                )}
              </div>

              <form onSubmit={handleSaveAddress} className="space-y-4">
                {/* Section 1: Contact & Recipient */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-poppins font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Recipient / Contact Person <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <User size={15} className="absolute left-3 text-slate-400" />
                      <input
                        type="text"
                        placeholder="e.g. Rahul Sharma"
                        value={addressForm.fullName}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, fullName: e.target.value })
                        }
                        className={cn(
                          "w-full h-11 pl-9 pr-3 border rounded-xl text-xs sm:text-sm font-inter outline-none transition-all",
                          clientErrors.fullName
                            ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                            : "border-slate-200 focus:border-accent"
                        )}
                        required
                      />
                    </div>
                    {clientErrors.fullName && (
                      <span className="text-[10px] text-rose-500 font-bold mt-1 block">
                        {clientErrors.fullName}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-poppins font-bold text-slate-700 uppercase tracking-wider mb-1">
                      10-Digit Mobile Phone <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-xs font-bold text-slate-400 font-inter">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="9876543210"
                        value={addressForm.phone}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                          })
                        }
                        className={cn(
                          "w-full h-11 pl-11 pr-3 border rounded-xl text-xs sm:text-sm font-inter outline-none transition-all font-mono",
                          clientErrors.phone
                            ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                            : "border-slate-200 focus:border-accent"
                        )}
                        required
                      />
                    </div>
                    {clientErrors.phone && (
                      <span className="text-[10px] text-rose-500 font-bold mt-1 block">
                        {clientErrors.phone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Section 2: Building Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-poppins font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Flat / House No. <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 12-A / Plot 42"
                      value={addressForm.houseNumber}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, houseNumber: e.target.value })
                      }
                      className={cn(
                        "w-full h-11 px-3 border rounded-xl text-xs sm:text-sm font-inter outline-none transition-all",
                        clientErrors.houseNumber ? "border-rose-400" : "border-slate-200 focus:border-accent"
                      )}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-poppins font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Building / Apartment
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sunshine Apartments"
                      value={addressForm.building}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, building: e.target.value })
                      }
                      className="w-full h-11 px-3 border border-slate-200 rounded-xl text-xs sm:text-sm font-inter outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-poppins font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Floor / Wing
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 3rd Floor, B-Wing"
                      value={addressForm.floor}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, floor: e.target.value })
                      }
                      className="w-full h-11 px-3 border border-slate-200 rounded-xl text-xs sm:text-sm font-inter outline-none focus:border-accent"
                    />
                  </div>
                </div>

                {/* Section 3: Street & Area */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-poppins font-bold text-slate-700 uppercase tracking-wider">
                      Address Line 1 (Street/Road) <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400">Min 10 characters</span>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Linking Road, opposite XYZ Mall"
                    value={addressForm.addressLine1}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, addressLine1: e.target.value })
                    }
                    className={cn(
                      "w-full h-11 px-3 border rounded-xl text-xs sm:text-sm font-inter outline-none transition-all",
                      clientErrors.addressLine1
                        ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                        : "border-slate-200 focus:border-accent"
                    )}
                    required
                  />
                  {clientErrors.addressLine1 && (
                    <span className="text-[10px] text-rose-500 font-bold mt-1 block">
                      {clientErrors.addressLine1}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-poppins font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Lane 2"
                      value={addressForm.addressLine2}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, addressLine2: e.target.value })
                      }
                      className="w-full h-11 px-3 border border-slate-200 rounded-xl text-xs font-inter outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-poppins font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Area / Locality
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Andheri West"
                      value={addressForm.area}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, area: e.target.value })
                      }
                      className="w-full h-11 px-3 border border-slate-200 rounded-xl text-xs font-inter outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-poppins font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Landmark
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Near Metro Station"
                      value={addressForm.landmark}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, landmark: e.target.value })
                      }
                      className="w-full h-11 px-3 border border-slate-200 rounded-xl text-xs font-inter outline-none focus:border-accent"
                    />
                  </div>
                </div>

                {/* Section 4: PIN Code, City, State */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-poppins font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Postal PIN Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="e.g. 400053"
                      value={addressForm.postalCode}
                      onChange={handlePincodeChange}
                      className={cn(
                        "w-full h-11 px-3 border rounded-xl text-xs sm:text-sm font-inter outline-none transition-all font-mono",
                        clientErrors.postalCode
                          ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                          : "border-slate-200 focus:border-accent"
                      )}
                      required
                    />
                    {clientErrors.postalCode && (
                      <span className="text-[10px] text-rose-500 font-bold mt-1 block">
                        {clientErrors.postalCode}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-poppins font-bold text-slate-700 uppercase tracking-wider mb-1">
                      City <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai"
                      value={addressForm.city}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, city: e.target.value })
                      }
                      className={cn(
                        "w-full h-11 px-3 border rounded-xl text-xs font-inter outline-none",
                        clientErrors.city ? "border-rose-400" : "border-slate-200 focus:border-accent"
                      )}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-poppins font-bold text-slate-700 uppercase tracking-wider mb-1">
                      State <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Maharashtra"
                      value={addressForm.state}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, state: e.target.value })
                      }
                      className={cn(
                        "w-full h-11 px-3 border rounded-xl text-xs font-inter outline-none",
                        clientErrors.state ? "border-rose-400" : "border-slate-200 focus:border-accent"
                      )}
                      required
                    />
                  </div>
                </div>

                {/* Section 5: Address Type Selector */}
                <div>
                  <label className="block text-[11px] font-poppins font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Address Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { type: "home", label: "Home", icon: Home },
                      { type: "work", label: "Work / Office", icon: Briefcase },
                      { type: "other", label: "Other / Warehouse", icon: Building },
                    ].map(({ type, label, icon: Icon }) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setAddressForm({ ...addressForm, addressType: type })}
                        className={cn(
                          "flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                          addressForm.addressType === type
                            ? "bg-accent/10 border-accent text-accent shadow-xs"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        )}
                      >
                        <Icon size={14} />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 6: Delivery Instructions */}
                <div>
                  <label className="block text-[11px] font-poppins font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Call before delivery, Leave package at security gate"
                    value={addressForm.deliveryInstructions}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, deliveryInstructions: e.target.value })
                    }
                    className="w-full h-11 px-3 border border-slate-200 rounded-xl text-xs font-inter outline-none focus:border-accent"
                  />
                </div>

                {/* Section 7: Toggles (Default, Gift) */}
                <div className="pt-2 flex flex-col sm:flex-row gap-4 border-t border-slate-100">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={addressForm.isDefault}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, isDefault: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-accent focus:ring-accent cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-800">
                      Set as default delivery address
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={addressForm.isGift}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, isGift: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-accent focus:ring-accent cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-800">
                      This is a gift delivery address
                    </span>
                  </label>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      createMutation.isPending ||
                      updateMutation.isPending ||
                      courierStats.isTooLong
                    }
                    className={cn(
                      "px-6 py-2.5 rounded-2xl bg-accent text-white font-poppins text-xs font-bold shadow-md shadow-accent/20 cursor-pointer transition-all active:scale-95 flex items-center gap-2",
                      (createMutation.isPending ||
                        updateMutation.isPending ||
                        courierStats.isTooLong) &&
                        "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {(createMutation.isPending || updateMutation.isPending) && (
                      <Loader2 size={14} className="animate-spin" />
                    )}
                    <span>
                      {editingAddressId ? "Update Address" : "Save Delivery Address"}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
});

export default ProfileAddressesTab;
