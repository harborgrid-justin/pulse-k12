
import React, { useState, useEffect } from 'react';
import { CarePlan, Student } from '../../../types';
import { generateRandomCarePlan } from '../../../services/mock/utils';
import { Plus, Calendar, Clock, FileText, MoreHorizontal, ChevronRight, Sparkles, Download, X } from 'lucide-react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';

interface StudentCarePlansProps {
  student: Student;
}

export const StudentCarePlans: React.FC<StudentCarePlansProps> = ({ student }) => {
  // Initialize state unconditionally
  const [plans, setPlans] = useState<CarePlan[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<CarePlan | null>(null);

  // Update plans when student changes
  useEffect(() => {
      if (!student) return;

      if (student.carePlans && student.carePlans.length > 0) {
          setPlans(student.carePlans);
      } else {
          // Demo Feature: Auto-generate a plan if none exists
          const mockPlan = generateRandomCarePlan(student);
          setPlans([mockPlan]);
      }
  }, [student]);

  const handleGenerateAIPlan = () => {
      if (!student) return;
      setIsGenerating(true);
      // Simulate AI delay
      setTimeout(() => {
          const newPlan = generateRandomCarePlan(student);
          setPlans(prev => [newPlan, ...prev]);
          setIsGenerating(false);
      }, 1500);
  };

  const getPlanColor = (type: string) => {
      switch(type) {
          case 'IHP': return 'border-blue-500 bg-blue-50 text-blue-700';
          case 'EAP': return 'border-red-500 bg-red-50 text-red-700';
          case 'IEP_504': return 'border-purple-500 bg-purple-50 text-purple-700';
          default: return 'border-slate-500 bg-slate-50 text-slate-700';
      }
  };

  if (!student) {
      return <div className="p-8 text-center text-slate-500 italic border border-dashed border-slate-200 rounded-xl">Student data unavailable.</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div>
                <h2 className="text-xl font-bold text-slate-800">Individualized Healthcare Plans</h2>
                <p className="text-slate-500">Manage IHPs, EAPs, and 504 Medical documentation.</p>
            </div>
            <Button 
                onClick={handleGenerateAIPlan} 
                isLoading={isGenerating}
                icon={Sparkles}
                className="w-full sm:w-auto"
            >
                {isGenerating ? 'Generating Plan...' : 'Generate with AI'}
            </Button>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
            {plans.map(plan => (
                <div 
                    key={plan.id} 
                    onClick={() => setSelectedPlan(plan)}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden active:scale-[0.99] transition-all"
                >
                    <div className={`h-1.5 w-full ${getPlanColor(plan.type).split(' ')[0].replace('border', 'bg')}`}></div>
                    <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold border ${getPlanColor(plan.type).replace('border-','border-opacity-20 border-')}`}>
                                {plan.type.replace('_', ' ')}
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${plan.status === 'ACTIVE' ? 'text-emerald-600' : 'text-slate-400'}`}>
                                {plan.status}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">{plan.title}</h3>
                        <p className="text-sm text-slate-500 line-clamp-2 mb-3">{plan.content}</p>
                        
                        <div className="flex items-center justify-between border-t border-slate-50 pt-3 text-xs text-slate-400">
                            <span className="flex items-center"><Clock size={12} className="mr-1"/> Review: {plan.reviewDate}</span>
                            <span className="flex items-center font-bold text-primary-600">View <ChevronRight size={14} className="ml-1"/></span>
                        </div>
                    </div>
                </div>
            ))}
            {plans.length === 0 && (
                <div className="text-center p-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    No care plans found.
                </div>
            )}
        </div>

        {/* Desktop Grid View */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map(plan => (
                <div key={plan.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                    <div className="p-6 flex-1">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border ${getPlanColor(plan.type).replace('border-','border-opacity-20 border-')}`}>
                                {plan.type.replace('_', ' ')}
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className={`w-2 h-2 rounded-full ${plan.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                                <span className="text-xs font-bold text-slate-500">{plan.status}</span>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">{plan.title}</h3>
                        <p className="text-slate-600 text-sm mb-4 leading-relaxed whitespace-pre-line line-clamp-4">{plan.content}</p>
                    </div>
                    <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-xl flex justify-between items-center">
                        <div className="text-xs text-slate-500 flex items-center">
                            <Calendar size={14} className="mr-1.5 text-slate-400" />
                            Next Review: <span className="font-medium text-slate-700 ml-1">{plan.reviewDate}</span>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setSelectedPlan(plan)} className="text-slate-600 hover:text-primary-600 p-1.5 hover:bg-white rounded-md transition-colors">
                                <FileText size={18} />
                            </button>
                            <button className="text-slate-600 hover:text-primary-600 p-1.5 hover:bg-white rounded-md transition-colors">
                                <Download size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            {plans.length === 0 && (
                <div className="col-span-2 text-center p-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    No care plans on file. Click "Generate with AI" to draft one based on student conditions.
                </div>
            )}
        </div>

        {/* View Plan Modal */}
        <Modal
            isOpen={!!selectedPlan}
            onClose={() => setSelectedPlan(null)}
            title="Healthcare Plan Details"
            maxWidth="max-w-3xl"
            footer={
                <Button onClick={() => setSelectedPlan(null)} variant="secondary">Close</Button>
            }
        >
            {selectedPlan && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <div>
                            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Plan Type</h4>
                            <p className="text-lg font-bold text-slate-800">{selectedPlan.type.replace('_', ' ')}</p>
                        </div>
                        <div className="text-right">
                            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Status</h4>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${selectedPlan.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                                {selectedPlan.status}
                            </span>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">{selectedPlan.title}</h3>
                        <div className="prose prose-sm max-w-none text-slate-700 bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                            {selectedPlan.content.split('\n').map((line, i) => (
                                <p key={i} className="mb-2 last:mb-0">{line}</p>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 border border-slate-100 rounded bg-slate-50">
                            <span className="block text-xs text-slate-400 font-bold uppercase mb-1">Created</span>
                            <span className="font-medium text-slate-800">{selectedPlan.createdAt}</span>
                        </div>
                        <div className="p-3 border border-slate-100 rounded bg-slate-50">
                            <span className="block text-xs text-slate-400 font-bold uppercase mb-1">Review Date</span>
                            <span className="font-medium text-slate-800">{selectedPlan.reviewDate}</span>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    </div>
  );
};
