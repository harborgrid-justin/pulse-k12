
import React, { useState, useRef, useEffect } from 'react';
import { Student, Teacher } from '../../../types';
import { ArrowLeft, AlertTriangle, Save, Edit, MoreVertical } from 'lucide-react';
import { StudentInfoCard } from './header/StudentInfoCard';
import { StudentEditForm } from './header/StudentEditForm';

interface StudentHeaderProps {
  student: Student;
  assignedTeacher?: Teacher;
  onBack: () => void;
  onUpdate: (updatedData: Partial<Student>) => void;
  onContactParent: () => void;
  onTeacherClick?: (teacher: Teacher) => void;
}

export const StudentHeader: React.FC<StudentHeaderProps> = ({ student, assignedTeacher, onBack, onUpdate, onContactParent, onTeacherClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // We need a ref to trigger form submission from the header button
  // However, for simplicity in this refactor, the Desktop "Save" button 
  // acts as a toggle here, but the actual form state is inside Child.
  // To make this cleaner without Context, we will let the Child handle the save
  // and just toggle the view mode here. 
  // NOTE: The `StudentEditForm` has its own buttons for mobile. 
  // For Desktop, we'll pass a ref or lift state.
  // Given the constraints, lifting state to `StudentHeader` was how it was before.
  // But we moved state to child. Let's revert to conditional rendering 
  // where the form handles its own save/cancel and notifies parent to close.

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setShowMobileMenu(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSaveSuccess = (data: Partial<Student>) => {
      onUpdate(data);
      setIsEditing(false);
  };

  return (
    <div>
        <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors mb-4">
          <ArrowLeft size={20} className="mr-2" />
          Back to Directory
        </button>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6 relative">
          <div className="relative shrink-0">
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
          
          <div className="flex-1 w-full">
             {isEditing ? (
                 <StudentEditForm 
                    student={student} 
                    onSave={handleSaveSuccess} 
                    onCancel={() => setIsEditing(false)} 
                 />
             ) : (
                 <StudentInfoCard 
                    student={student} 
                    assignedTeacher={assignedTeacher} 
                    onTeacherClick={onTeacherClick} 
                 />
             )}
          </div>
          
          {/* Desktop Action Buttons */}
          <div className="hidden md:flex gap-2 items-start">
            {!isEditing && (
                <>
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm flex items-center"
                    >
                        <Edit size={16} className="mr-2" />
                        Edit Profile
                    </button>
                    <button 
                        onClick={onContactParent}
                        className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
                    >
                        Contact Parent
                    </button>
                </>
            )}
            {/* If Editing, buttons are inside the form component for better state access */}
          </div>

          {/* Mobile Action Menu */}
          <div className="md:hidden absolute top-4 right-4" ref={menuRef}>
             <button 
               onClick={() => setShowMobileMenu(!showMobileMenu)}
               className="p-2 text-slate-500 hover:bg-slate-100 rounded-full"
             >
                <MoreVertical size={24} />
             </button>
             {showMobileMenu && (
                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 z-20 overflow-hidden">
                     {/* Mobile Menu Actions */}
                     {!isEditing && (
                         <button 
                            onClick={() => { setIsEditing(true); setShowMobileMenu(false); }}
                            className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center"
                         >
                            <Edit size={16} className="mr-2" /> Edit Profile
                         </button>
                     )}
                     <button 
                        onClick={() => { onContactParent(); setShowMobileMenu(false); }}
                        className="w-full text-left px-4 py-3 text-sm font-medium text-primary-600 hover:bg-primary-50 border-t border-slate-100"
                     >
                        Contact Parent
                     </button>
                 </div>
             )}
          </div>
        </div>
    </div>
  );
};
