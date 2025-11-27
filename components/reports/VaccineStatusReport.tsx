
import React, { useState, useMemo } from 'react';
import { Student } from '../../types';
import { ComplianceService } from '../../services/complianceService';
import { ComplianceStats } from './vaccine/ComplianceStats';
import { ComplianceStudentList } from './vaccine/ComplianceStudentList';

interface VaccineStatusReportProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

export const VaccineStatusReport: React.FC<VaccineStatusReportProps> = ({ students, onSelectStudent }) => {
  const [filterGrade, setFilterGrade] = useState<string>('ALL');
  const [showNonCompliantOnly, setShowNonCompliantOnly] = useState(false);

  // Compliance Engine Processing
  const processedData = useMemo(() => {
    return students.map(s => {
        const check = ComplianceService.evaluateCompliance(s);
        return { ...s, ...check };
    });
  }, [students]);

  const filteredData = processedData.filter(s => {
      if (filterGrade !== 'ALL' && s.grade !== filterGrade) return false;
      if (showNonCompliantOnly && s.status === 'COMPLIANT') return false;
      return true;
  });

  const stats = {
      compliant: processedData.filter(s => s.status === 'COMPLIANT').length,
      nonCompliant: processedData.filter(s => s.status === 'NON_COMPLIANT').length,
      provisional: processedData.filter(s => s.status === 'PROVISIONAL').length
  };

  const chartData = [
    { name: 'Compliant', value: stats.compliant, color: '#10b981' },
    { name: 'Non-Compliant', value: stats.nonCompliant, color: '#ef4444' },
    { name: 'Provisional', value: stats.provisional, color: '#f59e0b' },
  ].filter(d => d.value > 0);

  const handleExportAudit = () => {
      const data = ComplianceService.generateAuditExport(students);
      // Mock download
      console.log("Exporting CSV:", data);
      alert(`Generated State Audit File for ${students.length} students. Check console for payload.`);
  };

  return (
    <div className="animate-fade-in space-y-6 pb-10">
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Left Col: Stats & Controls */}
           <div className="lg:col-span-1">
                <ComplianceStats 
                    stats={stats}
                    totalStudents={students.length}
                    chartData={chartData}
                    filterGrade={filterGrade}
                    setFilterGrade={setFilterGrade}
                    showNonCompliantOnly={showNonCompliantOnly}
                    setShowNonCompliantOnly={setShowNonCompliantOnly}
                    onExport={handleExportAudit}
                />
           </div>

           {/* Right Col: List */}
           <div className="lg:col-span-2">
                <ComplianceStudentList 
                    filteredData={filteredData}
                    onSelectStudent={onSelectStudent}
                />
           </div>
       </div>
    </div>
  );
};
