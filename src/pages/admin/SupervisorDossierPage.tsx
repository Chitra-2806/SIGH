import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Shield,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Clock,
  FileCheck2,
  AlertTriangle,
  Scale,
  CheckCircle2,
  TrendingUp,
  Target,
  Award,
  Activity,
  History,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusPill } from '../../components/common/StatusPill';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { apiService } from '../../services/api';
import { SupervisorSummary, InspectionRecord, SupervisorActivityLog } from '../../types';
import { formatDate } from '../../utils/formatters';

export const SupervisorDossierPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [allSupervisors, setAllSupervisors] = useState<SupervisorSummary[]>([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState<SupervisorSummary | null>(null);
  const [inspections, setInspections] = useState<InspectionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    loadDossierData();
  }, [id]);

  const loadDossierData = async () => {
    setIsLoading(true);
    try {
      const [supervisorsList, allInspections] = await Promise.all([
        apiService.getSupervisors(),
        apiService.getInspectionHistory(),
      ]);
      setAllSupervisors(supervisorsList);

      // Determine active supervisor: by route ID or default to first
      let current = supervisorsList[0];
      if (id) {
        const found = supervisorsList.find((s) => s.id === id);
        if (found) current = found;
      }
      setSelectedSupervisor(current);

      // Filter inspections matching current supervisor or show representative ones
      const matching = allInspections.filter(
        (h) => h.inspectorId === current?.id || h.badgeNumber === current?.badgeNumber
      );
      setInspections(matching.length > 0 ? matching : allInspections.slice(0, 4));
    } catch (err) {
      console.error('Failed to load supervisor dossier', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSupervisor = (newId: string) => {
    navigate(`/supervisor-dossier/${newId}`);
  };

  const handleDutyStatusToggle = async (newStatus: 'on-duty' | 'off-duty') => {
    if (!selectedSupervisor) return;
    setIsUpdatingStatus(true);
    try {
      const updated = await apiService.updateSupervisorDutyStatus(selectedSupervisor.id, newStatus);
      setSelectedSupervisor(updated);
      setAllSupervisors((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      );
    } catch (err) {
      console.error('Failed to update supervisor duty status', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading || !selectedSupervisor) {
    return <LoadingSpinner fullScreen message="Compiling Supervisor Dossier & Enforcement History..." />;
  }

  const isOnDuty = selectedSupervisor.dutyStatus === 'on-duty';
  const monthlyQuota = selectedSupervisor.monthlyQuota || 100;
  const completedQuota = selectedSupervisor.completedQuota || selectedSupervisor.totalInspections;
  const quotaPercent = Math.min(Math.round((completedQuota / monthlyQuota) * 100), 100);

  // Default activity history if not defined
  const activityLogs: SupervisorActivityLog[] = selectedSupervisor.activityHistory || [
    {
      id: 'ACT-DEFAULT-1',
      timestamp: 'Today, 14:25 IST',
      title: 'Form III Compounding Notice Issued',
      detail: 'Reliance Smart Superstore, Plot 12 Vikas Marg. Non-standard unit symbol & missing USP.',
      type: 'notice',
    },
    {
      id: 'ACT-DEFAULT-2',
      timestamp: 'Today, 09:30 IST',
      title: 'Field Patrol Sign-In Authenticated',
      detail: `Geo-verified at ${selectedSupervisor.zone} operational division.`,
      type: 'checkin',
    },
    {
      id: 'ACT-DEFAULT-3',
      timestamp: 'Yesterday, 15:45 IST',
      title: 'Commercial Wholesale Packaging Audit',
      detail: 'Inspected 14 packaged dry commodities for mandatory declaration compliance.',
      type: 'inspection',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Supervisor Switcher Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#E8E1D2] dark:border-[#3F4A43]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin-dashboard')}
            className="p-2 rounded-lg border border-[#E8E1D2] dark:border-[#3F4A43] hover:bg-[#F4F1E9] dark:hover:bg-[#2B332E] text-[#66706A] dark:text-[#A8B2AA] transition-colors cursor-pointer"
            aria-label="Back to Admin Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#426B5A] dark:text-[#8FAF9A] uppercase tracking-wider">
                Personnel Enforcement Dossier
              </span>
              <span className="text-xs text-[#66706A]">&bull;</span>
              <span className="text-xs font-mono font-bold text-[#303530] dark:text-white">
                {selectedSupervisor.id}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#303530] dark:text-white tracking-tight">
              {selectedSupervisor.name}
            </h1>
          </div>
        </div>

        {/* Supervisor Quick Select Dropdown */}
        <div className="flex items-center gap-2.5">
          <label htmlFor="supervisor-switcher" className="text-xs font-medium text-[#66706A] dark:text-[#A8B2AA]">
            Switch Supervisor:
          </label>
          <select
            id="supervisor-switcher"
            value={selectedSupervisor.id}
            onChange={(e) => handleSelectSupervisor(e.target.value)}
            className="text-xs font-semibold rounded-lg border border-[#E8E1D2] dark:border-[#3F4A43] bg-white dark:bg-[#202622] text-[#303530] dark:text-white px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#426B5A] cursor-pointer"
          >
            {allSupervisors.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.id} &bull; {s.zone})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Profile & Duty Status (Left), Stats & Quota & History (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Supervisor Profile, ID, Zone & Duty Status */}
        <div className="lg:col-span-4 space-y-5">
          {/* Profile Card */}
          <Card className="border-[#E8E1D2] dark:border-[#3F4A43]">
            <CardBody className="p-5 space-y-4">
              <div className="flex items-center gap-3.5 pb-4 border-b border-[#E8E1D2] dark:border-[#3F4A43]">
                <div className="w-14 h-14 rounded-2xl bg-[#EEF3EF] dark:bg-[#23352B] border border-[#8FAF9A]/40 text-[#426B5A] dark:text-[#8FAF9A] flex items-center justify-center font-bold text-xl shadow-xs">
                  {selectedSupervisor.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-bold text-[#303530] dark:text-white text-base truncate">
                    {selectedSupervisor.name}
                  </h2>
                  <p className="text-xs text-[#66706A] dark:text-[#A8B2AA]">
                    Senior Legal Metrology Inspector
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-[11px] font-bold text-[#426B5A] dark:text-[#8FAF9A]">
                      {selectedSupervisor.id}
                    </span>
                    <span className="text-[10px] text-[#66706A]">&bull;</span>
                    <span className="font-mono text-[11px] text-[#66706A]">
                      Badge: {selectedSupervisor.badgeNumber}
                    </span>
                  </div>
                </div>
              </div>

              {/* Duty Status Manager with Admin Toggle */}
              <div className="p-3.5 rounded-xl bg-[#FAF9F5] dark:bg-[#202622] border border-[#E8E1D2] dark:border-[#3F4A43] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#303530] dark:text-white">
                    Enforcement Duty Status
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    isOnDuty
                      ? 'bg-[#EEF3EF] text-[#426B5A] border border-[#8FAF9A]/60 dark:bg-[#23352B] dark:text-[#8FAF9A]'
                      : 'bg-[#F4F1E9] text-[#66706A] border border-[#E8E1D2] dark:bg-[#202622] dark:text-[#D4D0C5]'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      isOnDuty ? 'bg-[#426B5A] dark:bg-[#8FAF9A]' : 'bg-[#66706A]'
                    }`} />
                    {isOnDuty ? 'ON DUTY' : 'OFF DUTY'}
                  </span>
                </div>

                <p className="text-[11px] text-[#66706A] dark:text-[#A8B2AA]">
                  Toggle administrative roster status for this field officer:
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    disabled={isUpdatingStatus}
                    onClick={() => handleDutyStatusToggle('on-duty')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      isOnDuty
                        ? 'bg-[#426B5A] text-white border-[#426B5A] shadow-xs'
                        : 'bg-white dark:bg-[#2B332E] border-[#E8E1D2] dark:border-[#3F4A43] text-[#66706A] hover:text-[#303530]'
                    }`}
                  >
                    Set ON DUTY
                  </button>
                  <button
                    type="button"
                    disabled={isUpdatingStatus}
                    onClick={() => handleDutyStatusToggle('off-duty')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      !isOnDuty
                        ? 'bg-[#66706A] text-white border-[#66706A] shadow-xs'
                        : 'bg-white dark:bg-[#2B332E] border-[#E8E1D2] dark:border-[#3F4A43] text-[#66706A] hover:text-[#303530]'
                    }`}
                  >
                    Set OFF DUTY
                  </button>
                </div>
              </div>

              {/* Zone & Jurisdictional Information */}
              <div className="space-y-2.5 text-xs text-[#303530] dark:text-[#D4D0C5]">
                <div className="flex items-start gap-2.5 py-1">
                  <MapPin className="w-4 h-4 text-[#426B5A] dark:text-[#8FAF9A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Jurisdiction Zone</span>
                    <span className="text-[#66706A] dark:text-[#A8B2AA]">
                      {selectedSupervisor.zone} &bull; {selectedSupervisor.district}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 py-1">
                  <Clock className="w-4 h-4 text-[#426B5A] dark:text-[#8FAF9A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Last Active / Field Post</span>
                    <span className="text-[#66706A] dark:text-[#A8B2AA]">
                      {selectedSupervisor.lastActive || 'Today on active patrol'}
                    </span>
                    {selectedSupervisor.currentLocation && (
                      <span className="block text-[11px] text-[#426B5A] dark:text-[#8FAF9A] font-medium mt-0.5">
                        {selectedSupervisor.currentLocation}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2.5 py-1">
                  <Mail className="w-4 h-4 text-[#426B5A] dark:text-[#8FAF9A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Official Email</span>
                    <span className="font-mono text-[#66706A] dark:text-[#A8B2AA]">
                      {selectedSupervisor.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 py-1">
                  <Phone className="w-4 h-4 text-[#426B5A] dark:text-[#8FAF9A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Government Direct Line</span>
                    <span className="text-[#66706A] dark:text-[#A8B2AA]">
                      {selectedSupervisor.contactNumber}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 py-1">
                  <Calendar className="w-4 h-4 text-[#426B5A] dark:text-[#8FAF9A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Commissioning Date</span>
                    <span className="text-[#66706A] dark:text-[#A8B2AA]">
                      {formatDate(selectedSupervisor.joinedDate)}
                    </span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Quota & Operational Progress Card */}
          <Card className="border-[#E8E1D2] dark:border-[#3F4A43]">
            <CardHeader className="py-3 px-4 border-b border-[#E8E1D2] dark:border-[#3F4A43] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#426B5A] dark:text-[#8FAF9A]" />
                <h3 className="text-sm font-bold text-[#303530] dark:text-white">
                  Monthly Quota & Progress
                </h3>
              </div>
              <span className="text-xs font-bold text-[#426B5A] dark:text-[#8FAF9A]">
                {quotaPercent}% Target
              </span>
            </CardHeader>
            <CardBody className="p-4 space-y-3.5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-[#303530] dark:text-[#D4D0C5]">
                    Statutory Field Audits Completed
                  </span>
                  <span className="font-mono font-bold text-[#303530] dark:text-white">
                    {completedQuota} / {monthlyQuota}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-[#F4F1E9] dark:bg-[#202622] rounded-full overflow-hidden border border-[#E8E1D2] dark:border-[#3F4A43]">
                  <div
                    className="h-full bg-[#426B5A] dark:bg-[#8FAF9A] rounded-full"
                    style={{ width: `${quotaPercent}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div className="p-2.5 rounded-lg bg-[#FAF9F5] dark:bg-[#202622] border border-[#E8E1D2] dark:border-[#3F4A43]">
                  <span className="text-[10px] uppercase font-bold text-[#66706A] block">
                    High-Risk Stores
                  </span>
                  <span className="text-base font-bold text-[#303530] dark:text-white">
                    18 / 20
                  </span>
                  <span className="text-[10px] text-[#426B5A] font-semibold block mt-0.5">
                    90% Audited
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#FAF9F5] dark:bg-[#202622] border border-[#E8E1D2] dark:border-[#3F4A43]">
                  <span className="text-[10px] uppercase font-bold text-[#66706A] block">
                    Avg Time / Audit
                  </span>
                  <span className="text-base font-bold text-[#303530] dark:text-white">
                    4.2 min
                  </span>
                  <span className="text-[10px] text-[#426B5A] font-semibold block mt-0.5">
                    Fast OCR Flow
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column: Statistics, Recent Inspections, Compliance Activity & Activity History */}
        <div className="lg:col-span-8 space-y-5">
          {/* Inspection Statistics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="border-[#E8E1D2] dark:border-[#3F4A43]">
              <CardBody className="p-3.5">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#66706A] dark:text-[#A8B2AA] block">
                  Total Inspections
                </span>
                <span className="text-2xl font-bold text-[#303530] dark:text-white mt-1 block">
                  {selectedSupervisor.totalInspections}
                </span>
                <span className="text-[10px] text-[#66706A] mt-0.5 block">
                  Official submissions
                </span>
              </CardBody>
            </Card>

            <Card className="border-[#E8E1D2] dark:border-[#3F4A43]">
              <CardBody className="p-3.5">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#8F4336] dark:text-[#F2C7BF] block">
                  Infringements Logged
                </span>
                <span className="text-2xl font-bold text-[#8F4336] dark:text-[#F2C7BF] mt-1 block">
                  {selectedSupervisor.violationsFound}
                </span>
                <span className="text-[10px] text-[#66706A] mt-0.5 block">
                  Rule non-compliances
                </span>
              </CardBody>
            </Card>

            <Card className="border-[#E8E1D2] dark:border-[#3F4A43]">
              <CardBody className="p-3.5">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#426B5A] dark:text-[#8FAF9A] block">
                  Compliance Rate
                </span>
                <span className="text-2xl font-bold text-[#426B5A] dark:text-[#8FAF9A] mt-1 block">
                  {selectedSupervisor.complianceRate}%
                </span>
                <span className="text-[10px] text-[#66706A] mt-0.5 block">
                  Zonal legal index
                </span>
              </CardBody>
            </Card>

            <Card className="border-[#E8E1D2] dark:border-[#3F4A43]">
              <CardBody className="p-3.5">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#735624] dark:text-[#E8D5B0] block">
                  Statutory Notices
                </span>
                <span className="text-2xl font-bold text-[#735624] dark:text-[#E8D5B0] mt-1 block">
                  {Math.round(selectedSupervisor.violationsFound * 0.8)}
                </span>
                <span className="text-[10px] text-[#66706A] mt-0.5 block">
                  Form III notices
                </span>
              </CardBody>
            </Card>
          </div>

          {/* Compliance Activity Breakdown */}
          <Card className="border-[#E8E1D2] dark:border-[#3F4A43]">
            <CardHeader className="py-3 px-4 sm:px-5 border-b border-[#E8E1D2] dark:border-[#3F4A43] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#426B5A] dark:text-[#8FAF9A]" />
                <h3 className="text-sm font-bold text-[#303530] dark:text-white">
                  Compliance Activity & Statutory Enforcements
                </h3>
              </div>
              <span className="text-xs text-[#66706A]">
                Beat: {selectedSupervisor.zone}
              </span>
            </CardHeader>
            <CardBody className="p-4 sm:p-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#FAF9F5] dark:bg-[#202622] border border-[#E8E1D2] dark:border-[#3F4A43]">
                  <span className="font-bold text-[#303530] dark:text-white block">
                    Unit Sale Price (Rule 6.11)
                  </span>
                  <p className="text-[11px] text-[#66706A] mt-1">
                    12 infringements detected on packaged edible oils and cereal products.
                  </p>
                  <span className="inline-block mt-2 font-mono text-[10px] font-bold text-[#8F4336] dark:text-[#F2C7BF]">
                    Primary Zonal Focus
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF9F5] dark:bg-[#202622] border border-[#E8E1D2] dark:border-[#3F4A43]">
                  <span className="font-bold text-[#303530] dark:text-white block">
                    Net Quantity Units (Rule 11)
                  </span>
                  <p className="text-[11px] text-[#66706A] mt-1">
                    8 notices issued for use of non-standard "gms" & "kgs" on confectionery.
                  </p>
                  <span className="inline-block mt-2 font-mono text-[10px] font-bold text-[#735624] dark:text-[#E8D5B0]">
                    Statutory Compounded
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF9F5] dark:bg-[#202622] border border-[#E8E1D2] dark:border-[#3F4A43]">
                  <span className="font-bold text-[#303530] dark:text-white block">
                    Font Height (Rule 9 Table 1)
                  </span>
                  <p className="text-[11px] text-[#66706A] mt-1">
                    5 warnings issued where numeral height was under the mandatory 4.0mm.
                  </p>
                  <span className="inline-block mt-2 font-mono text-[10px] font-bold text-[#426B5A] dark:text-[#8FAF9A]">
                    Re-audit Scheduled
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Recent Inspections Filed by this Supervisor */}
          <Card className="border-[#E8E1D2] dark:border-[#3F4A43]">
            <CardHeader className="py-3 px-4 sm:px-5 border-b border-[#E8E1D2] dark:border-[#3F4A43] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#426B5A] dark:text-[#8FAF9A]" />
                <h3 className="text-sm font-bold text-[#303530] dark:text-white">
                  Recent Inspections Filed by {selectedSupervisor.name}
                </h3>
              </div>
              <span className="text-xs font-semibold text-[#426B5A] dark:text-[#8FAF9A]">
                {inspections.length} Audit Records
              </span>
            </CardHeader>
            <CardBody className="p-0">
              <div className="divide-y divide-[#E8E1D2]/60 dark:divide-[#3F4A43]/60">
                {inspections.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 hover:bg-[#FAF9F5]/80 dark:hover:bg-[#202622]/40 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-[#426B5A] dark:text-[#8FAF9A]">
                          {item.id}
                        </span>
                        <StatusPill status={item.status} size="sm" />
                        <span className="text-[#66706A] dark:text-[#A8B2AA]">
                          &bull; {formatDate(item.inspectionDate)}
                        </span>
                      </div>
                      <p className="font-bold text-[#303530] dark:text-white">
                        {item.extractedData.commodityName} &bull; {item.storeName}
                      </p>
                      <p className="text-[11px] text-[#66706A] dark:text-[#A8B2AA]">
                        Action: <span className="font-semibold text-[#303530] dark:text-[#D4D0C5]">{item.actionTaken}</span>
                        {item.noticeNumber && ` &bull; Notice: ${item.noticeNumber}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="font-bold text-xs text-[#426B5A] dark:text-[#8FAF9A]">
                        Score: {item.overallScore}/100
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Relevant Activity History (Chronological Timeline) */}
          <Card className="border-[#E8E1D2] dark:border-[#3F4A43]">
            <CardHeader className="py-3 px-4 sm:px-5 border-b border-[#E8E1D2] dark:border-[#3F4A43] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#426B5A] dark:text-[#8FAF9A]" />
                <h3 className="text-sm font-bold text-[#303530] dark:text-white">
                  Relevant Operational Activity History
                </h3>
              </div>
              <span className="text-xs text-[#66706A]">Chronological Audit Log</span>
            </CardHeader>
            <CardBody className="p-4 sm:p-5">
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8E1D2] dark:before:bg-[#3F4A43]">
                {activityLogs.map((act) => {
                  let badgeColor = 'bg-[#EEF3EF] text-[#426B5A] border-[#8FAF9A]';
                  if (act.type === 'notice') badgeColor = 'bg-[#FAF0ED] text-[#8F4336] border-[#D98273]';
                  if (act.type === 'seizure') badgeColor = 'bg-[#FDF2F0] text-[#8F4336] border-[#8F4336]';
                  if (act.type === 'training') badgeColor = 'bg-[#F4F1E9] text-[#66706A] border-[#E8E1D2]';

                  return (
                    <div key={act.id} className="relative">
                      <span className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 bg-white dark:bg-[#202622] ${
                        act.type === 'notice' || act.type === 'seizure'
                          ? 'border-[#8F4336]'
                          : 'border-[#426B5A]'
                      }`} />
                      <div className="text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#303530] dark:text-white">
                            {act.title}
                          </span>
                          <span className="text-[10px] text-[#66706A] dark:text-[#A8B2AA]">
                            {act.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#66706A] dark:text-[#A8B2AA] mt-0.5">
                          {act.detail}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
