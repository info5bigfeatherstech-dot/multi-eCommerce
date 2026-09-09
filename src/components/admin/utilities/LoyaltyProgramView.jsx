import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateTierPerks } from "@/store/slices/adminUtilitiesSlice";
import {
  Crown,
  Award,
  Star,
  Users,
  DollarSign,
  Gift,
  CheckCircle2,
  Edit3,
  Sparkles,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

export default function LoyaltyProgramView() {
  const dispatch = useAppDispatch();
  const tiers = useAppSelector((state) => state.adminUtilities?.loyaltyTiers || []);

  const [editTier, setEditTier] = useState(null);
  const [perksInput, setPerksInput] = useState([]);
  const [newPerkText, setNewPerkText] = useState("");

  const totalMembers = tiers.reduce((acc, t) => acc + (t.activeMembers || 0), 0);

  const handleOpenEdit = (tier) => {
    setEditTier(tier);
    setPerksInput([...tier.perks]);
    setNewPerkText("");
  };

  const handleAddPerk = () => {
    if (!newPerkText.trim()) return;
    setPerksInput([...perksInput, newPerkText.trim()]);
    setNewPerkText("");
  };

  const handleRemovePerk = (idx) => {
    setPerksInput(perksInput.filter((_, i) => i !== idx));
  };

  const handleSavePerks = (e) => {
    e.preventDefault();
    if (!editTier) return;
    dispatch(updateTierPerks({ tierId: editTier.id, perks: perksInput }));
    toast.success(`Perks updated for ${editTier.name}.`);
    setEditTier(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-800 border border-yellow-200 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-yellow-600" />
              Customer Retention & Rewards
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-inter">Tiered Loyalty Club</span>
          </div>
          <h1 className="text-2xl font-poppins font-bold text-slate-900 mt-1.5">
            Loyalty Points and Membership Manage
          </h1>
          <p className="text-sm text-slate-500 font-inter mt-1">
            Configure VIP customer loyalty tiers, point accrual multipliers, redemption thresholds, and exclusive membership perks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
            Conversion: <span className="font-bold text-slate-900">1 Point = ₹1.00</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Enrolled Members</span>
            <div className="w-8 h-8 rounded-lg bg-yellow-50 text-yellow-700 flex items-center justify-center">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">{totalMembers.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-1">Active reward account holders</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Diamond VIP Share</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">410 Members</p>
          <p className="text-xs text-slate-400 mt-1">Annual spend &gt; ₹50,000</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Points Issued This Month</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">284,500 pts</p>
          <p className="text-xs text-slate-400 mt-1">₹2.84L redemption liability</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Repeat Purchase Lift</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">+42.6%</p>
          <p className="text-xs text-slate-400 mt-1">Among loyalty members vs guests</p>
        </div>
      </div>

      {/* Tier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${tier.badgeColor}`}>
                  {tier.name}
                </span>
                <button
                  onClick={() => handleOpenEdit(tier)}
                  className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Edit Tier Perks"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              <div className="my-4">
                <p className="text-xs text-slate-400 font-inter">Annual Spend Threshold</p>
                <p className="text-xl font-poppins font-bold text-slate-900">
                  {tier.minSpendAnnual === 0 ? "Entry Free" : `₹${tier.minSpendAnnual.toLocaleString()} / year`}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-inter mb-4">
                <span className="text-slate-500 block font-medium">Points Accrual</span>
                <span className="text-slate-900 font-bold block mt-0.5">{tier.pointsMultiplier}</span>
                <span className="text-slate-400 block mt-1">{tier.activeMembers.toLocaleString()} active members</span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Exclusive Perks</span>
                <ul className="space-y-1.5">
                  {tier.perks.map((perk, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-600 font-inter">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => handleOpenEdit(tier)}
                className="w-full py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Configure Benefits
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Tier Perks Modal */}
      {editTier && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSavePerks}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-yellow-50 text-yellow-700">
                  <Crown className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-poppins font-bold text-slate-900 text-base">Edit {editTier.name} Perks</h3>
                  <p className="text-xs text-slate-400">{editTier.activeMembers} enrolled members</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditTier(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 my-5 text-sm font-inter">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 block">Current Benefits</label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {perksInput.map((perk, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    >
                      <span className="text-slate-700">{perk}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePerk(idx)}
                        className="text-rose-500 hover:text-rose-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add new perk (e.g. 10% Extra Points)..."
                  value={newPerkText}
                  onChange={(e) => setNewPerkText(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddPerk}
                  className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditTier(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow"
              >
                Save Tier Benefits
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
