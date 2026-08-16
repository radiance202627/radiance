'use client';

import React, { useState, useEffect } from 'react';
import {
  Hammer,
  Search,
  Eye,
  Trash2,
  RefreshCw,
  X,
  FileText,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  Archive,
  User,
  Building,
} from 'lucide-react';

interface CustomCraftAttachmentItem {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: number;
}

interface CustomCraftItem {
  id: string;
  referenceNo: string;
  name: string;
  companyName?: string;
  email: string;
  contactNumber: string;
  address?: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
  purpose: string;
  customPurpose?: string;
  metals: string[];
  customMetal?: string;
  finishType: string;
  selectedFinish?: string;
  expectedQuantity?: string;
  deliveryDate?: string;
  description: string;
  status: string;
  internalNotes?: string;
  attachments: CustomCraftAttachmentItem[];
  createdAt: string;
}

export default function AdminCustomCraftPage() {
  const [requests, setRequests] = useState<CustomCraftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Drawer / Detail View
  const [selectedRequest, setSelectedRequest] = useState<CustomCraftItem | null>(null);
  const [updating, setUpdating] = useState(false);
  const [statusInput, setStatusInput] = useState<string>('NEW');
  const [notesInput, setNotesInput] = useState<string>('');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        status: statusFilter,
        page: page.toString(),
        limit: '15',
      });
      if (search) query.append('search', search);

      const res = await fetch(`/api/admin/custom-craft?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        setRequests(data.requests || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (e) {
      console.error('Fetch custom craft requests error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter, page]);

  const openDrawer = (item: CustomCraftItem) => {
    setSelectedRequest(item);
    setStatusInput(item.status);
    setNotesInput(item.internalNotes || '');
  };

  const handleUpdateStatus = async () => {
    if (!selectedRequest) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/custom-craft/${selectedRequest.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: statusInput,
          internalNotes: notesInput,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSelectedRequest((prev) => (prev ? { ...prev, status: statusInput, internalNotes: notesInput } : null));
        fetchRequests();
      }
    } catch (err) {
      console.error('Update status error:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string, permanent = false) => {
    if (!confirm(permanent ? 'Permanently delete this enquiry?' : 'Move enquiry to trash?')) return;

    try {
      const url = `/api/admin/custom-craft/${id}${permanent ? '?action=permanent' : ''}`;
      const res = await fetch(url, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        if (selectedRequest?.id === id) setSelectedRequest(null);
        fetchRequests();
      }
    } catch (e) {
      console.error('Delete request error:', e);
    }
  };

  const statusBadge = (st: string) => {
    switch (st) {
      case 'NEW':
        return <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-blue-100 text-blue-800 rounded-full">New</span>;
      case 'REVIEWED':
        return <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-indigo-100 text-indigo-800 rounded-full">Reviewed</span>;
      case 'QUOTED':
        return <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-purple-100 text-purple-800 rounded-full">Quoted</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-amber-100 text-amber-800 rounded-full">In Progress</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded-full">Completed</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-red-100 text-red-800 rounded-full">Rejected</span>;
      default:
        return <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-gray-100 text-gray-700 rounded-full">Archived</span>;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F4F2ED] p-6 rounded-2xl border border-[#E5E2DA]">
        <div>
          <div className="flex items-center gap-2 text-[#B08D57]">
            <Hammer className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-widest">Custom Craft Portal</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#222222] mt-1">Bespoke & OEM Enquiries</h1>
          <p className="text-xs text-[#666666] mt-0.5">Manage custom manufacturing requests, attached CAD drawings, and quoting workflow.</p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#F4F2ED] rounded-xl border border-[#E5E2DA] w-full md:w-auto overflow-x-auto">
          {(['ALL', 'NEW', 'REVIEWED', 'QUOTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'TRASH'] as const).map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider rounded-lg transition shrink-0 ${
                statusFilter === st
                  ? 'bg-[#FAF9F6] text-[#B08D57] shadow-sm font-semibold border border-[#E5E2DA]'
                  : 'text-[#666666] hover:text-[#222222]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Ref No, Name, Company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F4F2ED] border border-[#E5E2DA] rounded-xl text-xs text-[#222222] focus:outline-none focus:border-[#B08D57]"
          />
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#666666] flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[#B08D57]" />
            <span>Loading enquiries...</span>
          </div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-[#666666]/40 mx-auto" />
            <p className="text-sm font-medium text-[#222222]">No Custom Craft requests found</p>
            <p className="text-xs text-[#666666]">Submissions from /custom-craft will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#222222]">
              <thead className="bg-[#FAF9F6] border-b border-[#E5E2DA] text-[10px] font-semibold text-[#666666] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Ref No</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Purpose</th>
                  <th className="py-3.5 px-4">Metals & Finish</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Submitted</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E2DA]">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-[#FAF9F6]/80 transition">
                    <td className="py-4 px-4 font-mono font-semibold text-[#B08D57]">{req.referenceNo}</td>
                    <td className="py-4 px-4">
                      <p className="font-serif font-bold text-[#222222]">{req.name}</p>
                      <p className="text-[10px] text-[#666666]">{req.companyName || req.email}</p>
                    </td>
                    <td className="py-4 px-4 font-medium text-[#222222]">
                      {req.purpose === 'Other' ? `Other (${req.customPurpose})` : req.purpose}
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-[11px] font-semibold text-[#222222]">
                        {Array.isArray(req.metals) ? req.metals.join(', ') : req.metals}
                      </p>
                      <p className="text-[10px] text-[#666666]">{req.selectedFinish || req.finishType}</p>
                    </td>
                    <td className="py-4 px-4">{statusBadge(req.status)}</td>
                    <td className="py-4 px-4 text-[#666666] text-[11px]">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openDrawer(req)}
                          className="px-3 py-1 bg-[#B08D57]/15 text-[#B08D57] rounded-lg text-xs font-semibold hover:bg-[#B08D57]/25 transition flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Detail</span>
                        </button>
                        <button
                          onClick={() => handleDelete(req.id, false)}
                          className="p-1.5 text-[#666666] hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Move to Trash"
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

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#E5E2DA] bg-[#FAF9F6] flex items-center justify-between text-xs text-[#666666]">
            <span>Page {page} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 bg-[#F4F2ED] border border-[#E5E2DA] rounded-lg disabled:opacity-40 transition hover:bg-[#E5E2DA]"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 bg-[#F4F2ED] border border-[#E5E2DA] rounded-lg disabled:opacity-40 transition hover:bg-[#E5E2DA]"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Drawer / Modal View for Request Details */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
          <div className="bg-[#FAF9F6] border-l border-[#E5E2DA] w-full max-w-2xl h-full shadow-2xl flex flex-col overflow-hidden">
            {/* Drawer Header */}
            <div className="p-6 border-b border-[#E5E2DA] bg-[#F4F2ED] flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-semibold text-[#B08D57]">{selectedRequest.referenceNo}</span>
                <h2 className="font-serif font-bold text-lg text-[#222222]">Enquiry Details</h2>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="p-1.5 text-[#666666] hover:text-[#222222]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-[#222222]">
              {/* Customer Info Card */}
              <div className="p-4 bg-[#F4F2ED] border border-[#E5E2DA] rounded-xl space-y-3">
                <h4 className="font-serif font-bold text-sm text-[#222222] border-b border-[#E5E2DA] pb-2">
                  Customer Profile
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#666666] block">Name:</span>
                    <strong className="text-[#222222]">{selectedRequest.name}</strong>
                  </div>
                  <div>
                    <span className="text-[#666666] block">Company:</span>
                    <strong className="text-[#222222]">{selectedRequest.companyName || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-[#666666] block">Email:</span>
                    <strong className="text-[#222222]">{selectedRequest.email}</strong>
                  </div>
                  <div>
                    <span className="text-[#666666] block">Phone:</span>
                    <strong className="text-[#222222]">{selectedRequest.contactNumber}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[#666666] block">Location:</span>
                    <strong className="text-[#222222]">
                      {selectedRequest.address ? `${selectedRequest.address}, ` : ''}
                      {selectedRequest.city}, {selectedRequest.state}, {selectedRequest.country} {selectedRequest.zipCode || ''}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Requirement Specifications */}
              <div className="p-4 bg-[#F4F2ED] border border-[#E5E2DA] rounded-xl space-y-3">
                <h4 className="font-serif font-bold text-sm text-[#222222] border-b border-[#E5E2DA] pb-2">
                  Manufacturing Specifications
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[#666666] block">Purpose:</span>
                    <strong className="text-[#222222]">{selectedRequest.purpose}</strong>
                  </div>
                  <div>
                    <span className="text-[#666666] block">Metals Selected:</span>
                    <strong className="text-[#222222]">
                      {Array.isArray(selectedRequest.metals) ? selectedRequest.metals.join(', ') : selectedRequest.metals}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#666666] block">Finish Type:</span>
                    <strong className="text-[#222222]">{selectedRequest.finishType}</strong>
                  </div>
                  <div>
                    <span className="text-[#666666] block">Selected Finish:</span>
                    <strong className="text-[#222222]">{selectedRequest.selectedFinish || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-[#666666] block">Expected Quantity:</span>
                    <strong className="text-[#222222]">{selectedRequest.expectedQuantity || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-[#666666] block">Target Delivery Date:</span>
                    <strong className="text-[#222222]">{selectedRequest.deliveryDate || 'N/A'}</strong>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 bg-[#F4F2ED] border border-[#E5E2DA] rounded-xl space-y-2">
                <h4 className="font-serif font-bold text-sm text-[#222222]">Product Description</h4>
                <p className="text-xs text-[#666666] leading-relaxed whitespace-pre-line font-sans">
                  {selectedRequest.description}
                </p>
              </div>

              {/* Attachments */}
              <div className="p-4 bg-[#F4F2ED] border border-[#E5E2DA] rounded-xl space-y-3">
                <h4 className="font-serif font-bold text-sm text-[#222222] border-b border-[#E5E2DA] pb-2">
                  Attached Files ({selectedRequest.attachments?.length || 0})
                </h4>

                {selectedRequest.attachments && selectedRequest.attachments.length > 0 ? (
                  <div className="space-y-2">
                    {selectedRequest.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="flex items-center justify-between p-3 bg-[#FAF9F6] border border-[#E5E2DA] rounded-lg"
                      >
                        <span className="font-mono text-xs text-[#222222] truncate">{att.fileName}</span>
                        <a
                          href={att.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-[#B08D57] text-[#FAF9F6] text-[10px] font-semibold uppercase tracking-wider rounded-md hover:bg-[#9A7B4B] transition flex items-center gap-1 shrink-0"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#666666]">No attachments uploaded for this request.</p>
                )}
              </div>

              {/* Status Update & Internal Notes */}
              <div className="p-4 bg-[#F4F2ED] border border-[#E5E2DA] rounded-xl space-y-4">
                <h4 className="font-serif font-bold text-sm text-[#222222] border-b border-[#E5E2DA] pb-2">
                  Internal Workflow Status & Notes
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-[#666666] mb-1">Update Status</label>
                  <select
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-xs text-[#222222] font-semibold"
                  >
                    <option value="NEW">NEW</option>
                    <option value="REVIEWED">REVIEWED</option>
                    <option value="QUOTED">QUOTED</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="REJECTED">REJECTED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#666666] mb-1">Internal Notes</label>
                  <textarea
                    rows={4}
                    placeholder="Add internal pricing estimates, CAD feedback, executive comments..."
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    className="w-full p-3 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-xs text-[#222222]"
                  />
                </div>

                <button
                  onClick={handleUpdateStatus}
                  disabled={updating}
                  className="w-full py-2.5 bg-[#B08D57] hover:bg-[#9A7B4B] text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider rounded-xl transition shadow-sm disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Save Workflow Changes'}
                </button>
              </div>

              {/* Email History Notification Log */}
              <div className="p-4 bg-[#F4F2ED] border border-[#E5E2DA] rounded-xl space-y-2">
                <h4 className="font-serif font-bold text-sm text-[#222222]">Notification Log</h4>
                <div className="text-[11px] text-[#666666] space-y-1">
                  <p>• Initial notification dispatched to <strong>Sales@sbpatternworks.com</strong> on submission.</p>
                  <p>• Created at: {new Date(selectedRequest.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
