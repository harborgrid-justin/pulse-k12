
import React, { useState } from 'react';
import { Student } from '../../../types';
import { UserCheck, Phone, Users, Save } from 'lucide-react';

interface StudentEditFormProps {
  student: Student;
  onSave: (data: Partial<Student>) => void;
  onCancel: () => void;
}

export const StudentEditForm: React.FC<StudentEditFormProps> = ({ student, onSave, onCancel }) => {
  const [editFormData, setEditFormData] = useState<Partial<Student>>({
    firstName: student.firstName,
    lastName: student.lastName,
    grade: student.grade,
    parentContact: student.parentContact,
    parentPhone: student.parentPhone,
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateProfile = () => {
    const errors: Record<string, string> = {};
    if (!editFormData.firstName?.trim()) errors.firstName = "First name is required";
    if (!editFormData.lastName?.trim()) errors.lastName = "Last name is required";
    if (!editFormData.grade?.trim()) errors.grade = "Grade is required";
    if (!editFormData.parentContact?.trim()) errors.parentContact = "Parent name is required";
    
    const phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    if (!editFormData.parentPhone?.trim()) {
        errors.parentPhone = "Phone number is required";
    } else if (!phoneRegex.test(editFormData.parentPhone)) {
        errors.parentPhone = "Invalid format (e.g. 555-555-5555)";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateProfile()) return;
    onSave(editFormData);
  };

  return (
    <div className="space-y-4 max-w-lg w-full">
        <div className="grid grid-cols-2 gap-2">
            <div>
                <input 
                    className={`border ${validationErrors.firstName ? 'border-red-300' : 'border-slate-300'} bg-white rounded px-2 py-1 w-full font-bold text-lg focus:outline-none focus:ring-2 focus:ring-primary-500`} 
                    value={editFormData.firstName} 
                    onChange={(e) => setEditFormData({...editFormData, firstName: e.target.value})}
                    placeholder="First Name"
                />
                {validationErrors.firstName && <p className="text-xs text-red-500 mt-1">{validationErrors.firstName}</p>}
            </div>
            <div>
                <input 
                    className={`border ${validationErrors.lastName ? 'border-red-300' : 'border-slate-300'} bg-white rounded px-2 py-1 w-full font-bold text-lg focus:outline-none focus:ring-2 focus:ring-primary-500`} 
                    value={editFormData.lastName} 
                    onChange={(e) => setEditFormData({...editFormData, lastName: e.target.value})}
                    placeholder="Last Name"
                />
                {validationErrors.lastName && <p className="text-xs text-red-500 mt-1">{validationErrors.lastName}</p>}
            </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
                <div className="flex flex-col">
                    <div className={`flex items-center border ${validationErrors.grade ? 'border-red-300' : 'border-slate-300'} rounded px-2 py-1 bg-white`}>
                        <UserCheck size={14} className="mr-2 text-slate-400" />
                        <span className="text-sm text-slate-500 mr-2">Grade:</span>
                        <input 
                        className="w-12 outline-none text-sm font-medium bg-transparent focus:ring-0"
                        value={editFormData.grade}
                        onChange={(e) => setEditFormData({...editFormData, grade: e.target.value})}
                        />
                    </div>
                    {validationErrors.grade && <p className="text-xs text-red-500 mt-1">{validationErrors.grade}</p>}
                </div>

                <div className="flex flex-col">
                    <div className={`flex items-center border ${validationErrors.parentPhone ? 'border-red-300' : 'border-slate-300'} rounded px-2 py-1 bg-white`}>
                        <Phone size={14} className="mr-2 text-slate-400" />
                        <input 
                        className="w-32 outline-none text-sm font-medium bg-transparent focus:ring-0"
                        value={editFormData.parentPhone}
                        placeholder="Parent Phone"
                        onChange={(e) => setEditFormData({...editFormData, parentPhone: e.target.value})}
                        />
                    </div>
                    {validationErrors.parentPhone && <p className="text-xs text-red-500 mt-1">{validationErrors.parentPhone}</p>}
                </div>
        </div>

        <div className="flex flex-col">
            <div className={`flex items-center border ${validationErrors.parentContact ? 'border-red-300' : 'border-slate-300'} rounded px-2 py-1 bg-white`}>
                    <Users size={14} className="mr-2 text-slate-400" />
                    <span className="text-sm text-slate-500 mr-2">Parent:</span>
                    <input 
                    className="w-full outline-none text-sm font-medium bg-transparent focus:ring-0"
                    value={editFormData.parentContact}
                    placeholder="Parent/Guardian Name"
                    onChange={(e) => setEditFormData({...editFormData, parentContact: e.target.value})}
                    />
            </div>
            {validationErrors.parentContact && <p className="text-xs text-red-500 mt-1">{validationErrors.parentContact}</p>}
        </div>

        {/* Mobile Action Buttons (Desktop are in Header Parent) */}
        <div className="flex md:hidden gap-2 mt-4">
             <button 
                onClick={onCancel}
                className="flex-1 py-2 bg-slate-100 text-slate-600 font-medium rounded-lg hover:bg-slate-200 transition-colors"
            >
                Cancel
            </button>
            <button 
                onClick={handleSave}
                className="flex-1 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center"
            >
                <Save size={16} className="mr-2" /> Save
            </button>
        </div>
    </div>
  );
};
