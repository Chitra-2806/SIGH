import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  Building2,
  AlertTriangle,
  Plus,
  FileText,
  RotateCcw,
  CheckCircle2,
  AlertOctagon
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { StatusPill } from '../../components/common/StatusPill';
import { apiService } from '../../services/api';
import { InspectionRecord, StandardRegulatoryStatus } from '../../types';
import { generateInspectionPDF } from '../../utils/pdfGenerator';
import { formatDate } from '../../utils/formatters';

export const InspectionHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [inspections, setInspections] = useState<InspectionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    loadInspections();
  }, [selectedStatus, selectedDate]);

  const loadInspections = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getInspectionHistory({
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        search: searchTerm || undefined,
      });

      // Filter by date if specified
      let filtered = data;
      if (selectedDate) {
        filtered = filtered.filter((r) => r.inspectionDate === selectedDate);
      }

      setInspections(filtered);
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadInspections();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedDate('');
  };

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto">
      {/* Header & New Inspection Callout */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E8E1D2] dark:border-[#3A443E] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D5E2D9] text-[#2C493D] dark:bg-[#426B5A]/40 dark:text-[#D5E2D9] text-xs font-semibold mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>STATUTORY AUDIT LEDGER</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#303530] dark:text-[#F5F3EA]">
            Statutory Audit & Inspection History
          </h1>
          <p className="text-xs text-[#565D57] dark:text-[#D2CDC0] mt-0.5">
            Official repository of pre-packaged commodity audits under Legal Metrology Act, 2009.
          </p>
        </div>

        <Button
          id="btn-new-inspection-from-history"
          onClick={() => navigate('/live-package-scanner')}
          className="bg-[#426B5A] hover:bg-[#2C493D] text-white text-xs font-bold px-4 py-2 flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Inspection</span>
        </Button>
      </div>

      {/* Filter and Search Bar: Product/Store Search, Status Filter, Date Filter */}
      <Card className="border-[#E8E1D2] dark:border-[#3A443E] shadow-xs bg-white dark:bg-[#2B332E]">
        <CardBody className="p-4">
          <form onSubmit={handleSearchSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Search by Product / Store */}
              <div className="sm:col-span-6">
                <Input
                  id="search-inspections"
                  placeholder="Search by product name, brand, store, or dossier ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search className="w-4 h-4 text-[#79827B]" />}
                  className="text-xs"
                />
              </div>

              {/* Filter by Status */}
              <div className="sm:col-span-3">
                <select
                  id="filter-status-select"
                  aria-label="Filter by Compliance Status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full text-xs font-medium rounded-lg border border-[#E8E1D2] dark:border-[#3A443E] bg-white dark:bg-[#202622] text-[#303530] dark:text-[#F5F3EA] px-3 py-2.5 focus:ring-2 focus:ring-[#426B5A] cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="compliant">Compliant (Score ≥ 90%)</option>
                  <option value="partial">Requires Review (70% - 89%)</option>
                  <option value="non-compliant">Potential Non-Compliance (&lt; 70%)</option>
                </select>
              </div>

              {/* Filter by Date */}
              <div className="sm:col-span-3">
                <input
                  type="date"
                  id="filter-date-input"
                  aria-label="Filter by Inspection Date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full text-xs font-medium rounded-lg border border-[#E8E1D2] dark:border-[#3A443E] bg-white dark:bg-[#202622] text-[#303530] dark:text-[#F5F3EA] px-3 py-2 focus:ring-2 focus:ring-[#426B5A] cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-[#565D57] dark:text-[#D2CDC0]">
                Showing {inspections.length} recorded statutory dossier(s)
              </span>

              <div className="flex items-center gap-2">
                {(searchTerm || selectedStatus !== 'all' || selectedDate) && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleResetFilters}
                    className="text-[#565D57] dark:text-[#D2CDC0] hover:text-[#303530] text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear Filters</span>
                  </Button>
                )}

                <Button
                  type="submit"
                  variant="secondary"
                  size="sm"
                  className="text-xs font-semibold px-3.5 py-1.5 cursor-pointer"
                >
                  Filter Records
                </Button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Inspections List */}
      {isLoading ? (
        <LoadingSpinner message="Retrieving inspection ledger..." />
      ) : inspections.length === 0 ? (
        <EmptyState
          title="No Inspection Records Found"
          description="No records match your active search and filter criteria. Try adjusting your filters or initiate a new specimen scan."
          actionLabel="Initiate New Scan"
          onAction={() => navigate('/live-package-scanner')}
        />
      ) : (
        <div className="space-y-3">
          {inspections.map((record) => {
            let standardStatus: StandardRegulatoryStatus = 'REQUIRES OFFICER REVIEW';
            if (record.overallScore >= 90) standardStatus = 'COMPLIANT';
            else if (record.overallScore < 70) standardStatus = 'POTENTIAL NON-COMPLIANCE';

            return (
              <Card
                key={record.id}
                className="border-[#E8E1D2] dark:border-[#3A443E] hover:border-[#8FAF9A] dark:hover:border-[#6F9B84] transition shadow-xs bg-white dark:bg-[#2B332E] cursor-pointer"
                onClick={() => navigate(`/compliance-reports/${record.id}`)}
              >
                <CardBody className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Left: Specimen & Product Summary */}
                    <div className="flex items-start gap-3.5 min-w-0">
                      <img
                        src={record.packageImage}
                        alt={record.extractedData.commodityName}
                        className="w-16 h-16 object-cover rounded-xl border border-[#E8E1D2] dark:border-[#3A443E] bg-[#FAF9F5] dark:bg-[#202622] shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#426B5A] dark:text-[#6F9B84]">
                            {record.id}
                          </span>
                          <StatusPill status={record.status} size="sm" />
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#FAF9F5] dark:bg-[#202622] text-[#303530] dark:text-[#F5F3EA] border border-[#E8E1D2] dark:border-[#3F4A43]">
                            Score: {record.overallScore}%
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-[#303530] dark:text-[#F5F3EA] truncate">
                          {record.extractedData.commodityName} &bull; {record.extractedData.brandName}
                        </h3>

                        <p className="text-xs text-[#4A534B] dark:text-[#D4D0C5] flex items-center gap-1.5 truncate">
                          <Building2 className="w-3.5 h-3.5 shrink-0 text-[#426B5A] dark:text-[#8FAF9A]" />
                          <span>
                            {record.storeName} &bull; {record.city}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Right: Date, Action & Report CTA */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E8E1D2] dark:border-[#3F4A43] gap-2 shrink-0">
                      <div className="text-left sm:text-right text-[11px] text-[#4A534B] dark:text-[#D4D0C5]">
                        <p className="flex items-center sm:justify-end gap-1 font-medium">
                          <Calendar className="w-3 h-3 text-[#426B5A] dark:text-[#8FAF9A]" />
                          <span>{record.inspectionDate} &bull; {record.timestamp}</span>
                        </p>
                        <p className="text-[#565E57] dark:text-[#B0ACA0] mt-0.5">
                          Action: <strong className="text-[#303530] dark:text-[#F5F3EA]">{record.actionTaken}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate(`/compliance-reports/${record.id}`)}
                          className="text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Report</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => generateInspectionPDF(record)}
                          title="Download Form III PDF"
                          aria-label="Download Form III PDF"
                          className="text-[#426B5A] dark:text-[#8FAF9A] hover:bg-[#E8E1D2]/40"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Notice preview if violation */}
                  {record.noticeNumber && (
                    <div className="mt-3 pt-3 border-t border-[#E8E1D2] dark:border-[#3F4A43] flex items-center gap-2 text-xs text-[#735624] dark:text-[#D8C79B]">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        Statutory Notice Dispatched: <strong className="font-mono">{record.noticeNumber}</strong>
                      </span>
                    </div>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

