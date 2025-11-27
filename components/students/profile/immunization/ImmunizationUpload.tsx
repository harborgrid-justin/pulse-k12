
import React, { useRef } from 'react';
import { Loader2, UploadCloud } from 'lucide-react';

interface ImmunizationUploadProps {
  isAnalyzing: boolean;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImmunizationUpload: React.FC<ImmunizationUploadProps> = ({ isAnalyzing, onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer h-64 flex flex-col items-center justify-center" onClick={() => fileInputRef.current?.click()}>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={onFileSelect} />
        {isAnalyzing ? (
            <div className="flex flex-col items-center animate-fade-in">
                <Loader2 size={40} className="text-primary-600 animate-spin mb-4" />
                <p className="font-medium text-slate-700">Analyzing Document...</p>
                <p className="text-sm text-slate-500">Extracting dates and lot numbers</p>
            </div>
        ) : (
            <div className="animate-fade-in flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                    <UploadCloud size={32} />
                </div>
                <h4 className="font-bold text-slate-700">Click to Upload Record</h4>
                <p className="text-sm text-slate-500 mt-1">Supports PDF, JPG, PNG</p>
                <p className="text-xs text-slate-400 mt-4">AI automatically extracts vaccine data.</p>
            </div>
        )}
    </div>
  );
};
