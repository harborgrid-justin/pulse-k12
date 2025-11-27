
import React, { useState, useMemo } from 'react';
import { Student } from '../../types';
import { Eye, Ear, Activity, CheckCircle, AlertTriangle, Filter, Download, Users } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface ScreeningReportProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

export const ScreeningReport: React.FC<ScreeningReportProps> = ({ students, onSelectStudent }) => {
  const [filterGrade, setFilterGrade] = useState<string>('ALL');

  const processedData = useMemo(() => {
    return students.filter(s => filterGrade === 'ALL' || s.grade === filterGrade).map(student => {
        const vision = student.screenings.find(s => s.type === 'VISION');
        const hearing = student.screenings.find(s => s.type === 'HEARING');
        const bmi = student.screenings.find(s => s.type === 'BMI');

        return {
            ...student,
            visionStatus: vision ? vision.result : 'PENDING',
            hearingStatus: hearing ? hearing.result : 'PENDING',
            bmiStatus: bmi ? 'COMPLETED' : 'PENDING'
        };
    });
  }, [students, filterGrade]);

  const stats = useMemo(() => {
      const total = processedData.length;
      const visionPass = processedData.filter(s => s.visionStatus === 'PASS').length;
      const visionFail = processedData.filter(s => s.visionStatus === 'FAIL' || s.visionStatus === 'REFERRAL').length;
      const visionPending = total - visionPass - visionFail;

      const hearingPass = processedData.filter(s => s.hearingStatus === 'PASS').length;
      const hearingFail = processedData.filter(s => s.hearingStatus === 'FAIL' || s.hearingStatus === 'REFERRAL').length;
      const hearingPending = total - hearingPass - hearingFail;

      return {
          vision: [
              { name: 'Pass', value: visionPass, color: '#10b981' },
              { name: 'Referral', value: visionFail, color: '#ef4444' },
              { name: 'Pending', value: visionPending, color: '#e2e8f0' }
          ],
          hearing: [
              { name: 'Pass', value: hearingPass, color: '#3b82f6' },
              { name: 'Referral', value: hearingFail, color: '#f59e0b' },
              { name: 'Pending', value: hearingPending, color: '#e2e8f0' }
          ]
      };
  }, [processedData]);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                    <Activity className="mr-3 text-primary-600" size={28} />
                    Health Screening Dashboard
                </h2>
                <p className="text-slate-500">Vision, Hearing, and BMI compliance tracking.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <select 
                        className="w-full md:w-48 pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
                        value={filterGrade}
                        onChange={(e) => setFilterGrade(e.target.value)}
                    >
                        <option value="ALL">All Grades</option>
                        <option value="K">Kindergarten</option>
                        <option value="1">1st Grade</option>
                        <option value="3">3rd Grade</option>
                        <option value="5">5th Grade</option>
                    </select>
                </div>
                <button className="bg-slate-800 text-white px-4 py-2 rounded-lg font-medium flex items-center hover:bg-slate-700 transition-colors shadow-sm">
                    <Download size={18} className="mr-2" /> Export
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vision Chart */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800 flex items-center">
                        <Eye size={20} className="mr-2 text-emerald-600" /> Vision Screening
                    </h3>
                    <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2 py-1 rounded">
                        {Math.round((stats.vision[0].value / processedData.length) * 100) || 0}% Complete
                    </span>
                </div>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={stats.vision} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                                {stats.vision.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" iconSize={10} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Hearing Chart */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800 flex items-center">
                        <Ear size={20} className="mr-2 text-blue-600" /> Hearing Screening
                    </h3>
                    <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {Math.round((stats.hearing[0].value / processedData.length) * 100) || 0}% Complete
                    </span>
                </div>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={stats.hearing} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                                {stats.hearing.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" iconSize={10} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Student List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Student Roster</h3>
                <span className="text-xs font-medium text-slate-500">{processedData.length} Students Shown</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-3 font-semibold text-slate-600">Student</th>
                            <th className="px-6 py-3 font-semibold text-slate-600">Grade</th>
                            <th className="px-6 py-3 font-semibold text-slate-600">Vision</th>
                            <th className="px-6 py-3 font-semibold text-slate-600">Hearing</th>
                            <th className="px-6 py-3 font-semibold text-slate-600">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {processedData.map(student => (
                            <tr key={student.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => onSelectStudent(student)}>
                                <td className="px-6 py-3 font-medium text-slate-800 flex items-center gap-3">
                                    <img src={student.photoUrl} className="w-8 h-8 rounded-full border border-slate-100" alt="" />
                                    {student.firstName} {student.lastName}
                                </td>
                                <td className="px-6 py-3 text-slate-600">{student.grade}</td>
                                <td className="px-6 py-3">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                        student.visionStatus === 'PASS' ? 'bg-emerald-50 text-emerald-700' :
                                        student.visionStatus === 'PENDING' ? 'bg-slate-100 text-slate-500' :
                                        'bg-red-50 text-red-700'
                                    }`}>
                                        {student.visionStatus}
                                    </span>
                                </td>
                                <td className="px-6 py-3">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                        student.hearingStatus === 'PASS' ? 'bg-blue-50 text-blue-700' :
                                        student.hearingStatus === 'PENDING' ? 'bg-slate-100 text-slate-500' :
                                        'bg-amber-50 text-amber-700'
                                    }`}>
                                        {student.hearingStatus}
                                    </span>
                                </td>
                                <td className="px-6 py-3">
                                    <button className="text-primary-600 hover:text-primary-700 font-bold text-xs">
                                        Log Result
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};
