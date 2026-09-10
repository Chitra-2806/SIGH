import React, { useState, useEffect } from 'react';
import { BookOpen, Search, ShieldAlert, Scale, Info, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { apiService } from '../../services/api';
import { RuleClause } from '../../types';

export const RulebookPage: React.FC = () => {
  const [rules, setRules] = useState<RuleClause[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Mandatory Declarations',
    'MRP & Pricing',
    'Net Quantity & Units',
    'Manufacturer & Origin',
    'Font & Dimensions',
    'Consumer Grievance',
  ];

  useEffect(() => {
    loadRules();
  }, [selectedCategory]);

  const loadRules = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getRulebook(selectedCategory);
      setRules(data);
    } catch (e) {
      console.error('Failed to load rules', e);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRules = rules.filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.clauseNumber.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.mandatoryRequirement.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#426B5A] dark:text-[#8FAF9A]" />
          <h2 className="text-xl font-bold text-[#303530] dark:text-[#F5F3EA] tracking-tight">
            Statutory Rulebook
          </h2>
        </div>
        <p className="text-xs text-[#4A534B] dark:text-[#D4D0C5] mt-1">
          Legal Metrology (Packaged Commodities) Rules, 2011 & Legal Metrology Act, 2009 Reference Manual.
        </p>
      </div>

      {/* Category Filter Pills & Search */}
      <div className="space-y-3">
        <Input
          id="search-rules-input"
          placeholder="Search rule clause, requirement, penalty section (e.g., 'USP', 'Rule 6', 'Font height')..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#EEF3EF] text-[#426B5A] border border-[#8FAF9A]/60 font-bold dark:bg-[#23352B] dark:text-[#8FAF9A] dark:border-[#4A6E59]'
                  : 'bg-white dark:bg-[#202622] border border-[#E8E1D2] dark:border-[#3F4A43] text-[#66706A] dark:text-[#D4D0C5] hover:text-[#303530] hover:bg-[#FAF9F5]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Rules List */}
      {isLoading ? (
        <LoadingSpinner message="Consulting Legal Metrology clauses..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRules.map((rule) => (
            <Card key={rule.ruleId} className="flex flex-col justify-between border-[#E8E1D2] dark:border-[#3F4A43] bg-white dark:bg-[#2B332E]">
              <div>
                <CardHeader className="py-3 bg-[#FAF9F5] dark:bg-[#202622] border-b border-[#E8E1D2] dark:border-[#3F4A43] flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#2C493D] dark:text-[#6F9B84] bg-[#D5E2D9] dark:bg-[#343D37] px-2 py-0.5 rounded">
                    {rule.clauseNumber}
                  </span>
                  <Badge variant="neutral" size="sm">
                    {rule.category}
                  </Badge>
                </CardHeader>
                <CardBody className="p-4 space-y-2.5 text-xs">
                  <h3 className="text-sm font-bold text-[#303530] dark:text-[#F5F3EA]">
                    {rule.title}
                  </h3>
                  <p className="text-[#4A534B] dark:text-[#D4D0C5] leading-relaxed">
                    {rule.description}
                  </p>

                  <div className="p-2.5 rounded-lg bg-[#EAF2ED]/60 dark:bg-[#23352B]/60 border border-[#8FAF9A]/60 text-[#2C493D] dark:text-[#C4E2D0]">
                    <span className="font-semibold block text-[11px] uppercase tracking-wider mb-0.5">
                      Statutory Mandate
                    </span>
                    <p className="text-xs">{rule.mandatoryRequirement}</p>
                  </div>
                </CardBody>
              </div>

              {/* Penalty Section Footer */}
              <div className="p-3 bg-[#F6F0E4] dark:bg-[#3B3426] border-t border-[#D8C79B] dark:border-[#8E7C4F] text-[11px] text-[#6B4E23] dark:text-[#E8D5B0] flex items-start gap-2">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#8A6730] dark:text-[#D8C79B]" />
                <div>
                  <strong className="block font-semibold">Infringement & Penal Provision:</strong>
                  <span>{rule.penaltySection}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
