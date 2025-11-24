import React, { useState, useEffect } from 'react';
import { Student, VisitLog, Urgency, ImmunizationRecord, Allergy } from '../../types';
import { AthenaService } from '../../services/athenaService'; // Import the new service
import { 
  ArrowLeft, Calendar, AlertTriangle, Shield, Clock, FileText, 
  Activity, Users, Phone, Mail, Syringe, AlertCircle, CheckCircle, ExternalLink,
  Smartphone, UserCheck, Plus, X, Save, Edit, AlertOctagon, Search, Loader2
} from 'lucide-react';

interface StudentProfileProps {
  student: Student;
  history: VisitLog[];
  onBack: () => void;
}

type Tab = 'overview' | 'immunizations' | 'family';

export const StudentProfile: React.FC<StudentProfileProps> = ({ student: initialStudent, history, onBack }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  // Local student state to handle updates like adding new immunizations without page refresh
  const [student, setStudent] = useState<Student>(initialStudent);
  
  // Modal State
  const [isAddVaxOpen, setIsAddVaxOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  
  // Allergy Modal State
  const [selectedAllergy, setSelectedAllergy] = useState<Allergy | null>(null);
  
  // Immunization Form State
  const [newVax, setNewVax] = useState<Partial<ImmunizationRecord> & { cvxCode?: string }>({
    name: '',
    date: new Date().toISOString().split('T')[0],
    doseNumber: 1,
    totalDoses: 2,
    status: 'COMPLIANT',
    manufacturer: '',
    lotNumber: '',
    site: '',
    cvxCode: ''
  });

  // Immunization Search State
  const [vaxSearchTerm, setVaxSearchTerm] = useState('');
  const [vaxSearchResults, setVaxSearchResults] = useState<any[]>([]);
  const [isSearchingVax, setIsSearchingVax] = useState(false);
  const [showVaxDropdown, setShowVaxDropdown] = useState(false);
  const [isSavingVax, setIsSavingVax] = useState(false);

  const [editFormData, setEditFormData] = useState<Partial<Student>>({});

  useEffect(() => {
    setStudent(initialStudent);
    setEditFormData({
        firstName: initialStudent.firstName,
        lastName: initialStudent.lastName,
        grade: initialStudent.grade,
        parentContact: initialStudent.parentContact,
        parentPhone: initialStudent.parentPhone,
        physician: initialStudent.physician,
    });
  }, [initialStudent]);

  // Debounced Search Effect for Athena API
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
        if (vaxSearchTerm.length > 1 && showVaxDropdown) {
            setIsSearchingVax(true);
            try {
                const results = await AthenaService.searchVaccines(vaxSearchTerm);
                setVaxSearchResults(results);
            } catch (err) {
                console.error(err);
            } finally {
                setIsSearchingVax(false);
            }
        } else if (vaxSearchTerm.length === 0) {
            setVaxSearchResults([]);
        }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [vaxSearchTerm, showVaxDropdown]);

  const recentVisits = [...history].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getUrgencyColor = (u: Urgency) => {
    switch(u) {
      case Urgency.CRITICAL:
      case Urgency.HIGH: return 'bg-red-100 text-red-700';
      case Urgency.MEDIUM: return 'bg-amber-100 text-amber-700';
      default: return 'bg-emerald-100 text-emerald-700';
    }
  };

  const getVaxStatusColor = (status: string) => {
    switch(status) {
      case 'OVERDUE': return 'bg-red-100 text-red-700 border-red-200';
      case 'DUE_SOON': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'EXEMPT': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'COMPLIANT': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const handleVaxSelect = (vax: any) => {
      setNewVax(prev => ({ ...prev, name: vax.display, cvxCode: vax.code }));
      setVaxSearchTerm(vax.display);
      setShowVaxDropdown(false);
  };

  const handleAddVaxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVax.name) return;
    setIsSavingVax(true);

    try {
        // 1. Save to External API (Athena FHIR)
        await AthenaService.createImmunization(student.id, newVax);

        // 2. Update Local State
        const record: ImmunizationRecord = {
          id: `new_${Date.now()}`,
          name: newVax.name!,
          date: newVax.date!,
          doseNumber: newVax.doseNumber || 1,
          totalDoses: newVax.totalDoses || 1,
          compliant: newVax.status === 'COMPLIANT',
          status: newVax.status as any,
          manufacturer: newVax.manufacturer,
          lotNumber: newVax.lotNumber,
          site: newVax.site
        };

        setStudent(prev => ({
          ...prev,
          immunizations: [...(prev.immunizations || []), record]
        }));

        setIsAddVaxOpen(false);
        // Reset form
        setNewVax({
            name: '',
            date: new Date().toISOString().split('T')[0],
            doseNumber: 1,
            totalDoses: 2,
            status: 'COMPLIANT',
            manufacturer: '',
            lotNumber: '',
            site: '',
            cvxCode: ''
        });
        setVaxSearchTerm('');
    } catch (error) {
        alert("Failed to save immunization record.");
    } finally {
        setIsSavingVax(false);
    }
  };

  const handleEditProfileSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setStudent(prev => ({
          ...prev,
          ...editFormData,
          // Deep merge for nested objects if necessary, here simple replacement is fine for top level
          physician: editFormData.physician ? { ...prev.physician, ...editFormData.physician } : prev.physician
      }));
      setIsEditProfileOpen(false);
  };

  return (
    <div className="animate-fade-in space-y-6 h-full flex flex-col relative">
      {/* Header Area */}
      <div>
        <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors mb-4">
          <ArrowLeft size={20} className="mr-2" />
          Back to Directory
        </button>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
             <img 
              src={student.photoUrl} 
              alt={`${student.firstName}`} 
              className="w-24 h-24 rounded-full object-cover border-4 border-slate-50"
            />
            {student.allergies.length > 0 && (
              <div className="absolute -bottom-1 -right-1 bg-red-500 text-white p-1.5 rounded-full border-2 border-white shadow-sm" title="Severe Allergies">
                <AlertTriangle size={14} />
              </div>
            )}
          </div>
          <div className="flex-1">
             <h1 className="text-3xl font-bold text-slate-800">{student.firstName} {student.lastName}</h1>
             <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-600 font-medium">
                <span className="flex items-center"><UserCheck size={16} className="mr-1.5 text-slate-400" /> Grade {student.grade}</span>
                <span className="flex items-center"><Calendar size={16} className="mr-1.5 text-slate-400" /> {new Date().getFullYear() - new Date(student.dob).getFullYear()} Years Old</span>
                <span className="flex items-center"><Activity size={16} className="mr-1.5 text-slate-400" /> {student.gender}</span>
             </div>
          </div>
          <div className="flex gap-2">
            <button 
                onClick={() => setIsEditProfileOpen(true)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm flex items-center"
            >
              <Edit size={16} className="mr-2" />
              Edit Profile
            </button>
            <button className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm">
              Contact Parent
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex space-x-6">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center ${activeTab === 'overview' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <FileText size={16} className="mr-2" />
          Clinical Overview
        </button>
        <button 
          onClick={() => setActiveTab('immunizations')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center ${activeTab === 'immunizations' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <Syringe size={16} className="mr-2" />
          Immunization Tracker
        </button>
        <button 
          onClick={() => setActiveTab('family')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center ${activeTab === 'family' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <Users size={16} className="mr-2" />
          Family & Portal
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1">
        
        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
             <div className="md:col-span-1 space-y-6">
                {/* Vitals Card */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Vitals & Biometrics</h3>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                        <span className="text-slate-500 text-sm">Blood Type</span>
                        <span className="font-semibold text-slate-700">{student.bloodType || 'Unknown'}</span>
                     </div>
                     <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                        <span className="text-slate-500 text-sm">Height</span>
                        <span className="font-semibold text-slate-700">{student.height || '--'}</span>
                     </div>
                     <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                        <span className="text-slate-500 text-sm">Weight</span>
                        <span className="font-semibold text-slate-700">{student.weight || '--'}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-sm">Last Screened</span>
                        <span className="font-semibold text-slate-700">{student.lastScreening || 'Never'}</span>
                     </div>
                  </div>
                </div>

                {/* Alerts Card */}
                {(student.allergies.length > 0 || student.conditions.length > 0) ? (
                   <div className="bg-red-50 border border-red-100 rounded-xl p-5 shadow-sm">
                      <h3 className="text-red-800 font-bold mb-4 flex items-center">
                        <AlertTriangle size={18} className="mr-2" />
                        Medical Alerts
                      </h3>
                      <div className="space-y-3">
                        {student.allergies.length > 0 && (
                          <div>
                             <p className="text-xs font-semibold text-red-600 uppercase mb-1">Allergies</p>
                             <div className="flex flex-wrap gap-2">
                                {student.allergies.map(a => (
                                  <button 
                                    key={a.name} 
                                    onClick={() => setSelectedAllergy(a)}
                                    className="bg-white text-red-700 border border-red-200 px-2 py-1 rounded-md text-sm font-medium shadow-sm hover:bg-red-50 hover:border-red-300 transition-colors flex items-center"
                                  >
                                    {a.name}
                                    <AlertOctagon size={12} className="ml-1.5 opacity-50" />
                                  </button>
                                ))}
                             </div>
                          </div>
                        )}
                        {student.conditions.length > 0 && (
                          <div>
                             <p className="text-xs font-semibold text-red-600 uppercase mb-1">Conditions</p>
                             <div className="flex flex-wrap gap-2">
                                {student.conditions.map(c => (
                                  <span key={c} className="bg-white text-red-700 border border-red-200 px-2 py-1 rounded-md text-sm font-medium shadow-sm cursor-default">
                                    {c}
                                  </span>
                                ))}
                             </div>
                          </div>
                        )}
                      </div>
                   </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 shadow-sm flex items-center justify-center text-emerald-700">
                     <Shield size={20} className="mr-2" />
                     <span className="font-medium">No Medical Alerts</span>
                  </div>
                )}
             </div>

             <div className="md:col-span-2 space-y-6">
               {/* Visit History */}
               <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                 <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 flex items-center">
                      <FileText size={18} className="mr-2 text-primary-600" />
                      Clinic Visit History
                    </h3>
                    <span className="text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                      {recentVisits.length} Records
                    </span>
                 </div>
                 <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                   {recentVisits.map(visit => (
                     <div key={visit.id} className="p-5 hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center text-sm text-slate-500">
                             <Calendar size={14} className="mr-1" />
                             {new Date(visit.timestamp).toLocaleDateString()} 
                             <Clock size={14} className="ml-3 mr-1" />
                             {new Date(visit.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                          <span className={`px-2 py-0.5 text-xs font-bold rounded uppercase ${getUrgencyColor(visit.urgency)}`}>
                            {visit.urgency}
                          </span>
                        </div>
                        <p className="font-semibold text-slate-800 mb-1">{visit.symptoms}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                           <div>
                             <p className="text-xs text-slate-400 uppercase font-bold">Treatment</p>
                             <p className="text-sm text-slate-700">{visit.treatment}</p>
                           </div>
                           <div>
                             <p className="text-xs text-slate-400 uppercase font-bold">Outcome</p>
                             <p className="text-sm text-slate-700">{visit.outcome}</p>
                           </div>
                        </div>
                        {visit.notes && (
                          <div className="mt-3 bg-slate-50 p-3 rounded-lg text-sm text-slate-600 italic border border-slate-100">
                            "{visit.notes}"
                          </div>
                        )}
                     </div>
                   ))}
                   {recentVisits.length === 0 && (
                     <div className="p-12 text-center">
                       <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                         <FileText size={24} className="text-slate-300" />
                       </div>
                       <p className="text-slate-500 font-medium">No visit history</p>
                       <p className="text-slate-400 text-sm">Visits logged for this student will appear here.</p>
                     </div>
                   )}
                 </div>
               </div>
             </div>
          </div>
        )}

        {/* TAB: IMMUNIZATIONS */}
        {activeTab === 'immunizations' && (
          <div className="animate-fade-in space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center">
                      <Shield size={20} className="mr-2 text-primary-600" />
                      Immunization Record
                    </h3>
                    <p className="text-slate-500 text-sm">State Compliance Status: <span className="text-emerald-600 font-bold">Compliant</span></p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                        onClick={() => setIsAddVaxOpen(true)}
                        className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 shadow-sm transition-colors"
                    >
                        <Plus size={16} className="mr-2" />
                        Add Record
                    </button>
                    <button className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm">
                        <ExternalLink size={16} className="mr-2" />
                        Sync State Registry
                    </button>
                  </div>
               </div>
               
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                   <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-xs tracking-wider">
                     <tr>
                       <th className="px-6 py-4">Vaccine</th>
                       <th className="px-6 py-4">Administered Date</th>
                       <th className="px-6 py-4">Dose Info</th>
                       <th className="px-6 py-4">Details</th>
                       <th className="px-6 py-4">Next Due</th>
                       <th className="px-6 py-4 text-right">Status</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {student.immunizations?.map((vax) => (
                       <tr key={vax.id} className="hover:bg-slate-50">
                         <td className="px-6 py-4 font-medium text-slate-800">{vax.name}</td>
                         <td className="px-6 py-4 text-slate-600">{vax.date}</td>
                         <td className="px-6 py-4 text-slate-600">Dose {vax.doseNumber} of {vax.totalDoses}</td>
                         <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                                {vax.manufacturer && <span className="text-xs text-slate-500">Mfg: {vax.manufacturer}</span>}
                                {vax.lotNumber && <span className="text-xs text-slate-500">Lot: {vax.lotNumber}</span>}
                                {vax.site && <span className="text-xs text-slate-500">Site: {vax.site}</span>}
                                {!vax.manufacturer && !vax.lotNumber && !vax.site && <span className="text-xs text-slate-400 italic">No details</span>}
                            </div>
                         </td>
                         <td className="px-6 py-4 text-slate-600">{vax.nextDueDate || '-'}</td>
                         <td className="px-6 py-4 text-right">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getVaxStatusColor(vax.status)}`}>
                              {vax.status === 'COMPLIANT' && <CheckCircle size={12} className="mr-1" />}
                              {vax.status === 'OVERDUE' && <AlertCircle size={12} className="mr-1" />}
                              {vax.status.replace('_', ' ')}
                            </span>
                         </td>
                       </tr>
                     ))}
                     {(!student.immunizations || student.immunizations.length === 0) && (
                       <tr>
                         <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                           No immunization records found.
                         </td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}

        {/* TAB: FAMILY & PORTAL */}
        {activeTab === 'family' && (
          <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Parent Portal Management */}
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center space-x-3 mb-6">
                   <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                      <Smartphone size={24} />
                   </div>
                   <div>
                      <h3 className="font-bold text-slate-800">Parent Portal</h3>
                      <p className="text-sm text-slate-500">Manage access to health records</p>
                   </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 mb-6">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-600">Access Status</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${student.parentPortalAccess ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                        {student.parentPortalAccess ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                   </div>
                   {student.parentPortalAccess && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-600">Last Login</span>
                        <span className="text-sm text-slate-800">{student.lastPortalLogin ? new Date(student.lastPortalLogin).toLocaleDateString() : 'Never'}</span>
                      </div>
                   )}
                </div>

                <div className="space-y-3">
                   <button className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                      {student.parentPortalAccess ? 'Reset Password' : 'Invite Parent to Portal'}
                   </button>
                   <button className="w-full py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                      View Access Logs
                   </button>
                </div>
             </div>

             {/* Emergency Contacts */}
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                  <Phone size={18} className="mr-2 text-slate-400" />
                  Emergency Contacts
                </h3>
                <div className="space-y-4">
                   {student.emergencyContacts.map((contact, idx) => (
                      <div key={idx} className={`p-4 rounded-lg border ${contact.isPrimary ? 'bg-blue-50 border-blue-100' : 'bg-white border-slate-100'}`}>
                         <div className="flex justify-between items-start">
                            <div>
                               <p className="font-bold text-slate-800">{contact.name}</p>
                               <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-2">{contact.relation} {contact.isPrimary && '• PRIMARY'}</p>
                            </div>
                            <a href={`tel:${contact.phone}`} className="p-2 bg-white rounded-full text-primary-600 hover:bg-primary-50 border border-slate-200 shadow-sm transition-colors">
                               <Phone size={16} />
                            </a>
                         </div>
                         <div className="space-y-1 text-sm text-slate-600">
                            <p className="flex items-center"><Phone size={12} className="mr-2 text-slate-400" /> {contact.phone}</p>
                            {contact.email && <p className="flex items-center"><Mail size={12} className="mr-2 text-slate-400" /> {contact.email}</p>}
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             {/* Provider Info */}
             <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                  <Activity size={18} className="mr-2 text-slate-400" />
                  Provider & Insurance Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-xs text-slate-400 font-bold uppercase mb-2">Primary Physician</p>
                      <p className="font-semibold text-slate-800">{student.physician?.name || 'Not Listed'}</p>
                      <p className="text-sm text-slate-600">{student.physician?.clinic}</p>
                      <p className="text-sm text-primary-600 mt-1">{student.physician?.phone}</p>
                   </div>
                   
                   <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-xs text-slate-400 font-bold uppercase mb-2">Insurance Provider</p>
                      <p className="font-semibold text-slate-800">{student.insurance?.provider || 'Not Listed'}</p>
                      <p className="text-sm text-slate-600">Group: {student.insurance?.groupNumber || 'N/A'}</p>
                   </div>

                   <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-xs text-slate-400 font-bold uppercase mb-2">Policy Details</p>
                      <p className="font-mono text-slate-700 bg-white px-2 py-1 rounded border border-slate-200 inline-block text-sm">
                        {student.insurance?.policyNumber || 'N/A'}
                      </p>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>

       {/* Add Immunization Modal */}
       {isAddVaxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h3 className="text-xl font-bold text-slate-800">Add Immunization Record</h3>
                    <button onClick={() => setIsAddVaxOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6">
                    <form id="vax-form" onSubmit={handleAddVaxSubmit} className="space-y-4">
                        <div className="relative">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Vaccine Name (Search)</label>
                            <div className="relative">
                                <input 
                                    required
                                    type="text"
                                    className="w-full border-slate-200 rounded-lg pl-3 pr-10 py-2 focus:ring-2 focus:ring-primary-500"
                                    placeholder="Type to search (e.g. MMR)"
                                    value={vaxSearchTerm}
                                    onChange={(e) => {
                                        setVaxSearchTerm(e.target.value);
                                        setShowVaxDropdown(true);
                                    }}
                                    onFocus={() => setShowVaxDropdown(true)}
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    {isSearchingVax ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                                </div>
                            </div>
                            
                            {/* Autocomplete Dropdown */}
                            {showVaxDropdown && vaxSearchResults.length > 0 && (
                                <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                    {vaxSearchResults.map(vax => (
                                        <button
                                            type="button"
                                            key={vax.code}
                                            className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-slate-700 border-b border-slate-50 last:border-0"
                                            onClick={() => handleVaxSelect(vax)}
                                        >
                                            <span className="font-bold">{vax.display}</span>
                                            <span className="ml-2 text-xs text-slate-400 font-mono">CVX: {vax.code}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Date Administered</label>
                                <input 
                                    required
                                    type="date"
                                    className="w-full border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                                    value={newVax.date}
                                    onChange={(e) => setNewVax({...newVax, date: e.target.value})}
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                <select
                                    className="w-full border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                                    value={newVax.status}
                                    onChange={(e) => setNewVax({...newVax, status: e.target.value as any})}
                                >
                                    <option value="COMPLIANT">Compliant</option>
                                    <option value="DUE_SOON">Due Soon</option>
                                    <option value="OVERDUE">Overdue</option>
                                    <option value="EXEMPT">Exempt</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Dose #</label>
                                <input 
                                    type="number"
                                    min="1"
                                    className="w-full border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                                    value={newVax.doseNumber}
                                    onChange={(e) => setNewVax({...newVax, doseNumber: parseInt(e.target.value)})}
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Total Series Doses</label>
                                <input 
                                    type="number"
                                    min="1"
                                    className="w-full border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                                    value={newVax.totalDoses}
                                    onChange={(e) => setNewVax({...newVax, totalDoses: parseInt(e.target.value)})}
                                />
                            </div>
                        </div>
                        <div className="border-t border-slate-100 pt-4">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Detailed Information</p>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Manufacturer</label>
                                    <input 
                                        type="text"
                                        className="w-full border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                                        placeholder="e.g. Merck, Pfizer"
                                        value={newVax.manufacturer}
                                        onChange={(e) => setNewVax({...newVax, manufacturer: e.target.value})}
                                    />
                                </div>
                                 <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Lot Number</label>
                                        <input 
                                            type="text"
                                            className="w-full border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                                            value={newVax.lotNumber}
                                            onChange={(e) => setNewVax({...newVax, lotNumber: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Site</label>
                                        <input 
                                            type="text"
                                            className="w-full border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                                            placeholder="e.g. Left Deltoid"
                                            value={newVax.site}
                                            onChange={(e) => setNewVax({...newVax, site: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="p-6 border-t border-slate-100 flex justify-end space-x-3 bg-slate-50 rounded-b-2xl">
                    <button 
                        onClick={() => setIsAddVaxOpen(false)}
                        className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        form="vax-form"
                        disabled={isSavingVax}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 shadow-sm flex items-center transition-colors disabled:opacity-70"
                    >
                        {isSavingVax ? <Loader2 size={18} className="mr-2 animate-spin" /> : <Save size={18} className="mr-2" />}
                        {isSavingVax ? 'Saving to FHIR...' : 'Save Record'}
                    </button>
                </div>
            </div>
        </div>
       )}

       {/* Edit Profile Modal */}
       {isEditProfileOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
               <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                   <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                       <h3 className="text-xl font-bold text-slate-800">Edit Student Profile</h3>
                       <button onClick={() => setIsEditProfileOpen(false)} className="text-slate-400 hover:text-slate-600">
                           <X size={24} />
                       </button>
                   </div>
                   <div className="p-6">
                       <form id="edit-profile-form" onSubmit={handleEditProfileSubmit} className="space-y-4">
                           <div className="grid grid-cols-2 gap-4">
                               <div>
                                   <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                                   <input 
                                       type="text"
                                       className="w-full border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                                       value={editFormData.firstName || ''}
                                       onChange={(e) => setEditFormData({...editFormData, firstName: e.target.value})}
                                   />
                               </div>
                               <div>
                                   <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                                   <input 
                                       type="text"
                                       className="w-full border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                                       value={editFormData.lastName || ''}
                                       onChange={(e) => setEditFormData({...editFormData, lastName: e.target.value})}
                                   />
                               </div>
                           </div>
                           <div>
                               <label className="block text-sm font-medium text-slate-700 mb-1">Grade Level</label>
                               <input 
                                   type="text"
                                   className="w-full border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                                   value={editFormData.grade || ''}
                                   onChange={(e) => setEditFormData({...editFormData, grade: e.target.value})}
                               />
                           </div>
                           <div className="border-t border-slate-100 pt-4">
                               <h4 className="font-semibold text-slate-800 mb-3">Primary Contact</h4>
                               <div className="grid grid-cols-1 gap-4">
                                   <div>
                                       <label className="block text-sm font-medium text-slate-700 mb-1">Parent/Guardian Name</label>
                                       <input 
                                           type="text"
                                           className="w-full border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                                           value={editFormData.parentContact || ''}
                                           onChange={(e) => setEditFormData({...editFormData, parentContact: e.target.value})}
                                       />
                                   </div>
                                    <div>
                                       <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                                       <input 
                                           type="text"
                                           className="w-full border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                                           value={editFormData.parentPhone || ''}
                                           onChange={(e) => setEditFormData({...editFormData, parentPhone: e.target.value})}
                                       />
                                   </div>
                               </div>
                           </div>
                       </form>
                   </div>
                   <div className="p-6 border-t border-slate-100 flex justify-end space-x-3 bg-slate-50 rounded-b-2xl">
                       <button 
                           onClick={() => setIsEditProfileOpen(false)}
                           className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors"
                       >
                           Cancel
                       </button>
                       <button 
                           type="submit"
                           form="edit-profile-form"
                           className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 shadow-sm transition-colors"
                       >
                           Save Changes
                       </button>
                   </div>
               </div>
           </div>
       )}

       {/* Allergy Detail Modal */}
       {selectedAllergy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
             <button 
                onClick={() => setSelectedAllergy(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
             >
                <X size={20} />
             </button>
             
             <div className="flex items-center space-x-3 mb-4">
                <div className="bg-red-100 p-3 rounded-full text-red-600">
                   <AlertOctagon size={28} />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-slate-800">{selectedAllergy.name}</h3>
                   <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-xs font-bold border border-red-100 uppercase">
                      {selectedAllergy.severity} SEVERITY
                   </span>
                </div>
             </div>
             
             <div className="space-y-4">
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase mb-1">Reaction Symptoms</p>
                   <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">{selectedAllergy.reaction}</p>
                </div>
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase mb-1">Action Plan</p>
                   <p className="text-slate-800 font-medium bg-red-50 p-3 rounded-lg border border-red-100 flex items-start">
                      <AlertTriangle size={16} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      {selectedAllergy.actionPlan}
                   </p>
                </div>
             </div>
             
             <button 
                onClick={() => setSelectedAllergy(null)}
                className="w-full mt-6 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
             >
                Close Details
             </button>
          </div>
        </div>
       )}
    </div>
  );
};