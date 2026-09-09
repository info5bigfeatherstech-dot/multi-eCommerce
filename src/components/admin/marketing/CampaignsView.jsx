import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addCampaign,
  toggleCampaignStatus,
} from "@/store/slices/adminMarketingSlice";
import {
  Megaphone,
  Search,
  PlusCircle,
  Download,
  Calendar,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  TrendingUp,
  DollarSign,
  Layers,
  Sparkles,
  SlidersHorizontal,
  Target,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";

export default function CampaignsView() {
  const dispatch = useAppDispatch();
  const campaigns = useAppSelector(
    (state) => state.adminMarketing?.campaigns || []
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Campaign Form
  const [newName, setNewName] = useState("");
  const [newObjective, setNewObjective] = useState("Wholesale Bulk Orders");
  const [newBudget, setNewBudget] = useState(100000);
  const [newStartDate, setNewStartDate] = useState("2026-09-10");
  const [newEndDate, setNewEndDate] = useState("2026-10-10");
  const [selectedChannels, setSelectedChannels] = useState([
    "WhatsApp",
    "Email",
  ]);

  const channelOptions = [
    "WhatsApp",
    "Email",
    "Push Notification",
    "SMS",
    "Web Banner",
  ];

  const handleChannelToggle = (channel) => {
    if (selectedChannels.includes(channel)) {
      if (selectedChannels.length === 1) {
        toast.error("At least one marketing channel must be selected.");
        return;
      }
      setSelectedChannels(selectedChannels.filter((c) => c !== channel));
    } else {
      setSelectedChannels([...selectedChannels, channel]);
    }
  };

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.objective.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.channels.some((ch) =>
          ch.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchStatus =
        selectedStatus === "All" || c.status === selectedStatus;
      return matchSearch && matchStatus;
    });
  }, [campaigns, searchTerm, selectedStatus]);

  const totalSpend = useMemo(() => {
    return campaigns.reduce((sum, c) => sum + (c.spend || 0), 0);
  }, [campaigns]);

  const totalRevenue = useMemo(() => {
    return campaigns.reduce((sum, c) => sum + (c.revenueGenerated || 0), 0);
  }, [campaigns]);

  const blendedRoas = useMemo(() => {
    if (totalSpend === 0) return 0;
    return (totalRevenue / totalSpend).toFixed(2);
  }, [totalRevenue, totalSpend]);

  const activeCount = useMemo(() => {
    return campaigns.filter((c) => c.status === "Active").length;
  }, [campaigns]);

  const handleToggle = (id, name, currentStatus) => {
    dispatch(toggleCampaignStatus(id));
    if (currentStatus === "Active") {
      toast.warning(`Campaign "${name}" paused.`);
    } else {
      toast.success(`Campaign "${name}" resumed.`);
    }
  };

  const handleCreateCampaign = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newBudget) {
      toast.error("Campaign name and budget are required.");
      return;
    }

    const newCampObj = {
      id: `CMP-${Date.now().toString().slice(-4)}`,
      name: newName.trim(),
      objective: newObjective,
      channels: selectedChannels,
      budget: parseFloat(newBudget),
      spend: 0,
      revenueGenerated: 0,
      roas: 0,
      status: "Active",
      startDate: newStartDate,
      endDate: newEndDate,
    };

    dispatch(addCampaign(newCampObj));
    toast.success(`Marketing campaign "${newName}" created successfully!`);
    setIsAddModalOpen(false);
    setNewName("");
    setNewBudget(100000);
  };

  const handleExportCSV = () => {
    const headers = [
      "Campaign ID",
      "Campaign Name",
      "Objective",
      "Channels",
      "Budget (INR)",
      "Spend (INR)",
      "Revenue Generated (INR)",
      "ROAS Multiplier",
      "Status",
      "Start Date",
      "End Date",
    ];

    const rows = filteredCampaigns.map((c) => [
      c.id,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.objective.replace(/"/g, '""')}"`,
      `"${c.channels.join(", ")}"`,
      c.budget,
      c.spend,
      c.revenueGenerated,
      `${c.roas}x`,
      c.status,
      c.startDate,
      c.endDate,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `marketing_campaigns_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Marketing campaigns exported as CSV.");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Marketing Campaigns & Performance
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200">
              <Megaphone className="h-3 w-3" /> Growth Engine
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Create, launch, and monitor omnichannel promotional campaigns across WhatsApp, Email, Push Notifications, and Web.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="h-4 w-4 text-slate-500" />
            Export CSV
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            Create Campaign
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Campaigns
            </span>
            <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
              <Target className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            {campaigns.length}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {activeCount} live in execution
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Campaign Spend
            </span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            ₹{(totalSpend / 1000).toFixed(1)}k
          </div>
          <p className="mt-1 text-xs text-slate-500">Dispatched across all channels</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Attributed GMV Revenue
            </span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-emerald-600">
            ₹{(totalRevenue / 100000).toFixed(1)} Lakhs
          </div>
          <p className="mt-1 text-xs text-slate-500">Realized customer orders</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Blended ROAS
            </span>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-purple-600">
            {blendedRoas}x
          </div>
          <p className="mt-1 text-xs text-slate-500">Return on marketing investment</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search campaign name, objective, or channel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SlidersHorizontal className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-500">Status:</span>
          {["All", "Active", "Completed", "Paused"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedStatus === st
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/75 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Campaign Name & ID</th>
                <th className="px-6 py-3.5">Objective</th>
                <th className="px-6 py-3.5">Channels</th>
                <th className="px-6 py-3.5 text-right">Spend / Budget</th>
                <th className="px-6 py-3.5 text-right">Revenue Generated</th>
                <th className="px-6 py-3.5 text-center">ROAS</th>
                <th className="px-6 py-3.5">Schedule</th>
                <th className="px-6 py-3.5 text-center">Status</th>
                <th className="px-6 py-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No marketing campaigns found matching your search.
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((camp) => (
                  <tr
                    key={camp.id}
                    className="hover:bg-slate-50/75 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-slate-900">
                          {camp.name}
                        </div>
                        <div className="font-mono text-xs text-indigo-600 mt-0.5">
                          {camp.id}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                        {camp.objective}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {camp.channels.map((ch) => (
                          <span
                            key={ch}
                            className="rounded-full bg-indigo-50 border border-indigo-200 px-2 py-0.2 text-[10px] font-semibold text-indigo-700"
                          >
                            {ch}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="font-bold text-slate-900">
                        ₹{camp.spend.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        of ₹{camp.budget.toLocaleString()}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right font-mono font-bold text-emerald-600">
                      ₹{camp.revenueGenerated.toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-0.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          camp.roas >= 5
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : camp.roas >= 3
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {camp.roas > 0 ? `${camp.roas}x` : "—"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        {camp.startDate} to {camp.endDate}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          camp.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : camp.status === "Completed"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {camp.status === "Active" ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <PauseCircle className="h-3 w-3" />
                        )}
                        {camp.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      {camp.status !== "Completed" && (
                        <button
                          onClick={() =>
                            handleToggle(camp.id, camp.name, camp.status)
                          }
                          className={`p-1.5 rounded-lg border transition-colors ${
                            camp.status === "Active"
                              ? "border-amber-200 text-amber-600 hover:bg-amber-50"
                              : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                          }`}
                          title={
                            camp.status === "Active"
                              ? "Pause Campaign"
                              : "Resume Campaign"
                          }
                        >
                          {camp.status === "Active" ? (
                            <PauseCircle className="h-4 w-4" />
                          ) : (
                            <PlayCircle className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Campaign Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form
            onSubmit={handleCreateCampaign}
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                Create Marketing Campaign
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
                Campaign Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Diwali Super Wholesale Bonanza 2026"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Primary Objective
                </label>
                <Select value={newObjective} onValueChange={setNewObjective}>
                  <SelectTrigger className="w-full text-xs bg-white border-slate-300">
                    <SelectValue placeholder="Primary Objective" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Wholesale Bulk Orders">Wholesale Bulk Orders</SelectItem>
                    <SelectItem value="Consumer Retail Sales">Consumer Retail Sales</SelectItem>
                    <SelectItem value="Partner Acquisition">Dropship / Franchise Acquisition</SelectItem>
                    <SelectItem value="Cart Recovery">Cart Abandonment Lift</SelectItem>
                    <SelectItem value="Clearance">Inventory Clearance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Total Budget Allocation (₹) *
                </label>
                <input
                  type="number"
                  step="5000"
                  required
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                Active Marketing Channels
              </label>
              <div className="flex flex-wrap gap-2">
                {channelOptions.map((ch) => {
                  const isSelected = selectedChannels.includes(ch);
                  return (
                    <button
                      type="button"
                      key={ch}
                      onClick={() => handleChannelToggle(ch)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        isSelected
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                          : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {ch} {isSelected && "✓"}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={newStartDate}
                  onChange={(e) => setNewStartDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
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
                Deploy Campaign
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
