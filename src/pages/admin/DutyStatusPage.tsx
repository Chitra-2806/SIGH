import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Radio,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  AlertCircle,
  Users,
  Search
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusPill } from '../../components/common/StatusPill';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Input } from '../../components/common/Input';
import { apiService } from '../../services/api';
import { SupervisorSummary } from '../../types';

export const DutyStatusPage: React.FC = () => {
  const navigate = useNavigate();
  const [supervisors, setSupervisors] = useState<SupervisorSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getSupervisors();
      setSupervisors(data);
    } catch (err) {
      console.error('Failed to load duty status', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (
    id: string,
    newStatus: 'on-duty' | 'off-duty' | 'on-leave'
  ) => {
    setUpdatingId(id);
    try {
      const updated = await apiService.updateSupervisorDutyStatus(id, newStatus);
      setSupervisors((prev) =>
        prev.map((s) => (s.id === id ? { ...s, dutyStatus: updated.dutyStatus } : s))
      );
    } catch (err) {
      console.error('Error toggling duty status', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const onDutyCount = supervisors.filter((s) => s.dutyStatus === 'on-duty').length;
  const offDutyCount = supervisors.filter((s) => s.dutyStatus === 'off-duty').length;
  const onLeaveCount = supervisors.filter((s) => s.dutyStatus === 'on-leave').length;

  const filtered = supervisors.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.badgeNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-emerald-500 animate-pulse" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Live Field Duty Command Board
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Real-time surveillance roster of Legal Metrology field supervisors and active patrol coordinates.
        </p>
      </div>

      {/* Duty Count Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-emerald-200 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/20">
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-700 dark:text-emerald-300">
                Active Field Duty
              </span>
              <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mt-0.5">
                {onDutyCount} Officers
              </p>
            </div>
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          </CardBody>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                Off Duty (Standby)
              </span>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                {offDutyCount} Officers
              </p>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
          </CardBody>
        </Card>

        <Card className="border-amber-200 dark:border-amber-900 bg-amber-50/40 dark:bg-amber-950/20">
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-700 dark:text-amber-300">
                Authorized Leave
              </span>
              <p className="text-2xl font-bold text-amber-800 dark:text-amber-200 mt-0.5">
                {onLeaveCount} Officers
              </p>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          </CardBody>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardBody className="p-4">
          <Input
            id="duty-search-input"
            placeholder="Search active officer by name, badge ID, or patrol circle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </CardBody>
      </Card>

      {/* Duty Board Grid */}
      {isLoading ? (
        <LoadingSpinner message="Polling live officer dispatch..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((s) => (
            <Card key={s.id} className="relative overflow-hidden">
              <CardBody className="p-5 space-y-3.5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-sm">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {s.name}
                      </h3>
                      <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                        {s.badgeNumber}
                      </p>
                    </div>
                  </div>
                  <StatusPill status={s.dutyStatus} size="sm" />
                </div>

                <div className="p-2.5 rounded-lg bg-[#FAF9F5] dark:bg-[#202622] text-xs space-y-1 border border-[#E8E1D2] dark:border-[#3F4A43]">
                  <div className="flex items-center gap-1.5 text-[#5C6B61] dark:text-[#D4D0C5]">
                    <MapPin className="w-3.5 h-3.5 text-[#8FAF9A]" />
                    <span>Jurisdiction: {s.zone} ({s.district})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#5C6B61] dark:text-[#D4D0C5]">
                    <Clock className="w-3.5 h-3.5 text-[#8FAF9A]" />
                    <span>Current Deployment: {s.currentLocation || 'Assigned to Circle Station'}</span>
                  </div>
                </div>

                {/* Duty Toggle Controls */}
                <div className="pt-2 border-t border-[#E8E1D2] dark:border-[#3F4A43] flex items-center justify-between">
                  <span className="text-[11px] text-[#5C6B61] dark:text-[#B0ACA0]">Duty Dispatch:</span>
                  <div className="flex gap-1.5">
                    <button
                      disabled={updatingId === s.id}
                      onClick={() => handleToggleStatus(s.id, 'on-duty')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                        s.dutyStatus === 'on-duty'
                          ? 'bg-[#426B5A] text-white'
                          : 'bg-[#EEF3EF] dark:bg-[#343D37] text-[#303530] dark:text-[#D4D0C5] hover:bg-[#FAF9F5]'
                      }`}
                    >
                      On Duty
                    </button>
                    <button
                      disabled={updatingId === s.id}
                      onClick={() => handleToggleStatus(s.id, 'off-duty')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                        s.dutyStatus === 'off-duty'
                          ? 'bg-[#66706A] text-white'
                          : 'bg-[#EEF3EF] dark:bg-[#343D37] text-[#303530] dark:text-[#D4D0C5] hover:bg-[#FAF9F5]'
                      }`}
                    >
                      Off Duty
                    </button>
                    <button
                      disabled={updatingId === s.id}
                      onClick={() => handleToggleStatus(s.id, 'on-leave')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                        s.dutyStatus === 'on-leave'
                          ? 'bg-[#735624] text-white'
                          : 'bg-[#EEF3EF] dark:bg-[#343D37] text-[#303530] dark:text-[#D4D0C5] hover:bg-[#FAF9F5]'
                      }`}
                    >
                      Leave
                    </button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
