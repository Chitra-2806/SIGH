import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileCheck2,
  Search,
  Download,
  Eye,
  Building,
  Calendar,
  AlertTriangle,
  Scale,
  ShieldCheck
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { StatusPill } from '../../components/common/StatusPill';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { apiService } from '../../services/api';
import { InspectionRecord } from '../../types';
import { generateInspectionPDF } from '../../utils/pdfGenerator';
import { formatDate } from '../../utils/formatters';

export const ActivityInspectionInfo: React.FC = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<InspectionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getInspectionHistory();
      setRecords(data);
    } catch (err) {
      console.error('Failed to load inspection activity', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = records.filter((r) => {
    if (actionFilter !== 'all' && r.actionTaken !== actionFilter) return false;
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      r.id.toLowerCase().includes(q) ||
      r.storeName.toLowerCase().includes(q) ||
      r.extractedData.commodityName.toLowerCase().includes(q) ||
      r.inspectorName.toLowerCase().includes(q) ||
      (r.noticeNumber && r.noticeNumber.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Central Inspection & Enforcement Activity Ledger
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Complete statutory audit trail of all field inspections, seizure warrants, and compounding notices.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardBody className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              id="search-activity-input"
              placeholder="Search by ID, Store, Commodity, Notice No, or Inspector..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div>
            <select
              id="filter-action-taken"
              aria-label="Filter by Action Taken"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full sm:w-auto text-xs font-medium rounded-lg border border-[#E8E1D2] dark:border-[#3F4A43] bg-white dark:bg-[#2B332E] text-[#303530] dark:text-[#F5F3EA] px-3 py-2.5 cursor-pointer"
            >
              <option value="all">All Actions</option>
              <option value="Cleared">Cleared (Compliant)</option>
              <option value="Notice Issued">Notice Issued</option>
              <option value="Stock Seized">Stock Seized (Sec 15)</option>
              <option value="Sample Collected">Sample Collected</option>
            </select>
          </div>
        </CardBody>
      </Card>

      {/* Audit Table */}
      {isLoading ? (
        <LoadingSpinner message="Querying national enforcement audit records..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Inspection Activities Match Filters"
          description="Try broadening your search query or reset the action filter."
        />
      ) : (
        <Card>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F5] dark:bg-[#202622] text-[#5C6B61] dark:text-[#B0ACA0] font-semibold border-b border-[#E8E1D2] dark:border-[#3F4A43]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Inspection ID</th>
                    <th className="py-3 px-4 font-semibold">Date & Time</th>
                    <th className="py-3 px-4 font-semibold">Retail Premises</th>
                    <th className="py-3 px-4 font-semibold">Product Commodity</th>
                    <th className="py-3 px-4 font-semibold">Inspector</th>
                    <th className="py-3 px-4 font-semibold">Compliance</th>
                    <th className="py-3 px-4 font-semibold">Statutory Action</th>
                    <th className="py-3 px-4 font-semibold text-right">PDF / Dossier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E1D2]/60 dark:divide-[#3F4A43]/60">
                  {filtered.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#FAF9F5]/80 dark:hover:bg-[#202622]/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-[#426B5A] dark:text-[#8FAF9A]">
                        {item.id}
                      </td>
                      <td className="py-3 px-4 text-[#5C6B61] dark:text-[#A8B2AA] whitespace-nowrap">
                        {formatDate(item.inspectionDate)}
                        <span className="block text-[10px] text-slate-400">{item.timestamp}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900 dark:text-white block">
                          {item.storeName}
                        </span>
                        <span className="text-[11px] text-slate-400">{item.city}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-800 dark:text-slate-200 font-medium">
                          {item.extractedData.commodityName}
                        </span>
                        <span className="block text-[10px] text-slate-400">
                          {item.extractedData.brandName}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {item.inspectorName}
                        </span>
                        <span className="block text-[10px] font-mono text-slate-400">
                          {item.badgeNumber}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <StatusPill status={item.status} size="sm" />
                          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                            {item.overallScore}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold px-2 py-0.5 rounded-full text-[11px] ${
                            item.actionTaken === 'Stock Seized'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                              : item.actionTaken === 'Notice Issued'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}
                        >
                          {item.actionTaken}
                        </span>
                        {item.noticeNumber && (
                          <span className="block font-mono text-[10px] text-slate-400 mt-0.5">
                            {item.noticeNumber}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => generateInspectionPDF(item)}
                            title="Download PDF"
                            aria-label="Download PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/inspector/history/${item.id}`)}
                            leftIcon={<Eye className="w-3.5 h-3.5" />}
                          >
                            View
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};
