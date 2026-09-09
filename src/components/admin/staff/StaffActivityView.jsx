import React, { useState, useMemo } from "react";
import { useAppSelector } from "../../../store/hooks";
import {
  Activity,
  Search,
  Filter,
  Download,
  ShieldAlert,
  Clock,
  User,
  Globe,
  AlertTriangle,
  Info,
  CheckCircle2,
  Calendar,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../ui/Select";

const StaffActivityView = () => {
  const activityLogs = useAppSelector(
    (state) => state.adminStaff?.activityLogs || []
  );
  const staffMembers = useAppSelector(
    (state) => state.adminStaff?.staffMembers || []
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [staffFilter, setStaffFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all"); // 'today' | '7d' | 'all'

  // Metric counts
  const totalEvents = activityLogs.length;
  const criticalCount = activityLogs.filter((l) => l.severity === "Critical").length;
  const warningCount = activityLogs.filter((l) => l.severity === "Warning").length;
  const uniqueOperators = new Set(activityLogs.map((l) => l.staffName)).size;

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return activityLogs.filter((log) => {
      if (moduleFilter !== "all" && log.module !== moduleFilter) return false;
      if (severityFilter !== "all" && log.severity !== severityFilter) return false;
      if (staffFilter !== "all" && log.staffId !== staffFilter) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchAction = log.action.toLowerCase().includes(query);
        const matchStaff = log.staffName.toLowerCase().includes(query);
        const matchDetails = log.details.toLowerCase().includes(query);
        const matchIp = log.ipAddress.toLowerCase().includes(query);
        const matchModule = log.module.toLowerCase().includes(query);
        return matchAction || matchStaff || matchDetails || matchIp || matchModule;
      }
      return true;
    });
  }, [activityLogs, moduleFilter, severityFilter, staffFilter, searchQuery]);

  // Derived modules list
  const modulesList = useMemo(() => {
    return Array.from(new Set(activityLogs.map((l) => l.module)));
  }, [activityLogs]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "Log ID",
      "Timestamp",
      "Staff Member",
      "Staff ID",
      "Role",
      "Action",
      "Module",
      "Details",
      "IP Address",
      "Location",
      "Severity",
    ];

    const rows = filteredLogs.map((l) => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.staffName}"`,
      l.staffId,
      `"${l.role}"`,
      `"${l.action.replace(/"/g, '""')}"`,
      `"${l.module}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      l.ipAddress,
      `"${l.location}"`,
      l.severity,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `staff_activity_audit_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Activity audit log exported to CSV!");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <Activity className="w-5 h-5 text-indigo-600" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Staff Activity & Audit Trail
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Staff actions and activity monitor across all administrative operations and security events.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-36">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="h-9 text-xs bg-white border-slate-200 shadow-sm">
                <div className="flex items-center gap-1.5 truncate">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <SelectValue placeholder="Date Range" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Logs</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export Audit Trail
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Events */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Logged Events
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {totalEvents}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Immutable security record
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-slate-600 border border-slate-100">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
              Critical Alerts
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {criticalCount}
            </div>
            <div className="text-xs text-rose-600 mt-1 font-medium">
              Suspended logins or deletions
            </div>
          </div>
          <div className="p-3 bg-rose-50 rounded-xl text-rose-600 border border-rose-100">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        {/* Warnings */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Warning Events
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {warningCount}
            </div>
            <div className="text-xs text-amber-700 mt-1 font-medium">
              Permission / price adjustments
            </div>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600 border border-amber-100">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Unique Operators */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Active Staff Operators
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {uniqueOperators}
            </div>
            <div className="text-xs text-indigo-600 mt-1 font-medium">
              Captured in audit history
            </div>
          </div>
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100">
            <User className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search action, staff name, IP, keyword..."
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {/* Operator Filter */}
            <div className="w-40">
              <Select value={staffFilter} onValueChange={setStaffFilter}>
                <SelectTrigger className="h-8 text-xs bg-slate-50 border-slate-200">
                  <div className="flex items-center gap-1.5 truncate">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <SelectValue placeholder="All Staff" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Staff</SelectItem>
                  {staffMembers.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Module Filter */}
            <div className="w-40">
              <Select value={moduleFilter} onValueChange={setModuleFilter}>
                <SelectTrigger className="h-8 text-xs bg-slate-50 border-slate-200">
                  <div className="flex items-center gap-1.5 truncate">
                    <Filter className="w-3.5 h-3.5 text-slate-400" />
                    <SelectValue placeholder="All Modules" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modules</SelectItem>
                  {modulesList.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Severity Filter */}
            <div className="w-36">
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="h-8 text-xs bg-slate-50 border-slate-200">
                  <div className="flex items-center gap-1.5 truncate">
                    <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                    <SelectValue placeholder="All Severities" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="Info">Info</SelectItem>
                  <SelectItem value="Warning">Warning</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <Activity className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-semibold text-slate-700">
              No activity logs match the selected filters
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting search terms or resetting filters to inspect other recorded actions.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Timestamp & ID</th>
                  <th className="py-3 px-4">Staff Operator</th>
                  <th className="py-3 px-4">Action & Module</th>
                  <th className="py-3 px-4">Details / Description</th>
                  <th className="py-3 px-4">Origin / IP</th>
                  <th className="py-3 px-4 text-right">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs text-slate-600">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Timestamp & ID */}
                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      <div className="font-mono text-slate-800 font-medium">
                        {log.timestamp}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        {log.id}
                      </div>
                    </td>

                    {/* Staff Operator */}
                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      <div className="font-semibold text-slate-900">
                        {log.staffName}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[11px]">
                        <span className="font-mono text-slate-400">
                          {log.staffId}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-indigo-600 font-medium">
                          {log.role}
                        </span>
                      </div>
                    </td>

                    {/* Action & Module */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="font-semibold text-slate-900 text-xs">
                        {log.action}
                      </div>
                      <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 mt-1 border border-slate-200">
                        {log.module}
                      </span>
                    </td>

                    {/* Details */}
                    <td className="py-3.5 px-4 align-top max-w-sm">
                      <p className="text-slate-600 text-xs leading-relaxed">
                        {log.details}
                      </p>
                    </td>

                    {/* IP & Location */}
                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      <div className="flex items-center gap-1 font-mono text-[11px] text-slate-700">
                        <Globe className="w-3 h-3 text-slate-400" />
                        {log.ipAddress}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {log.location}
                      </div>
                    </td>

                    {/* Severity Badge */}
                    <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                      {log.severity === "Critical" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <XCircle className="w-3 h-3" />
                          Critical
                        </span>
                      )}
                      {log.severity === "Warning" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <AlertTriangle className="w-3 h-3" />
                          Warning
                        </span>
                      )}
                      {log.severity === "Info" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Info
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffActivityView;
