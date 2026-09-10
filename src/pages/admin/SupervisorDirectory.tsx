import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  Shield,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { StatusPill } from '../../components/common/StatusPill';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { apiService } from '../../services/api';
import { SupervisorSummary } from '../../types';

export const SupervisorDirectory: React.FC = () => {
  const navigate = useNavigate();
  const [supervisors, setSupervisors] = useState<SupervisorSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDuty, setSelectedDuty] = useState<string>('all');

  useEffect(() => {
    loadSupervisors();
  }, []);

  const loadSupervisors = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getSupervisors();
      setSupervisors(data);
    } catch (err) {
      console.error('Failed to load supervisors', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = supervisors.filter((s) => {
    if (selectedDuty !== 'all' && s.dutyStatus !== selectedDuty) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.badgeNumber.toLowerCase().includes(q) ||
      s.zone.toLowerCase().includes(q) ||
      s.district.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Legal Metrology Field Supervisor Roster
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Directory of certified inspection officers, assigned zones, and enforcement metrics.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/admin/duty-status')}
          leftIcon={<Activity className="w-3.5 h-3.5 text-emerald-500" />}
        >
          View Live Duty Board
        </Button>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardBody className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              id="search-supervisors"
              placeholder="Search by name, badge number, or jurisdiction zone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div>
            <select
              id="filter-duty-status"
              aria-label="Filter by Duty Status"
              value={selectedDuty}
              onChange={(e) => setSelectedDuty(e.target.value)}
              className="w-full sm:w-auto text-xs font-medium rounded-lg border border-[#E8E1D2] dark:border-[#3F4A43] bg-white dark:bg-[#2B332E] text-[#303530] dark:text-[#F5F3EA] px-3 py-2.5 cursor-pointer"
            >
              <option value="all">All Duty Statuses</option>
              <option value="on-duty">On Duty (Active)</option>
              <option value="off-duty">Off Duty</option>
              <option value="on-leave">On Leave</option>
            </select>
          </div>
        </CardBody>
      </Card>

      {/* Supervisors Grid */}
      {isLoading ? (
        <LoadingSpinner message="Querying officer registry..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <Card
              key={s.id}
              interactive
              onClick={() => navigate(`/admin/supervisors/${s.id}`)}
              className="hover:shadow-md transition-shadow"
            >
              <CardBody className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#426B5A] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#303530] dark:text-white">
                        {s.name}
                      </h3>
                      <p className="text-xs font-mono text-[#5C6B61] dark:text-[#B0ACA0]">
                        {s.badgeNumber}
                      </p>
                    </div>
                  </div>
                  <StatusPill status={s.dutyStatus} size="sm" />
                </div>

                <div className="text-xs space-y-1 text-[#5C6B61] dark:text-[#D4D0C5]">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#8FAF9A]" />
                    <span>
                      {s.zone} &bull; {s.district}
                    </span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#8FAF9A]" />
                    <span>{s.contactNumber}</span>
                  </p>
                </div>

                {/* Performance Mini Bar */}
                <div className="pt-3 border-t border-[#E8E1D2] dark:border-[#3F4A43] grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 bg-[#FAF9F5] dark:bg-[#202622] rounded-lg border border-[#E8E1D2] dark:border-[#3F4A43]">
                    <span className="text-[10px] text-[#5C6B61] dark:text-[#B0ACA0] block uppercase">Inspections</span>
                    <span className="font-bold text-[#303530] dark:text-white text-sm">
                      {s.totalInspections}
                    </span>
                  </div>
                  <div className="p-2 bg-[#FAF9F5] dark:bg-[#202622] rounded-lg border border-[#E8E1D2] dark:border-[#3F4A43]">
                    <span className="text-[10px] text-[#5C6B61] dark:text-[#B0ACA0] block uppercase">Violations</span>
                    <span className="font-bold text-[#8F4336] text-sm">{s.violationsFound}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#426B5A] dark:text-[#8FAF9A] font-semibold pt-1">
                  <span>View Officer Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
