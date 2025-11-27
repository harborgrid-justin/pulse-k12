
import { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { Student, VisitLog, Medication, School, District, County, State, Teacher, Incident, AuditLogEntry, DirectorySchool } from '../types';

export const useApplicationData = () => {
  // Data State
  const [students, setStudents] = useState<Student[]>([]);
  const [visits, setVisits] = useState<VisitLog[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [school, setSchool] = useState<School | null>(null);
  const [district, setDistrict] = useState<District | null>(null);
  const [county, setCounty] = useState<County | null>(null);
  const [state, setState] = useState<State | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [externalSchools, setExternalSchools] = useState<DirectorySchool[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [loadedStudents, loadedVisits, loadedMeds, loadedSchool, loadedDistrict, loadedCounty, loadedState, loadedTeachers, loadedIncidents, loadedAudit, loadedExternalSchools] = await Promise.all([
          DataService.getStudents(),
          DataService.getVisits(),
          DataService.getMedications(),
          DataService.getSchoolProfile(),
          DataService.getDistrictProfile(),
          DataService.getCountyProfile(),
          DataService.getStateProfile(),
          DataService.getTeachers(),
          DataService.getIncidents(),
          DataService.getAuditLogs(),
          DataService.getExternalSchools()
        ]);
        setStudents(loadedStudents);
        setVisits(loadedVisits);
        setMedications(loadedMeds);
        setSchool(loadedSchool);
        setDistrict(loadedDistrict);
        setCounty(loadedCounty);
        setState(loadedState);
        setTeachers(loadedTeachers);
        setIncidents(loadedIncidents);
        setAuditLogs(loadedAudit);
        setExternalSchools(loadedExternalSchools);
      } catch (error) {
        console.error("Failed to load initial data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // State Setters to expose
  return {
    students, setStudents,
    visits, setVisits,
    medications, setMedications,
    school, setSchool,
    district, setDistrict,
    county, setCounty,
    state, setState,
    teachers, setTeachers,
    incidents, setIncidents,
    auditLogs, setAuditLogs,
    externalSchools,
    isLoading
  };
};
