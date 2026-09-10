import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UploadCloud,
  FileSpreadsheet,
  FileArchive,
  Download,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Package,
  Layers,
  Sparkles,
  Info,
  Check,
  FileText,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  downloadBulkUploadTemplate,
  previewBulkUpload,
  importProductsFromCSV,
  bulkUploadNewProductsWithImages,
  exportProductsCSV,
} from "@/api/adminProducts";

export default function BulkUploadView() {
  const navigate = useNavigate();
  const csvInputRef = useRef(null);
  const zipInputRef = useRef(null);

  // File states
  const [csvFile, setCsvFile] = useState(null);
  const [zipFile, setZipFile] = useState(null);

  // Preview / Processing states
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Preview result data from API
  const [previewData, setPreviewData] = useState(null);
  const [importResult, setImportResult] = useState(null);

  // Handle CSV file selection
  const handleCsvSelect = (file) => {
    if (!file) return;
    const validExts = [".csv", ".xlsx", ".xls"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!validExts.includes(ext)) {
      toast.error("Please upload a valid CSV or Excel spreadsheet (.csv, .xlsx, .xls)");
      return;
    }
    setCsvFile(file);
    setPreviewData(null);
    setImportResult(null);
  };

  // Handle ZIP file selection
  const handleZipSelect = (file) => {
    if (!file) return;
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (ext !== ".zip") {
      toast.error("Please upload a valid ZIP archive (.zip)");
      return;
    }
    setZipFile(file);
    setPreviewData(null);
    setImportResult(null);
  };

  // Download Bulk Upload Template
  const handleDownloadTemplate = async () => {
    setIsDownloadingTemplate(true);
    try {
      await downloadBulkUploadTemplate();
      toast.success("Bulk upload Excel template downloaded successfully");
    } catch (err) {
      console.warn("Template download error:", err);
      toast.error(err.message || "Failed to download template");
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  // Export current catalog to CSV
  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      await exportProductsCSV();
      toast.success("Products catalog exported successfully");
    } catch (err) {
      console.warn("Catalog export error:", err);
      toast.error(err.message || "Failed to export catalog");
    } finally {
      setIsExporting(false);
    }
  };

  // Trigger Smart Preview & Validation
  const handlePreview = async () => {
    if (!csvFile) {
      toast.error("Please select a CSV or Excel spreadsheet first");
      return;
    }

    setIsPreviewing(true);
    setPreviewData(null);
    try {
      const res = await previewBulkUpload({
        csvFile,
        imagesZip: zipFile,
      });

      setPreviewData(res);
      const summary = res.summary || {};
      if (summary.hasValidationErrors || summary.importBlocked) {
        toast.warning(
          res.warning ||
            `Found ${summary.invalidProducts || 0} product(s) with validation errors`
        );
      } else {
        toast.success(
          `Validation passed! ${summary.validProducts || res.products?.length || 0} products ready for import`
        );
      }
    } catch (err) {
      console.error("Bulk upload preview error:", err);
      toast.error(err.message || "Failed to preview spreadsheet upload");
    } finally {
      setIsPreviewing(false);
    }
  };

  // Execute Final Import
  const handleImport = async () => {
    if (!csvFile) return;

    setIsImporting(true);
    try {
      let res;
      if (zipFile) {
        res = await bulkUploadNewProductsWithImages({
          csvFile,
          imagesZip: zipFile,
        });
      } else {
        res = await importProductsFromCSV(csvFile);
      }

      setImportResult(res);
      toast.success(
        res.message || "Bulk product import executed successfully!"
      );
    } catch (err) {
      console.error("Bulk import execution error:", err);
      toast.error(err.message || "Failed to execute bulk product import");
    } finally {
      setIsImporting(false);
    }
  };

  const summary = previewData?.summary || {};
  const previewProducts = previewData?.products || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── Top Header Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs"
            title="Back to Products"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-heading font-bold text-slate-900 flex items-center gap-2.5">
              <span>Bulk Product Upload</span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-heading font-bold bg-orange-50 text-accent border border-orange-200">
                CSV & ZIP Import
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-montreal mt-0.5">
              Upload master product catalogs, variants, and image archives in bulk with automated validation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Download Official Template */}
          <button
            onClick={handleDownloadTemplate}
            disabled={isDownloadingTemplate}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-heading font-bold text-slate-700 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
            title="Download Excel Template with Pre-filled Category Lists"
          >
            <Download className={cn("w-3.5 h-3.5 text-slate-500", isDownloadingTemplate && "animate-spin")} />
            <span>{isDownloadingTemplate ? "Downloading..." : "Download Template (.xlsx)"}</span>
          </button>

          {/* Export Catalog to CSV */}
          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-heading font-bold text-slate-700 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
            title="Export Current Product Catalog to CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isExporting ? "Exporting..." : "Export Catalog"}</span>
          </button>
        </div>
      </div>

      {/* ── Success Banner after execution ── */}
      {importResult && (
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-3 animate-in zoom-in-98 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-emerald-900">
                Bulk Import Completed Successfully!
              </h3>
              <p className="text-xs text-emerald-700 font-montreal mt-0.5">
                {importResult.message || "All products and variants from your spreadsheet have been processed."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => navigate("/admin/products")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-heading font-bold transition-all shadow-xs cursor-pointer"
            >
              <span>View Updated Products Catalog</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setCsvFile(null);
                setZipFile(null);
                setPreviewData(null);
                setImportResult(null);
              }}
              className="px-4 py-2 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-xs font-heading font-bold text-emerald-800 transition-colors cursor-pointer"
            >
              Upload Another Batch
            </button>
          </div>
        </div>
      )}

      {/* ── Upload Drag & Drop Section ── */}
      {!importResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: CSV / Excel Upload */}
          <div
            onClick={() => csvInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleCsvSelect(e.dataTransfer.files?.[0]);
            }}
            className={cn(
              "p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center text-center justify-center gap-3 bg-white shadow-xs group",
              csvFile
                ? "border-accent bg-orange-50/20"
                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
            )}
          >
            <input
              ref={csvInputRef}
              type="file"
              accept=".csv, .xlsx, .xls"
              onChange={(e) => handleCsvSelect(e.target.files?.[0])}
              className="hidden"
            />

            <div
              className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                csvFile
                  ? "bg-orange-100 text-accent"
                  : "bg-slate-100 text-slate-400 group-hover:text-slate-600 group-hover:bg-slate-200"
              )}
            >
              <FileSpreadsheet className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="font-heading font-bold text-sm text-slate-800">
                {csvFile ? csvFile.name : "Select Spreadsheet (CSV / Excel)"}
              </h3>
              <p className="text-xs text-slate-400 font-montreal max-w-xs">
                {csvFile
                  ? `${(csvFile.size / 1024).toFixed(1)} KB • Ready for preview`
                  : "Drag and drop your .csv or .xlsx file here, or click to browse files"}
              </p>
            </div>

            {csvFile && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-heading font-bold border border-emerald-200">
                <Check className="w-3.5 h-3.5" />
                Spreadsheet Attached
              </span>
            )}
          </div>

          {/* Card 2: Optional ZIP Images Upload */}
          <div
            onClick={() => zipInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleZipSelect(e.dataTransfer.files?.[0]);
            }}
            className={cn(
              "p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center text-center justify-center gap-3 bg-white shadow-xs group",
              zipFile
                ? "border-blue-400 bg-blue-50/20"
                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
            )}
          >
            <input
              ref={zipInputRef}
              type="file"
              accept=".zip"
              onChange={(e) => handleZipSelect(e.target.files?.[0])}
              className="hidden"
            />

            <div
              className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                zipFile
                  ? "bg-blue-100 text-blue-600"
                  : "bg-slate-100 text-slate-400 group-hover:text-slate-600 group-hover:bg-slate-200"
              )}
            >
              <FileArchive className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="font-heading font-bold text-sm text-slate-800">
                {zipFile ? zipFile.name : "Images Archive (.ZIP - Optional)"}
              </h3>
              <p className="text-xs text-slate-400 font-montreal max-w-xs">
                {zipFile
                  ? `${(zipFile.size / (1024 * 1024)).toFixed(2)} MB • Images ready`
                  : "If you have local image files, zip them up and drop here. Web URLs inside CSV also work directly."}
              </p>
            </div>

            {zipFile && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-heading font-bold border border-blue-200">
                <Check className="w-3.5 h-3.5" />
                Image ZIP Attached
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Action Buttons for Preview / Import ── */}
      {!importResult && csvFile && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs font-montreal text-slate-500">
            <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span>
              Click <strong>Preview & Validate</strong> to test your spreadsheet before writing to the database.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePreview}
              disabled={isPreviewing || isImporting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-heading font-bold text-slate-800 transition-all shadow-2xs cursor-pointer disabled:opacity-50"
            >
              {isPreviewing ? (
                <Loader2 className="w-4 h-4 text-accent animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 text-accent" />
              )}
              <span>{isPreviewing ? "Validating Spreadsheet..." : "Preview & Validate"}</span>
            </button>

            {previewData && !summary.importBlocked && (
              <button
                onClick={handleImport}
                disabled={isImporting || isPreviewing}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-heading font-bold transition-all shadow-xs active:scale-98 cursor-pointer disabled:opacity-50"
              >
                {isImporting ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <UploadCloud className="w-4 h-4" />
                )}
                <span>{isImporting ? "Importing Products..." : "Confirm & Import Products"}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Validation KPI Summary Cards ── */}
      {previewData && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-400">
                Total Rows
              </span>
              <p className="text-xl font-heading font-black text-slate-900">
                {summary.totalRows ?? previewProducts.length}
              </p>
              <span className="text-[10px] text-slate-400 font-montreal">Spreadsheet rows parsed</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-400">
                Valid Products
              </span>
              <p className="text-xl font-heading font-black text-emerald-600">
                {summary.validProducts ?? previewProducts.length}
              </p>
              <span className="text-[10px] text-slate-400 font-montreal">Ready to be created / updated</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-400">
                Invalid Rows
              </span>
              <p className={cn("text-xl font-heading font-black", (summary.invalidProducts || 0) > 0 ? "text-rose-600" : "text-slate-900")}>
                {summary.invalidProducts ?? 0}
              </p>
              <span className="text-[10px] text-slate-400 font-montreal">Requires correction in sheet</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-400">
                Total Variants
              </span>
              <p className="text-xl font-heading font-black text-blue-600">
                {summary.totalVariants ?? previewProducts.reduce((acc, p) => acc + (p.variants?.length || 1), 0)}
              </p>
              <span className="text-[10px] text-slate-400 font-montreal">SKU variant codes mapped</span>
            </div>
          </div>

          {/* Validation Warning Notice if any */}
          {summary.hasValidationErrors && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-montreal flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-heading font-bold text-amber-950">Validation Warning:</strong>
                <p className="mt-0.5 text-amber-800">
                  {previewData.warning ||
                    "Some rows in your spreadsheet contain validation issues. Please review the details below or fix them in your spreadsheet before importing."}
                </p>
              </div>
            </div>
          )}

          {/* ── Preview Products Table ── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-slate-900 text-sm">
                  Parsed Products Preview ({previewProducts.length})
                </h3>
                <p className="text-xs text-slate-400 font-montreal">
                  Review how your spreadsheet data maps to catalog items.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-heading font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Product Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">SKU / Code</th>
                    <th className="py-3 px-4">Price / MRP</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Variants</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-montreal">
                  {previewProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No product rows extracted from the uploaded spreadsheet.
                      </td>
                    </tr>
                  ) : (
                    previewProducts.map((p, idx) => {
                      const firstVar = p.variants?.[0] || {};
                      const varPrice = firstVar.price?.sale || firstVar.price?.base || p.price || 0;
                      const varMrp = firstVar.price?.base || p.mrp || varPrice;
                      const varStock = firstVar.inventory?.quantity ?? p.stock ?? 0;

                      return (
                        <tr key={`preview-${idx}`} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-heading font-bold text-slate-800">
                            {p.name || p.title || "Untitled Product"}
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {typeof p.category === "object" ? p.category?.name || "General" : p.category || "General"}
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                            {firstVar.sku || firstVar.productCode || p.sku || "N/A"}
                          </td>
                          <td className="py-3 px-4 font-heading">
                            <span className="font-bold text-slate-900">₹{varPrice}</span>{" "}
                            <span className="text-[10px] text-slate-400 line-through">₹{varMrp}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-700 font-heading font-bold">
                            {varStock}
                          </td>
                          <td className="py-3 px-4 text-slate-500">
                            {p.variants?.length || 1} variant(s)
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-heading font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Valid
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
