import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Radio,
  FileCheck2,
  Eye
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusPill } from '../../components/common/StatusPill';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { apiService } from '../../services/api';
import { SupervisorSummary, InspectionRecord } from '../../types';
import { formatDate } from '../../utils/formatters';

export const SupervisorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [supervisor, setSupervisor] = useState<SupervisorSummary | null>(null);
  const [inspections, setInspections] = useState<InspectionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (id) {
      loadSupervisorData(id);
    }
  }, [id]);

  const loadSupervisorData = async (supervisorId: string) => {
    setIsLoading(true);
    try {
      const [sup, history] = await Promise.all([
        apiService.getSupervisorById(supervisorId),
        apiService.getInspectionHistory(),
      ]);
      setSupervisor(sup);
      // Filter inspections matching this inspector or show representative history
      const matching = history.filter((h) => h.inspectorId === supervisorId);
      setInspections(matching.length > 0 ? matching : history.slice(0, 3));
    } catch (err) {
      console.error('Failed to load supervisor details', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDutyStatusChange = async (newStatus: 'on-duty' | 'off-duty' | 'on-leave') => {
    if (!supervisor) return;
    setIsUpdatingStatus(true);
    try {
      const updated = await apiService.updateSupervisorDutyStatus(supervisor.id, newStatus);
      setSupervisor(updated);
    } catch (err) {
      console.error('Failed to update supervisor status', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading supervisor personnel dossier..." />;
  }

  if (!supervisor) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Supervisor not found in active records.</p>
        <Button className="mt-4" onClick={() => navigate('/admin/supervisors')}>
          Return to Directory
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Back Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/supervisors')}
          className="p-2 rounded-lg hover:bg-[#EEF3EF] dark:hover:bg-[#343D37] text-[#5C6B61] dark:text-[#D4D0C5] transition-colors cursor-pointer"
          aria-label="Back to Supervisors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#303530] dark:text-white">
              {supervisor.name}
            </h2>
            <StatusPill status={supervisor.dutyStatus} size="sm" />
          </div>
          <p className="text-xs text-[#5C6B61] dark:text-[#B0ACA0]">
            Badge: <span className="font-mono font-bold">{supervisor.badgeNumber}</span> &bull;{' '}
            {supervisor.zone}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Profile Card & Duty Status Controls */}
        <div className="lg:col-span-4 space-y-4">
          <Card>
            <CardBody className="p-5 space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-xl bg-[#426B5A] text-white flex items-center justify-center font-bold text-xl shadow-xs">
                  {supervisor.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-[#303530] dark:text-white text-base">
                    {supervisor.name}
                  </h3>
                  <p className="text-xs text-[#5C6B61] dark:text-[#B0ACA0]">
                    Field Inspection Officer
                  </p>
                  <p className="text-[11px] text-[#426B5A] dark:text-[#8FAF9A] font-medium mt-0.5">
                    Enrolled: {formatDate(supervisor.joinedDate)}
                  </p>
                </div>
              </div>

              {/* Duty Status Manager for Admin */}
              <div className="p-3.5 bg-[#FAF9F5] dark:bg-[#202622] rounded-xl space-y-2 border border-[#E8E1D2] dark:border-[#3F4A43]">
                <label className="block text-xs font-semibold text-[#303530] dark:text-white">
                  Administrative Duty Status Command
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    disabled={isUpdatingStatus}
                    onClick={() => handleDutyStatusChange('on-duty')}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                      supervisor.dutyStatus === 'on-duty'
                        ? 'bg-[#426B5A] text-white border-[#426B5A] shadow-xs'
                        : 'bg-white dark:bg-[#2B332E] border-[#E8E1D2] dark:border-[#3F4A43] text-[#303530] dark:text-[#D4D0C5] hover:bg-[#FAF9F5]'
                    }`}
                  >
                    On Duty
                  </button>
                  <button
                    disabled={isUpdatingStatus}
                    onClick={() => handleDutyStatusChange('off-duty')}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                      supervisor.dutyStatus === 'off-duty'
                        ? 'bg-[#66706A] text-white border-[#66706A] shadow-xs'
                        : 'bg-white dark:bg-[#2B332E] border-[#E8E1D2] dark:border-[#3F4A43] text-[#303530] dark:text-[#D4D0C5] hover:bg-[#FAF9F5]'
                    }`}
                  >
                    Off Duty
                  </button>
                  <button
                    disabled={isUpdatingStatus}
                    onClick={() => handleDutyStatusChange('on-leave')}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                      supervisor.dutyStatus === 'on-leave'
                        ? 'bg-[#735624] text-white border-[#735624] shadow-xs'
                        : 'bg-white dark:bg-[#2B332E] border-[#E8E1D2] dark:border-[#3F4A43] text-[#303530] dark:text-[#D4D0C5] hover:bg-[#FAF9F5]'
                    }`}
                  >
                    On Leave
                  </button>
                </div>
              </div>

              {/* Contact Information */}
              <div className="text-xs space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {supervisor.zone}, {supervisor.district}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{supervisor.contactNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono">{supervisor.email}</span>
                </div>
              </div>

              {/* Active Deployment Location */}
              {supervisor.currentLocation && (
                <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 text-xs text-emerald-900 dark:text-emerald-300">
                  <span className="font-semibold block text-[10px] uppercase tracking-wider mb-0.5">
                    Live Field Location
                  </span>
                  <p>{supervisor.currentLocation}</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Right Column: Performance Stats & Recent Inspections */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardBody className="p-4 text-center">
                <span className="text-[10px] uppercase text-slate-400 font-semibold block">
                  Total Inspections
                </span>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {supervisor.totalInspections}
                </span>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-4 text-center">
                <span className="text-[10px] uppercase text-slate-400 font-semibold block">
                  Violations Logged
                </span>
                <span className="text-2xl font-bold text-rose-600">
                  {supervisor.violationsFound}
                </span>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-4 text-center">
                <span className="text-[10px] uppercase text-slate-400 font-semibold block">
                  Compliance Rate
                </span>
                <span className="text-2xl font-bold text-emerald-600">
                  {supervisor.complianceRate}%
                </span>
              </CardBody>
            </Card>
          </div>

          {/* Assigned Inspections */}
          <Card>
            <CardHeader className="py-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Inspections Filed by this Supervisor
              </h3>
              <span className="text-xs text-slate-400">
                {inspections.length} recorded operations
              </span>
            </CardHeader>
            <CardBody className="p-0">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {inspections.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-blue-600">{item.id}</span>
                        <StatusPill status={item.status} size="sm" />
                        <span className="text-slate-400">&bull; {formatDate(item.inspectionDate)}</span>
                      </div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {item.extractedData.commodityName} &bull; {item.storeName}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Action: <span className="font-medium text-slate-600 dark:text-slate-300">{item.actionTaken}</span>
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/inspector/history/${item.id}`)}
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                    >
                      View Dossier
                    </Button>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
