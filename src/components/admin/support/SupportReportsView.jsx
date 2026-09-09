import React, { useState, useMemo } from "react";
import { useAppSelector } from "../../../store/hooks";
import {
  BarChart3,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  TrendingUp,
  Award,
  Users,
  MessageCircle,
  Mail,
  Phone,
  Globe,
  Sparkles,
  AlertTriangle,
  Star,
  LifeBuoy,
} from "lucide-react";
import { toast } from "sonner";

const SupportReportsView = () => {
  const tickets = useAppSelector((state) => state.adminSupport?.tickets || []);
  const queries = useAppSelector((state) => state.adminSupport?.queries || []);
  const complaints = useAppSelector(
    (state) => state.adminSupport?.complaints || []
  );
  const staffMembers = useAppSelector(
    (state) => state.adminStaff?.staffMembers || []
  );

  const [dateRange, setDateRange] = useState("all");

  // Metrics Calculations
  const totalTickets = tickets.length;
  const resolvedTickets = tickets.filter(
    (t) => t.status === "Resolved" || t.status === "Closed"
  ).length;
  const resolutionRate =
    totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 100;

  // Channel Breakdown
  const channelStats = useMemo(() => {
    const map = {};
    tickets.forEach((t) => {
      map[t.channel] = (map[t.channel] || 0) + 1;
    });

    const channels = ["Web Portal", "Email", "WhatsApp", "Phone"];
    return channels.map((ch) => {
      const count = map[ch] || 0;
      const percentage =
        totalTickets > 0 ? Math.round((count / totalTickets) * 100) : 0;
      return { channel: ch, count, percentage };
    });
  }, [tickets, totalTickets]);

  // Category Breakdown
  const categoryStats = useMemo(() => {
    const map = {};
    tickets.forEach((t) => {
      map[t.category] = (map[t.category] || 0) + 1;
    });

    return Object.entries(map).map(([category, count]) => ({
      category,
      count,
      percentage: totalTickets > 0 ? Math.round((count / totalTickets) * 100) : 0,
    }));
  }, [tickets, totalTickets]);

  // Agent Performance Simulation
  const agentLeaderboard = useMemo(() => {
    const agentsMap = {
      "Pooja Hegde": { role: "Customer Support Lead", tickets: 2, csat: 4.9, avgTime: "1.4 hrs", adherence: "99%" },
      "Sameer Kulkarni": { role: "Inventory Specialist", tickets: 1, csat: 4.8, avgTime: "2.1 hrs", adherence: "96%" },
      "Vikramaditya Rao": { role: "Super Admin", tickets: 1, csat: 5.0, avgTime: "1.8 hrs", adherence: "100%" },
      "Neha Sharma": { role: "Store Manager", tickets: 1, csat: 4.7, avgTime: "3.2 hrs", adherence: "95%" },
    };

    return Object.entries(agentsMap).map(([name, data]) => ({
      name,
      ...data,
    }));
  }, []);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Category / Dimension", "Value", "Metric Context"];
    const rows = [
      ["Total Support Tickets", totalTickets, "All recorded tickets"],
      ["Ticket Resolution Rate", `${resolutionRate}%`, "Resolved and closed share"],
      ["First Contact Resolution (FCR)", "78%", "Resolved without secondary follow-up"],
      ["Average Resolution Time", "2.8 hrs", "Within 4-hour SLA guarantee"],
      ["Average Customer CSAT", "4.8 / 5.0", "Post-support survey rating"],
      ...channelStats.map((c) => [`Channel: ${c.channel}`, c.count, `${c.percentage}% share`]),
      ...categoryStats.map((cat) => [`Category: ${cat.category}`, cat.count, `${cat.percentage}% share`]),
      ...agentLeaderboard.map((a) => [
        `Agent: ${a.name}`,
        `${a.tickets} tickets (${a.csat}★ CSAT)`,
        `Avg Time: ${a.avgTime} | SLA: ${a.adherence}`,
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `support_sla_report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Support SLA report exported to CSV!");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Support Reports & SLA Analytics
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Support performance resolution reports, channel volume distributions, and staff agent benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="text-xs font-medium text-slate-700 bg-transparent focus:outline-none"
            >
              <option value="all">All Time</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export SLA Report
          </button>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Resolution Rate */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Resolution Rate
            </span>
            <div className="text-3xl font-bold text-slate-900 mt-1">
              {resolutionRate}%
            </div>
            <div className="text-xs text-emerald-700 mt-1 font-medium">
              Target benchmark &gt; 90%
            </div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* First Contact Resolution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              First Contact Resolution
            </span>
            <div className="text-3xl font-bold text-slate-900 mt-1">
              78%
            </div>
            <div className="text-xs text-indigo-600 mt-1 font-medium">
              Resolved in initial message
            </div>
          </div>
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Avg Resolution Time */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Avg Resolution Time
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-3xl font-bold text-slate-900">2.8</span>
              <span className="text-xs text-slate-400 font-semibold">hours</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Guaranteed SLA &lt; 4 hours
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-slate-600 border border-slate-100">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Customer CSAT */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Customer CSAT
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-3xl font-bold text-slate-900">4.8</span>
              <span className="text-xs text-slate-400 font-semibold">/ 5.0</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600 border border-amber-100">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Channel Volume & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tickets by Channel (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Ticket Volume by Channel
              </h2>
              <p className="text-xs text-slate-500">
                Inflow distribution across customer contact touchpoints.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {totalTickets} Total
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {channelStats.map((item) => (
              <div key={item.channel} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 flex items-center gap-2">
                    {item.channel === "WhatsApp" ? (
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    ) : item.channel === "Email" ? (
                      <Mail className="w-3.5 h-3.5 text-blue-600" />
                    ) : item.channel === "Phone" ? (
                      <Phone className="w-3.5 h-3.5 text-amber-600" />
                    ) : (
                      <Globe className="w-3.5 h-3.5 text-indigo-600" />
                    )}
                    {item.channel}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px]">
                      {item.count} tickets
                    </span>
                    <span className="font-bold text-slate-900">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick SLA note */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Fastest Channel: <strong>WhatsApp (45 min)</strong></span>
            <span>Highest Volume: <strong>Web Portal (40%)</strong></span>
          </div>
        </div>

        {/* Issue Categories Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Top Grievance & Issue Categories
              </h2>
              <p className="text-xs text-slate-500">
                Frequency and distribution of customer ticket topics.
              </p>
            </div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
              {categoryStats.length} Categories
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Volume</th>
                  <th className="py-2.5 px-3">Share</th>
                  <th className="py-2.5 px-3 text-right">SLA Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {categoryStats.map((cat, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {cat.category}
                    </td>
                    <td className="py-3 px-3">{cat.count}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${cat.percentage}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-slate-700">
                          {cat.percentage}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {cat.category.includes("Refund") || cat.category.includes("Delivery") ? (
                        <span className="inline-block text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          High Priority
                        </span>
                      ) : (
                        <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Normal
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Agent Performance Leaderboard */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Support Agent Performance Leaderboard
              </h2>
              <p className="text-xs text-slate-500">
                Resolution volume, CSAT ratings, and SLA compliance per team member.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
            97% Average SLA Compliance
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                <th className="py-2.5 px-3">Agent Name</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Tickets Solved</th>
                <th className="py-2.5 px-3">Avg Resolution Time</th>
                <th className="py-2.5 px-3">CSAT Score</th>
                <th className="py-2.5 px-3 text-right">SLA Adherence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
              {agentLeaderboard.map((agent) => (
                <tr key={agent.name} className="hover:bg-slate-50/50">
                  <td className="py-3 px-3 font-semibold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                      {agent.name.charAt(0)}
                    </span>
                    <span>{agent.name}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-500">{agent.role}</td>
                  <td className="py-3 px-3 font-bold text-slate-800">
                    {agent.tickets}
                  </td>
                  <td className="py-3 px-3">{agent.avgTime}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1 font-semibold text-slate-800">
                      <span>{agent.csat}</span>
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      {agent.adherence}
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
};

export default SupportReportsView;
