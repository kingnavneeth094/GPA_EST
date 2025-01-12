'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calculator, GraduationCap, BookOpen } from 'lucide-react';

interface Subject {
  name: string;
  lectureCredits: number;
  tutorialCredits: number;
  practicalCredits: number;
  cie1: number;
  cie2: number;
  cie3: number;
  internalAssessment: number;
  labMarks: number;
  quizMarks: number;
  estimatedGrade: string;
}

const grades = [
  { label: 'A+', value: 'A+', minMarks: 90 },
  { label: 'A', value: 'A', minMarks: 80 },
  { label: 'B+', value: 'B+', minMarks: 70 },
  { label: 'B', value: 'B', minMarks: 60 },
  { label: 'C+', value: 'C+', minMarks: 50 },
  { label: 'C', value: 'C', minMarks: 40 },
  { label: 'D', value: 'D', minMarks: 35 },
  { label: 'F', value: 'F', minMarks: 0 },
];

const emptySubject: Subject = {
  name: '',
  lectureCredits: 0,
  tutorialCredits: 0,
  practicalCredits: 0,
  cie1: 0,
  cie2: 0,
  cie3: 0,
  internalAssessment: 0,
  labMarks: 0,
  quizMarks: 0,
  estimatedGrade: 'B',
};

export default function CGPAPlanner() {
  const [semester, setSemester] = useState<number>(1);
  const [numSubjects, setNumSubjects] = useState<number>(0);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const calculateInternalMarks = (subject: Subject): number => {
    const cie1Scaled = (subject.cie1 / 40) * 20;
    const cie2Scaled = (subject.cie2 / 40) * 20;
    const bestCIE = cie1Scaled + cie2Scaled;
    
    if (subject.practicalCredits === 0) {
      return bestCIE + subject.internalAssessment;
    } else {
      return (bestCIE / 2) + subject.labMarks + subject.quizMarks;
    }
  };

  const calculateRequiredExternalMarks = (subject: Subject, internalMarks: number): number => {
    const grade = grades.find(g => g.value === subject.estimatedGrade);
    if (!grade) return 0;
    
    const totalRequired = grade.minMarks;
    const externalRequired = 2 * (totalRequired - internalMarks);
    return Math.max(0, Math.min(100, externalRequired));
  };

  const updateSubject = (index: number, field: keyof Subject, value: any) => {
    setSubjects(prev => {
      const newSubjects = [...prev];
      newSubjects[index] = {
        ...newSubjects[index],
        [field]: value,
      };
      return newSubjects;
    });
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <GraduationCap className="w-8 h-8 text-primary" />
          <div>
            <h2 className="text-2xl font-semibold">Subject Configuration</h2>
            <p className="text-muted-foreground">Enter your semester and number of subjects</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 max-w-xl">
          <div>
            <Label htmlFor="semester">Semester</Label>
            <Input
              id="semester"
              type="number"
              min="1"
              max="8"
              value={semester}
              onChange={(e) => setSemester(Math.min(8, Math.max(1, Number(e.target.value))))}
              className="max-w-xs"
              placeholder="Enter semester (1-8)"
            />
          </div>
          <div>
            <Label htmlFor="numSubjects">Number of Subjects</Label>
            <Input
              id="numSubjects"
              type="number"
              min="1"
              max="10"
              value={numSubjects}
              onChange={(e) => {
                const num = parseInt(e.target.value) || 0;
                setNumSubjects(num);
                setSubjects(Array(num).fill(null).map(() => ({...emptySubject})));
              }}
              className="max-w-xs"
            />
          </div>
        </div>
      </Card>

      {subjects.map((subject, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <BookOpen className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold">Subject {index + 1}</h3>
          </div>

          <div className="grid gap-6">
            <div className="grid gap-4">
              <div>
                <Label>Subject Name</Label>
                <Input
                  value={subject.name}
                  onChange={(e) => updateSubject(index, 'name', e.target.value)}
                  placeholder="Enter subject name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Lecture Credits (L)</Label>
                  <Input
                    type="number"
                    value={subject.lectureCredits}
                    onChange={(e) => updateSubject(index, 'lectureCredits', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Tutorial Credits (T)</Label>
                  <Input
                    type="number"
                    value={subject.tutorialCredits}
                    onChange={(e) => updateSubject(index, 'tutorialCredits', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Practical Credits (P)</Label>
                  <Input
                    type="number"
                    value={subject.practicalCredits}
                    onChange={(e) => updateSubject(index, 'practicalCredits', Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>CIE 1 (out of 40)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="40"
                    value={subject.cie1}
                    onChange={(e) => updateSubject(index, 'cie1', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>CIE 2 (out of 40)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="40"
                    value={subject.cie2}
                    onChange={(e) => updateSubject(index, 'cie2', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>CIE 3 (out of 40)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="40"
                    value={subject.cie3}
                    onChange={(e) => updateSubject(index, 'cie3', Number(e.target.value))}
                  />
                </div>
              </div>

              {subject.practicalCredits === 0 ? (
                <div>
                  <Label>Internal Assessment (10M)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    value={subject.internalAssessment}
                    onChange={(e) => updateSubject(index, 'internalAssessment', Number(e.target.value))}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Lab Marks (25M)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="25"
                      value={subject.labMarks}
                      onChange={(e) => updateSubject(index, 'labMarks', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Quiz Marks (5M)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="5"
                      value={subject.quizMarks}
                      onChange={(e) => updateSubject(index, 'quizMarks', Number(e.target.value))}
                    />
                  </div>
                </div>
              )}

              <div>
                <Label>Estimated Grade</Label>
                <Select
                  value={subject.estimatedGrade}
                  onValueChange={(value) => updateSubject(index, 'estimatedGrade', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem key={grade.value} value={grade.value}>
                        {grade.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>
      ))}

      {subjects.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Calculator className="w-8 h-8 text-primary" />
            <div>
              <h2 className="text-2xl font-semibold">Grade Summary</h2>
              <p className="text-muted-foreground">Required external marks to achieve estimated grades</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Subject</th>
                  <th className="text-left p-2">Credits (L-T-P)</th>
                  <th className="text-left p-2">Internal Marks</th>
                  <th className="text-left p-2">Estimated Grade</th>
                  <th className="text-left p-2">Required External (out of 100)</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject, index) => {
                  const internalMarks = calculateInternalMarks(subject);
                  const requiredExternal = calculateRequiredExternalMarks(subject, internalMarks);
                  
                  return (
                    <tr key={index} className="border-b">
                      <td className="p-2">{subject.name || `Subject ${index + 1}`}</td>
                      <td className="p-2">{`${subject.lectureCredits}-${subject.tutorialCredits}-${subject.practicalCredits}`}</td>
                      <td className="p-2">{internalMarks.toFixed(2)}</td>
                      <td className="p-2">{subject.estimatedGrade}</td>
                      <td className="p-2">{requiredExternal.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}