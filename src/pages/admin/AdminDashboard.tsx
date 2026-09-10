import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  FileCheck2,
  AlertTriangle,
  Scale,
  TrendingUp,
  Activity,
  ArrowRight,
  Search,
  MapPin,
  Clock,
  CheckCircle2,
  Eye,
  ExternalLink,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StatusPill } from '../../components/common/StatusPill';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { apiService } from '../../services/api';
import { AdminStats, InspectionRecord, SupervisorSummary } from '../../types';
import { formatDate } from '../../utils/formatters';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [supervisors, setSupervisors] = useState<SupervisorSummary[]>([]);
  const [recentInspections, setRecentInspections] = useState<InspectionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Supervisor Directory Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [dutyFilter, setDutyFilter] = useState<'all' | 'on-duty' | 'off-duty'>('all');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statsData, supervisorList, historyData] = await Promise.all([
        apiService.getAdminStats(),
        apiService.getSupervisors(),
        apiService.getInspectionHistory(),
      ]);
      setStats(statsData);
      setSupervisors(supervisorList);
      setRecentInspections(historyData.slice(0, 6));
    } catch (err) {
      console.error('Failed to load admin dashboard', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !stats) {
    return <LoadingSpinner fullScreen message="Loading Directorate Administrative Overview..." />;
  }

  // Filter supervisors for the directory table
  const filteredSupervisors = supervisors.filter((s) => {
    if (dutyFilter === 'on-duty' && s.dutyStatus !== 'on-duty') return false;
    if (dutyFilter === 'off-duty' && s.dutyStatus === 'on-duty') return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.badgeNumber.toLowerCase().includes(q) ||
      s.zone.toLowerCase().includes(q) ||
      s.district.toLowerCase().includes(q)
    );
  });

  const onDutyCount = supervisors.filter((s) => s.dutyStatus === 'on-duty').length;
  const offDutyCount = supervisors.filter((s) => s.dutyStatus !== 'on-duty').length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Directorate Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1 border-b border-[#E8E1D2] dark:border-[#3F4A43]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#EEF3EF] dark:bg-[#23352B] text-[#426B5A] dark:text-[#8FAF9A] border border-[#8FAF9A]/40 uppercase tracking-wide">
              Directorate Command HQ
            </span>
            <span className="text-xs text-[#66706A] dark:text-[#A8B2AA]">
              Ministry of Consumer Affairs &bull; Legal Metrology Surveillance
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#303530] dark:text-white mt-1 tracking-tight">
            Administrative Enforcement Dashboard
          </h1>
          <p className="text-xs text-[#66706A] dark:text-[#A8B2AA] mt-0.5">
            Real-time zonal supervisor deployment, field inspection activity, and statutory compliance oversight.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/supervisor-dossier')}
            leftIcon={<Users className="w-3.5 h-3.5 text-[#426B5A] dark:text-[#8FAF9A]" />}
            className="text-xs font-semibold cursor-pointer"
          >
            Supervisor Dossiers
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/admin-profile')}
            leftIcon={<UserCheck className="w-3.5 h-3.5 text-[#426B5A] dark:text-[#8FAF9A]" />}
            className="text-xs font-semibold cursor-pointer"
          >
            Admin Profile
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid - Explicitly showing Required Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Total Supervisors */}
        <Card className="border-[#E8E1D2] dark:border-[#3F4A43] bg-white dark:bg-[#2B332E]">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#66706A] dark:text-[#A8B2AA]">
                Total Supervisors
              </span>
              <div className="p-2 rounded-xl bg-[#EEF3EF] dark:bg-[#23352B] text-[#426B5A] dark:text-[#8FAF9A]">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl sm:text-3xl font-bold text-[#303530] dark:text-white">
                {supervisors.length}
              </span>
              <p className="text-[11px] text-[#66706A] dark:text-[#A8B2AA] mt-0.5">
                All designated zonal officers
              </p>
            </div>
          </CardBody>
        </Card>

        {/* On-Duty Supervisors */}
        <Card className="border-[#E8E1D2] dark:border-[#3F4A43] bg-white dark:bg-[#2B332E]">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#426B5A] dark:text-[#8FAF9A]">
                On-Duty Supervisors
              </span>
              <div className="p-2 rounded-xl bg-[#EEF3EF] dark:bg-[#23352B] text-[#426B5A] dark:text-[#8FAF9A]">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-[#426B5A] dark:text-[#8FAF9A]">
                  {onDutyCount}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF3EF] text-[#426B5A] border border-[#8FAF9A]/50 dark:bg-[#23352B] dark:text-[#8FAF9A]">
                  LIVE PATROL
                </span>
              </div>
              <p className="text-[11px] text-[#66706A] dark:text-[#A8B2AA] mt-0.5">
                Actively conducting field audits
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Off-Duty Supervisors */}
        <Card className="border-[#E8E1D2] dark:border-[#3F4A43] bg-white dark:bg-[#2B332E]">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#66706A] dark:text-[#A8B2AA]">
                Off-Duty Supervisors
              </span>
              <div className="p-2 rounded-xl bg-[#F4F1E9] dark:bg-[#202622] text-[#66706A] dark:text-[#A8B2AA]">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl sm:text-3xl font-bold text-[#66706A] dark:text-[#D4D0C5]">
                {offDutyCount}
              </span>
              <p className="text-[11px] text-[#66706A] dark:text-[#A8B2AA] mt-0.5">
                Stand-down / off field rotation
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Inspection Activity */}
        <Card className="border-[#E8E1D2] dark:border-[#3F4A43] bg-white dark:bg-[#2B332E]">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#66706A] dark:text-[#A8B2AA]">
                Inspection Activity
              </span>
              <div className="p-2 rounded-xl bg-[#F6F0E4] dark:bg-[#3C3626] text-[#735624] dark:text-[#EFE2BE]">
                <FileCheck2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl sm:text-3xl font-bold text-[#303530] dark:text-white">
                {stats.totalInspectionsCount}
              </span>
              <p className="text-[11px] text-[#66706A] dark:text-[#A8B2AA] mt-0.5">
                {stats.noticesIssuedCount} notices &bull; {stats.seizuresCount} seizures
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Compliance Overview */}
        <Card className="col-span-2 sm:col-span-1 border-[#E8E1D2] dark:border-[#3F4A43] bg-white dark:bg-[#2B332E]">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#66706A] dark:text-[#A8B2AA]">
                Compliance Overview
              </span>
              <div className="p-2 rounded-xl bg-[#EEF3EF] dark:bg-[#23352B] text-[#426B5A] dark:text-[#8FAF9A]">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl sm:text-3xl font-bold text-[#426B5A] dark:text-[#8FAF9A]">
                {stats.averageComplianceScore}%
              </span>
              <p className="text-[11px] text-[#66706A] dark:text-[#A8B2AA] mt-0.5">
                National statutory index
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Compliance Overview Breakdown & Operational Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Compliance Overview Panel */}
        <div className="lg:col-span-7">
          <Card className="h-full border-[#E8E1D2] dark:border-[#3F4A43]">
            <CardHeader className="py-3 px-4 sm:px-5 border-b border-[#E8E1D2] dark:border-[#3F4A43] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#426B5A] dark:text-[#8FAF9A]" />
                <h2 className="text-sm font-bold text-[#303530] dark:text-white">
                  Compliance Overview & Statutory Infringement Analysis
                </h2>
              </div>
              <span className="text-[11px] text-[#66706A] dark:text-[#A8B2AA]">
                LM (Packaged Commodities) 2011
              </span>
            </CardHeader>
            <CardBody className="p-4 sm:p-5 space-y-4">
              <div className="p-3 rounded-xl bg-[#FAF9F5] dark:bg-[#202622] border border-[#E8E1D2] dark:border-[#3F4A43] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-[#303530] dark:text-white block">
                    National Legal Metrology Verification Index
                  </span>
                  <p className="text-[11px] text-[#66706A] dark:text-[#A8B2AA]">
                    Aggregated across all zonal field supervisor audit filings.
                  </p>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#426B5A] dark:text-[#8FAF9A]">
                    {stats.averageComplianceScore}%
                  </span>
                  <span className="text-xs text-[#66706A]">Overall Compliant</span>
                </div>
              </div>

              {/* Statutory Rule Infringement Distribution */}
              <div className="space-y-3 pt-1">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-[#303530] dark:text-[#D4D0C5]">
                      Rule 6(11) — Missing / Incorrect Unit Sale Price (USP)
                    </span>
                    <span className="font-bold text-[#8F4336] dark:text-[#F2C7BF]">42% of violations</span>
                  </div>
                  <div className="w-full h-2 bg-[#F4F1E9] dark:bg-[#202622] rounded-full overflow-hidden border border-[#E8E1D2] dark:border-[#3F4A43]">
                    <div className="h-full bg-[#8F4336] rounded-full" style={{ width: '42%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-[#303530] dark:text-[#D4D0C5]">
                      Rule 6(1)(c) — Non-standard Net Quantity Unit (e.g. gms instead of g)
                    </span>
                    <span className="font-bold text-[#735624] dark:text-[#E8D5B0]">28% of violations</span>
                  </div>
                  <div className="w-full h-2 bg-[#F4F1E9] dark:bg-[#202622] rounded-full overflow-hidden border border-[#E8E1D2] dark:border-[#3F4A43]">
                    <div className="h-full bg-[#D8C79B] dark:bg-[#A68846] rounded-full" style={{ width: '28%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-[#303530] dark:text-[#D4D0C5]">
                      Rule 9 Table 1 — Font Height Below Principal Display Area Minimum
                    </span>
                    <span className="font-bold text-[#426B5A] dark:text-[#8FAF9A]">18% of violations</span>
                  </div>
                  <div className="w-full h-2 bg-[#F4F1E9] dark:bg-[#202622] rounded-full overflow-hidden border border-[#E8E1D2] dark:border-[#3F4A43]">
                    <div className="h-full bg-[#426B5A] dark:bg-[#6F9B84] rounded-full" style={{ width: '18%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-[#303530] dark:text-[#D4D0C5]">
                      Rule 6(1)(e) — Incomplete MRP / Missing Tax Inclusivity Declaration
                    </span>
                    <span className="font-bold text-[#66706A] dark:text-[#A8B2AA]">12% of violations</span>
                  </div>
                  <div className="w-full h-2 bg-[#F4F1E9] dark:bg-[#202622] rounded-full overflow-hidden border border-[#E8E1D2] dark:border-[#3F4A43]">
                    <div className="h-full bg-[#66706A] rounded-full" style={{ width: '12%' }} />
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Zonal Patrol Distribution Summary */}
        <div className="lg:col-span-5">
          <Card className="h-full border-[#E8E1D2] dark:border-[#3F4A43]">
            <CardHeader className="py-3 px-4 sm:px-5 border-b border-[#E8E1D2] dark:border-[#3F4A43] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#426B5A] dark:text-[#8FAF9A]" />
                <h2 className="text-sm font-bold text-[#303530] dark:text-white">
                  Live Zonal Deployment Status
                </h2>
              </div>
              <span className="text-[11px] text-[#426B5A] dark:text-[#8FAF9A] font-semibold">
                {onDutyCount} Officers Active
              </span>
            </CardHeader>
            <CardBody className="p-4 sm:p-5 space-y-3">
              {supervisors.slice(0, 4).map((s) => {
                const isOnDuty = s.dutyStatus === 'on-duty';
                return (
                  <div
                    key={s.id}
                    onClick={() => navigate(`/supervisor-dossier/${s.id}`)}
                    className="p-3 rounded-xl border border-[#E8E1D2] dark:border-[#3F4A43] hover:border-[#8FAF9A] bg-[#FAF9F5]/60 dark:bg-[#202622]/60 hover:bg-white dark:hover:bg-[#2B332E] transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isOnDuty
                          ? 'bg-[#EEF3EF] text-[#426B5A] dark:bg-[#23352B] dark:text-[#8FAF9A]'
                          : 'bg-[#F4F1E9] text-[#66706A] dark:bg-[#202622] dark:text-[#A8B2AA]'
                      }`}>
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#303530] dark:text-white">
                            {s.name}
                          </span>
                          <span className="font-mono text-[10px] text-[#66706A] dark:text-[#A8B2AA]">
                            {s.id}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#66706A] dark:text-[#A8B2AA]">
                          {s.zone} &bull; {s.lastActive || 'Active today'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isOnDuty
                          ? 'bg-[#EEF3EF] text-[#426B5A] border border-[#8FAF9A]/50 dark:bg-[#23352B] dark:text-[#8FAF9A]'
                          : 'bg-[#F4F1E9] text-[#66706A] border border-[#E8E1D2] dark:bg-[#202622] dark:text-[#A8B2AA]'
                      }`}>
                        {isOnDuty ? 'ON DUTY' : 'OFF DUTY'}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#66706A]" />
                    </div>
                  </div>
                );
              })}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* SUPERVISOR DIRECTORY (Primary Requested Section) */}
      <Card className="border-[#E8E1D2] dark:border-[#3F4A43]">
        <CardHeader className="py-3.5 px-4 sm:px-6 border-b border-[#E8E1D2] dark:border-[#3F4A43] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#426B5A] dark:text-[#8FAF9A]" />
              <h2 className="text-base font-bold text-[#303530] dark:text-white">
                Supervisor Directory
              </h2>
            </div>
            <p className="text-xs text-[#66706A] dark:text-[#A8B2AA] mt-0.5">
              Authorized field officers roster. Click any supervisor to open their full dossier.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#66706A]" />
              <input
                id="search-supervisors-input"
                type="text"
                placeholder="Search supervisor, ID, zone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#E8E1D2] dark:border-[#3F4A43] bg-white dark:bg-[#202622] text-[#303530] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#426B5A]"
              />
            </div>

            {/* Duty Status Filter Pills */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#F4F1E9] dark:bg-[#202622] border border-[#E8E1D2] dark:border-[#3F4A43] w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setDutyFilter('all')}
                className={`flex-1 sm:flex-none px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                  dutyFilter === 'all'
                    ? 'bg-white text-[#426B5A] shadow-xs dark:bg-[#2B332E] dark:text-[#8FAF9A]'
                    : 'text-[#66706A] hover:text-[#303530] dark:text-[#A8B2AA]'
                }`}
              >
                All ({supervisors.length})
              </button>
              <button
                type="button"
                onClick={() => setDutyFilter('on-duty')}
                className={`flex-1 sm:flex-none px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                  dutyFilter === 'on-duty'
                    ? 'bg-white text-[#426B5A] shadow-xs dark:bg-[#2B332E] dark:text-[#8FAF9A]'
                    : 'text-[#66706A] hover:text-[#303530] dark:text-[#A8B2AA]'
                }`}
              >
                ON DUTY ({onDutyCount})
              </button>
              <button
                type="button"
                onClick={() => setDutyFilter('off-duty')}
                className={`flex-1 sm:flex-none px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                  dutyFilter === 'off-duty'
                    ? 'bg-white text-[#426B5A] shadow-xs dark:bg-[#2B332E] dark:text-[#8FAF9A]'
                    : 'text-[#66706A] hover:text-[#303530] dark:text-[#A8B2AA]'
                }`}
              >
                OFF DUTY ({offDutyCount})
              </button>
            </div>
          </div>
        </CardHeader>

        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] dark:bg-[#202622] text-[#66706A] dark:text-[#A8B2AA] border-b border-[#E8E1D2] dark:border-[#3F4A43]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Supervisor Name</th>
                  <th className="py-3 px-4 font-semibold">Supervisor ID</th>
                  <th className="py-3 px-4 font-semibold">Jurisdiction Zone</th>
                  <th className="py-3 px-4 font-semibold">Duty Status</th>
                  <th className="py-3 px-4 font-semibold">Inspections / Activity</th>
                  <th className="py-3 px-4 font-semibold">Last Active Information</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E1D2]/60 dark:divide-[#3F4A43]/60">
                {filteredSupervisors.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-xs text-[#66706A]">
                      No supervisors match the selected search criteria or duty filter.
                    </td>
                  </tr>
                ) : (
                  filteredSupervisors.map((s) => {
                    const isOnDuty = s.dutyStatus === 'on-duty';
                    return (
                      <tr
                        key={s.id}
                        id={`supervisor-row-${s.id}`}
                        onClick={() => navigate(`/supervisor-dossier/${s.id}`)}
                        className="hover:bg-[#FAF9F5]/80 dark:hover:bg-[#202622]/40 transition-colors cursor-pointer group"
                      >
                        {/* Supervisor Name */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#EEF3EF] dark:bg-[#23352B] text-[#426B5A] dark:text-[#8FAF9A] font-bold text-xs flex items-center justify-center border border-[#8FAF9A]/30">
                              {s.name.charAt(0)}
                            </div>
                            <div>
                              <span className="font-bold text-[#303530] dark:text-white block group-hover:text-[#426B5A] transition-colors">
                                {s.name}
                              </span>
                              <span className="text-[11px] text-[#66706A] dark:text-[#A8B2AA]">
                                Badge: {s.badgeNumber}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Supervisor ID */}
                        <td className="py-3 px-4 font-mono font-bold text-[#426B5A] dark:text-[#8FAF9A]">
                          {s.id}
                        </td>

                        {/* Zone */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 text-[#303530] dark:text-[#D4D0C5]">
                            <MapPin className="w-3.5 h-3.5 text-[#66706A] shrink-0" />
                            <span className="font-medium">{s.zone}</span>
                          </div>
                          <span className="text-[10px] text-[#66706A] block pl-5">
                            {s.district}
                          </span>
                        </td>

                        {/* Duty Status */}
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            isOnDuty
                              ? 'bg-[#EEF3EF] text-[#426B5A] border border-[#8FAF9A]/60 dark:bg-[#23352B] dark:text-[#8FAF9A] dark:border-[#4A6E59]'
                              : 'bg-[#F4F1E9] text-[#66706A] border border-[#E8E1D2] dark:bg-[#202622] dark:text-[#D4D0C5] dark:border-[#3F4A43]'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              isOnDuty ? 'bg-[#426B5A] dark:bg-[#8FAF9A]' : 'bg-[#66706A]'
                            }`} />
                            {isOnDuty ? 'ON DUTY' : 'OFF DUTY'}
                          </span>
                        </td>

                        {/* Inspections / Activity */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#303530] dark:text-white">
                              {s.totalInspections} audits
                            </span>
                            <span className="text-[11px] text-[#8F4336] dark:text-[#F2C7BF] font-semibold">
                              ({s.violationsFound} non-compliant)
                            </span>
                          </div>
                          <div className="w-24 h-1.5 bg-[#F4F1E9] dark:bg-[#202622] rounded-full overflow-hidden mt-1">
                            <div
                              className="h-full bg-[#426B5A] dark:bg-[#8FAF9A] rounded-full"
                              style={{ width: `${s.complianceRate}%` }}
                            />
                          </div>
                        </td>

                        {/* Last Active Information */}
                        <td className="py-3 px-4 text-[#66706A] dark:text-[#A8B2AA]">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#66706A] shrink-0" />
                            <span className="text-xs font-medium text-[#303530] dark:text-[#D4D0C5]">
                              {s.lastActive || (isOnDuty ? '15 mins ago' : 'Yesterday')}
                            </span>
                          </div>
                          {s.currentLocation && (
                            <span className="text-[10px] text-[#66706A] dark:text-[#A8B2AA] block pl-5 truncate max-w-xs">
                              {s.currentLocation}
                            </span>
                          )}
                        </td>

                        {/* Action: Open Dossier */}
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/supervisor-dossier/${s.id}`);
                            }}
                            className="text-xs font-semibold cursor-pointer"
                            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                          >
                            Open Dossier
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* RECENT INSPECTION ACTIVITY (Required Section) */}
      <Card className="border-[#E8E1D2] dark:border-[#3F4A43]">
        <CardHeader className="py-3.5 px-4 sm:px-6 border-b border-[#E8E1D2] dark:border-[#3F4A43] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-[#426B5A] dark:text-[#8FAF9A]" />
              <h2 className="text-base font-bold text-[#303530] dark:text-white">
                Recent Field Inspection Activity
              </h2>
            </div>
            <p className="text-xs text-[#66706A] dark:text-[#A8B2AA] mt-0.5">
              Live audit stream submitted from across territorial inspection divisions.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#426B5A] dark:text-[#8FAF9A]">
            {recentInspections.length} Latest Records
          </span>
        </CardHeader>

        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] dark:bg-[#202622] text-[#66706A] dark:text-[#A8B2AA] border-b border-[#E8E1D2] dark:border-[#3F4A43]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Inspection ID</th>
                  <th className="py-3 px-4 font-semibold">Retail Store / Establishment</th>
                  <th className="py-3 px-4 font-semibold">Packaged Commodity</th>
                  <th className="py-3 px-4 font-semibold">Reporting Supervisor</th>
                  <th className="py-3 px-4 font-semibold">Compliance Status</th>
                  <th className="py-3 px-4 font-semibold">Statutory Action Taken</th>
                  <th className="py-3 px-4 font-semibold">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E1D2]/60 dark:divide-[#3F4A43]/60">
                {recentInspections.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#FAF9F5]/80 dark:hover:bg-[#202622]/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-[#426B5A] dark:text-[#8FAF9A]">
                      {item.id}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-[#303530] dark:text-white block">
                        {item.storeName}
                      </span>
                      <span className="text-[11px] text-[#66706A] dark:text-[#A8B2AA]">
                        {item.city}, {item.district}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-[#303530] dark:text-[#D4D0C5] block">
                        {item.extractedData.commodityName}
                      </span>
                      <span className="text-[11px] text-[#66706A] dark:text-[#A8B2AA]">
                        {item.extractedData.brandName} &bull; {item.extractedData.netQuantity?.declared}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-[#303530] dark:text-[#D4D0C5]">
                          {item.inspectorName}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-[#66706A] dark:text-[#A8B2AA]">
                        {item.inspectorId || item.badgeNumber}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusPill status={item.status} size="sm" />
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[#F4F1E9] dark:bg-[#202622] text-[#303530] dark:text-white border border-[#E8E1D2] dark:border-[#3F4A43]">
                        {item.actionTaken}
                      </span>
                      {item.noticeNumber && (
                        <span className="block font-mono text-[10px] text-[#66706A] mt-0.5">
                          {item.noticeNumber}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[#66706A] dark:text-[#A8B2AA] whitespace-nowrap">
                      <span>{formatDate(item.inspectionDate)}</span>
                      <span className="block text-[10px]">{item.timestamp}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
