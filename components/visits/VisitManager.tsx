import React, { useState } from 'react';
import { VisitLog, Student, Urgency } from '../../types';
import { GeminiService } from '../../services/geminiService';
import { Plus, Sparkles, Save, Clock, X, Search, ChevronRight } from 'lucide-react';

interface VisitManagerProps {
  visits: VisitLog[];
  students: Student[];
  onAddVisit: (visit: VisitLog) => void;
  onViewVisitDetail: (visit: VisitLog) => void; // Added Prop
  preSelectedStudent?: Student | null;
}

export const VisitManager: React.FC<VisitManagerProps> = ({ visits, students, onAddVisit, onViewVisitDetail, preSelectedStudent }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form State
  const [selectedStudentId, setSelectedStudentId] = useState(preSelectedStudent?.id || '');
  const [rawInput, setRawInput] = useState('');
  const [formData, setFormData] = useState({
    symptoms: '',
    treatment: '',
    outcome: '',
    urgency: Urgency.LOW as Urgency,
    notes: ''
  });

  const handleMagicFill = async () => {
    if (!rawInput.trim()) return;
    setIsProcessing(true);
    const analysis = await GeminiService.processClinicalNote(rawInput);
    setFormData({
      symptoms: analysis.symptoms,
      treatment: analysis.treatment,
      outcome: analysis.outcome,
      urgency: analysis.urgency,
      notes: analysis.formattedNote
    });
    setIsProcessing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;

    const newVisit: VisitLog = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: selectedStudentId,
      timestamp: new Date().toISOString(),
      ...formData,
      processedByAI: !!rawInput
    };

    onAddVisit(newVisit);
    setIsFormOpen(false);
    // Reset form
    setRawInput('');
    setFormData({ symptoms: '', treatment: '', outcome: '', urgency: Urgency.LOW, notes: '' });
    setSelectedStudentId('');
  };

  return (
    <div className="space-y-6 animate-fade-in relative h-full">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Clinical Visits</h2>
           <p className="text-slate-500">Log and track student health encounters.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Log Visit
        </button>
      </div>

      {/* Visit History List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-600">Time</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Student & Contact</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Symptom</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Treatment</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Urgency</th>
                <th className="px-6 py-4 font-semibold text-slate-600"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visits.map((visit) => {
                const student = students.find(s => s.id === visit.studentId);
                return (
                  <tr 
                    key={visit.id} 
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => onViewVisitDetail(visit)}
                  >
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      {new Date(visit.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">
                        {student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'}
                        {student && (
                          <span className="ml-2 text-xs text-slate-500 font-normal">
                            (Parent: {student.parentContact})
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        ID: {visit.studentId}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{visit.symptoms}</td>
                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{visit.treatment}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        visit.urgency === Urgency.HIGH || visit.urgency === Urgency.CRITICAL 
                          ? 'bg-red-100 text-red-800'
                          : visit.urgency === Urgency.MEDIUM
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {visit.urgency}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <ChevronRight className="text-slate-300" size={16} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {visits.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            No visits recorded yet.
          </div>
        )}
      </div>

      {/* New Visit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-slate-800">New Clinical Visit</h3>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* AI Quick Fill Section */}
              <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                <div className="flex items-center space-x-2 text-indigo-700 mb-2">
                  <Sparkles size={18} />
                  <span className="font-semibold text-sm">AI Magic Fill</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g., Liam scraped his knee at recess, cleaned with saline, gave bandaid."
                    className="flex-1 border-indigo-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleMagicFill()}
                  />
                  <button 
                    onClick={handleMagicFill}
                    disabled={isProcessing || !rawInput}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    {isProcessing ? 'Thinking...' : 'Fill Form'}
                  </button>
                </div>
                <p className="text-xs text-indigo-400 mt-2">
                  Describe what happened in plain English and let AI fill the details below.
                </p>
              </div>

              <form id="visit-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Student</label>
                  <select 
                    required
                    className="w-full border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                  >
                    <option value="">Select Student...</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.firstName} {s.lastName} (Gr {s.grade})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Symptoms</label>
                    <input 
                      required
                      className="w-full border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                      value={formData.symptoms}
                      onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Urgency</label>
                    <select 
                      className="w-full border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                      value={formData.urgency}
                      onChange={(e) => setFormData({...formData, urgency: e.target.value as Urgency})}
                    >
                      {Object.values(Urgency).map(u => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Treatment</label>
                    <input 
                      required
                      className="w-full border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                      value={formData.treatment}
                      onChange={(e) => setFormData({...formData, treatment: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Outcome</label>
                    <input 
                      required
                      className="w-full border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                      value={formData.outcome}
                      onChange={(e) => setFormData({...formData, outcome: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Clinical Notes (SOAP)</label>
                  <textarea 
                    rows={4}
                    className="w-full border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end space-x-3 bg-slate-50 rounded-b-2xl">
              <button 
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="visit-form"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 shadow-sm flex items-center transition-colors"
              >
                <Save size={18} className="mr-2" />
                Save Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};