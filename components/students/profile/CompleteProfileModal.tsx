
import React, { useState, useEffect } from 'react';
import { Student } from '../../../types';
import { X, Save } from 'lucide-react';

interface CompleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Student>) => void;
  student: Student;
}

export const CompleteProfileModal: React.FC<CompleteProfileModalProps> = ({ isOpen, onClose, onSave, student }) => {
  const [profileForm, setProfileForm] = useState({
      bloodType: '',
      height: '',
      weight: '',
      gender: '',
      dob: ''
  });

  useEffect(() => {
    if (isOpen) {
      setProfileForm({
          bloodType: student.bloodType || '',
          height: student.height || '',
          weight: student.weight || '',
          gender: student.gender || '',
          dob: student.dob || ''
      });
    }
  }, [isOpen, student]);

  const handleSave = () => {
      onSave(profileForm);
      onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-lg font-bold text-slate-800">Update Student Profile</h3>
                <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                        <input 
                        type="date" 
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                        value={profileForm.dob}
                        onChange={(e) => setProfileForm({...profileForm, dob: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                        <select 
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                        value={profileForm.gender}
                        onChange={(e) => setProfileForm({...profileForm, gender: e.target.value})}
                        >
                            <option value="">Select...</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Non-Binary">Non-Binary</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Height</label>
                        <input 
                        placeholder="e.g. 4'5&quot;" 
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                        value={profileForm.height}
                        onChange={(e) => setProfileForm({...profileForm, height: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Weight</label>
                        <input 
                        placeholder="e.g. 85 lbs" 
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                        value={profileForm.weight}
                        onChange={(e) => setProfileForm({...profileForm, weight: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Blood Type</label>
                        <select 
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                        value={profileForm.bloodType}
                        onChange={(e) => setProfileForm({...profileForm, bloodType: e.target.value})}
                        >
                            <option value="">Unknown</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-white rounded-lg font-medium">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 flex items-center">
                    <Save size={16} className="mr-2" /> Save Changes
                </button>
            </div>
        </div>
    </div>
  );
};
