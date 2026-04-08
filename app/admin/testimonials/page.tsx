"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Trash2,
  Eye,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Check,
  Ban,
  TriangleAlert,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Testimonial {
  id: number;
  full_name: string;
  message: string;
  is_approved: boolean;
  created_at: string;
}

type ModalMode = "view" | null;
interface Toast {
  id: number;
  type: "success" | "error";
  message: string;
}

// ── Confirm Dialog ────────────────────────────────────────────────────────────

function ConfirmDialog({
  title,
  description,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
  loading,
  isDangerous = false,
}: {
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  isDangerous?: boolean;
}) {
  const bgColor = isDangerous ? "bg-red-50" : "bg-blue-50";
  const iconColor = isDangerous ? "text-red-500" : "text-blue-500";
  const btnColor = isDangerous
    ? "bg-red-600 hover:bg-red-700"
    : "bg-blue-600 hover:bg-blue-700";
  const icon = isDangerous ? TriangleAlert : CheckCircle;
  const Icon = icon;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"
        onClick={onCancel}
      />
      <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4"
          style={{ animation: "modalIn 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center flex-shrink-0`}
            >
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div>
              <h3 className="text-slate-800 font-bold text-base">{title}</h3>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-1">
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`px-5 py-2.5 rounded-xl ${btnColor} text-white text-sm font-bold transition-colors disabled:opacity-50 flex items-center gap-2`}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Processing..." : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function ToastList({
  toasts,
  remove,
}: {
  toasts: Toast[];
  remove: (id: number) => void;
}) {
  return (
    <div className="fixed top-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-medium
            ${
              t.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          style={{ animation: "toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}
        >
          {t.type === "success" ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {t.message}
          <button
            onClick={() => remove(t.id)}
            className="ml-1 opacity-50 hover:opacity-100"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ── View Modal ────────────────────────────────────────────────────────────────

function TestimonialViewModal({
  testimonial,
  onClose,
}: {
  testimonial: Testimonial | null;
  onClose: () => void;
}) {
  if (!testimonial) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 flex flex-col gap-6"
          style={{ animation: "modalIn 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800">
              {testimonial.full_name}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Message
              </p>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {testimonial.message}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Status
                </p>
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium ${
                    testimonial.is_approved
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      testimonial.is_approved ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                  {testimonial.is_approved ? "Approved" : "Pending"}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Submitted
                </p>
                <p className="text-sm text-slate-700">
                  {new Date(testimonial.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filteredTestimonials, setFilteredTestimonials] =
    useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "approved" | "pending">("all");
  const [viewModal, setViewModal] = useState<Testimonial | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    type: "approve" | "reject" | "delete";
    testimonial: Testimonial | null;
  } | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Fetch testimonials
  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/testimonials");
      const data = await response.json();

      if (data.success) {
        setTestimonials(data.data || []);
        applyFilters(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
      addToast("Failed to load testimonials", "error");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (items: Testimonial[]) => {
    let filtered = items;

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.full_name.toLowerCase().includes(query) ||
          t.message.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (filterStatus === "approved") {
      filtered = filtered.filter((t) => t.is_approved);
    } else if (filterStatus === "pending") {
      filtered = filtered.filter((t) => !t.is_approved);
    }

    setFilteredTestimonials(filtered);
  };

  useEffect(() => {
    applyFilters(testimonials);
  }, [searchQuery, filterStatus, testimonials]);

  const addToast = (message: string, type: "success" | "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleApprove = async (testimonial: Testimonial) => {
    setProcessingId(testimonial.id);
    try {
      const response = await fetch(
        `/api/admin/testimonials/${testimonial.id}/approve`,
        { method: "POST" }
      );
      const data = await response.json();

      if (data.success) {
        setTestimonials((prev) =>
          prev.map((t) =>
            t.id === testimonial.id ? { ...t, is_approved: true } : t
          )
        );
        addToast("Testimonial approved!", "success");
        setConfirmDialog(null);
      } else {
        addToast(data.message || "Failed to approve", "error");
      }
    } catch (error) {
      console.error("Approve error:", error);
      addToast("Error approving testimonial", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (testimonial: Testimonial) => {
    setProcessingId(testimonial.id);
    try {
      const response = await fetch(
        `/api/admin/testimonials/${testimonial.id}/reject`,
        { method: "POST" }
      );
      const data = await response.json();

      if (data.success) {
        setTestimonials((prev) =>
          prev.map((t) =>
            t.id === testimonial.id ? { ...t, is_approved: false } : t
          )
        );
        addToast("Testimonial rejected", "success");
        setConfirmDialog(null);
      } else {
        addToast(data.message || "Failed to reject", "error");
      }
    } catch (error) {
      console.error("Reject error:", error);
      addToast("Error rejecting testimonial", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (testimonial: Testimonial) => {
    setProcessingId(testimonial.id);
    try {
      const response = await fetch(
        `/api/admin/testimonials/${testimonial.id}`,
        { method: "DELETE" }
      );
      const data = await response.json();

      if (data.success) {
        setTestimonials((prev) => prev.filter((t) => t.id !== testimonial.id));
        addToast("Testimonial deleted", "success");
        setConfirmDialog(null);
      } else {
        addToast(data.message || "Failed to delete", "error");
      }
    } catch (error) {
      console.error("Delete error:", error);
      addToast("Error deleting testimonial", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const inp =
    "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all";

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-1">
              Testimonials
            </h1>
            <p className="text-slate-500">
              {testimonials.length} total testimonial{testimonials.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={fetchTestimonials}
            className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold transition-colors flex items-center gap-2"
          >
            ↻ Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl border border-slate-200 p-6 bg-white">
            <p className="text-slate-600 text-sm font-medium mb-1">
              {testimonials.length}
            </p>
            <p className="text-slate-500 text-sm">Total</p>
          </div>
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6">
            <p className="text-yellow-700 text-sm font-medium mb-1">
              {testimonials.filter((t) => !t.is_approved).length}
            </p>
            <p className="text-yellow-600 text-sm">Pending</p>
          </div>
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
            <p className="text-blue-700 text-sm font-medium mb-1">
              {testimonials.filter((t) => t.is_approved).length}
            </p>
            <p className="text-blue-600 text-sm">Confirmed</p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-6 bg-white">
            <p className="text-slate-600 text-sm font-medium mb-1">
              {Math.round((testimonials.filter((t) => t.is_approved).length / Math.max(testimonials.length, 1)) * 100)}%
            </p>
            <p className="text-slate-500 text-sm">Approval Rate</p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, phone, property..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${inp} pl-10 bg-white border-slate-300 text-slate-900 placeholder:text-slate-400`}
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as "all" | "approved" | "pending")
              }
              className={`${inp} bg-white border-slate-300 text-slate-900`}
            >
              <option value="all">All</option>
              <option value="approved">Confirmed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
            </div>
          ) : filteredTestimonials.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-slate-500">
              <AlertCircle className="w-12 h-12 mb-4 opacity-40" />
              <p className="text-lg font-medium">No testimonials found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredTestimonials.map((testimonial) => (
                    <tr
                      key={testimonial.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">
                          {testimonial.full_name}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-600 line-clamp-2">
                          {testimonial.message}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium ${
                            testimonial.is_approved
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              testimonial.is_approved
                                ? "bg-blue-500"
                                : "bg-yellow-500"
                            }`}
                          />
                          {testimonial.is_approved ? "Confirmed" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm">
                        {new Date(testimonial.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setViewModal(testimonial)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {!testimonial.is_approved && (
                            <button
                              onClick={() =>
                                setConfirmDialog({
                                  type: "approve",
                                  testimonial,
                                })
                              }
                              disabled={processingId === testimonial.id}
                              className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600 hover:text-blue-700 disabled:opacity-50"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}

                          {testimonial.is_approved && (
                            <button
                              onClick={() =>
                                setConfirmDialog({ type: "reject", testimonial })
                              }
                              disabled={processingId === testimonial.id}
                              className="p-2 hover:bg-yellow-100 rounded-lg transition-colors text-yellow-600 hover:text-yellow-700 disabled:opacity-50"
                              title="Reject"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() =>
                              setConfirmDialog({ type: "delete", testimonial })
                            }
                            disabled={processingId === testimonial.id}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600 hover:text-red-700 disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
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
      </div>

      {/* Modals */}
      <TestimonialViewModal
        testimonial={viewModal}
        onClose={() => setViewModal(null)}
      />

      {confirmDialog && (
        <ConfirmDialog
          title={
            confirmDialog.type === "approve"
              ? "Approve Testimonial?"
              : confirmDialog.type === "reject"
                ? "Reject Testimonial?"
                : "Delete Testimonial?"
          }
          description={
            confirmDialog.type === "approve"
              ? "This testimonial will be visible on your website."
              : confirmDialog.type === "reject"
                ? "This testimonial will be unpublished from your website."
                : "This action cannot be undone."
          }
          confirmLabel={
            confirmDialog.type === "approve"
              ? "Approve"
              : confirmDialog.type === "reject"
                ? "Reject"
                : "Delete"
          }
          onConfirm={() => {
            if (confirmDialog.type === "approve") {
              handleApprove(confirmDialog.testimonial!);
            } else if (confirmDialog.type === "reject") {
              handleReject(confirmDialog.testimonial!);
            } else {
              handleDelete(confirmDialog.testimonial!);
            }
          }}
          onCancel={() => setConfirmDialog(null)}
          loading={processingId === confirmDialog.testimonial?.id}
          isDangerous={confirmDialog.type === "delete"}
        />
      )}

      <ToastList toasts={toasts} remove={removeToast} />
    </div>
  );
}
