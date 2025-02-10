"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calculator, GraduationCap, BookOpen, Github } from "lucide-react";
import { PDFView } from "./pdf-view";

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
  seeMarks: number;
  totalInternalMarks: number; // New field for total internal marks (out of 50) for low credit courses
}

const grades = [
  { label: "O", value: "O", minMarks: 90, points: 10 },
  { label: "A+", value: "A+", minMarks: 80, points: 9 },
  { label: "A", value: "A", minMarks: 70, points: 8 },
  { label: "B+", value: "B+", minMarks: 60, points: 7 },
  { label: "B", value: "B", minMarks: 55, points: 6 },
  { label: "C", value: "C", minMarks: 50, points: 5 },
  { label: "P", value: "P", minMarks: 40, points: 4 },
  { label: "F", value: "F", minMarks: 0, points: 0 },
];

const emptySubject: Subject = {
  name: "",
  lectureCredits: 0,
  tutorialCredits: 0,
  practicalCredits: 0,
  cie1: 0,
  cie2: 0,
  cie3: 0,
  internalAssessment: 0,
  labMarks: 0,
  quizMarks: 0,
  estimatedGrade: "B",
  seeMarks: 0,
  totalInternalMarks: 0,
};

export default function CGPAPlanner() {
  const [semester, setSemester] = useState<number>(1);
  const [numSubjects, setNumSubjects] = useState<number>(0);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showPDF, setShowPDF] = useState(false);

  const getTotalCredits = (subject: Subject): number => {
    return (
      subject.lectureCredits +
      subject.tutorialCredits +
      subject.practicalCredits
    );
  };

  const validateInput = (value: number, min: number, max: number): number => {
    return Math.max(min, Math.min(max, value));
  };

  const calculateInternalMarks = (subject: Subject): number => {
    const totalCredits = getTotalCredits(subject);

    if (totalCredits <= 2) {
      return subject.totalInternalMarks;
    }

    const cie1Scaled = (subject.cie1 / 40) * 20;
    const cie2Scaled = (subject.cie2 / 40) * 20;
    const bestCIE = cie1Scaled + cie2Scaled;

    if (subject.practicalCredits === 0) {
      return bestCIE + subject.internalAssessment;
    } else {
      return bestCIE / 2 + subject.labMarks + subject.quizMarks;
    }
  };

  const calculateRequiredExternalMarks = (
    subject: Subject,
    internalMarks: number
  ): number => {
    const totalCredits = getTotalCredits(subject);

    const grade = grades.find((g) => g.value === subject.estimatedGrade);
    if (!grade) return 0;

    const totalRequired = grade.minMarks;
    const externalRequired = 2 * (totalRequired - internalMarks);
    return Math.max(0, Math.min(100, externalRequired));
  };

  const calculateSGPA = (): number => {
    let totalCredits = 0;

    let totalPoints = 0;

    subjects.forEach((subject) => {
      const totalSubjectCredits = getTotalCredits(subject);

      const grade = grades.find((g) => g.value === subject.estimatedGrade);

      if (grade) {
        totalPoints += totalSubjectCredits * grade.points;

        totalCredits += totalSubjectCredits;
      }
    });

    return totalCredits > 0
      ? Number((totalPoints / totalCredits).toFixed(2))
      : 0;
  };

  const updateSubject = (index: number, field: keyof Subject, value: any) => {
    setSubjects((prev) => {
      const newSubjects = [...prev];

      let validatedValue = value;

      // Validate numeric inputs based on their constraints

      switch (field) {
        case "lectureCredits":

        case "tutorialCredits":

        case "practicalCredits":
          validatedValue = validateInput(Number(value), 0, 4);

          break;

        case "cie1":

        case "cie2":

        case "cie3":
          validatedValue = validateInput(Number(value), 0, 40);

          break;

        case "internalAssessment":
          validatedValue = validateInput(Number(value), 0, 10);

          break;

        case "labMarks":
          validatedValue = validateInput(Number(value), 0, 25);

          break;

        case "quizMarks":
          validatedValue = validateInput(Number(value), 0, 5);

          break;

        case "seeMarks":
          validatedValue = validateInput(Number(value), 0, 100);

          break;
      }

      newSubjects[index] = {
        ...newSubjects[index],

        [field]: validatedValue,
      };

      return newSubjects;
    });
  };

  const handlePrintForm = () => {
    setShowPDF(true);
  };

  const handleNumSubjectsChange = (newNum: number) => {
    setNumSubjects(newNum);

    setSubjects((prev) => {
      if (newNum > prev.length) {
        return [
          ...prev,

          ...Array(newNum - prev.length)
            .fill(null)

            .map(() => ({ ...emptySubject })),
        ];
      }

      return prev.slice(0, newNum);
    });
  };

  return (
    <>
      {showPDF && (
        <PDFView
          subjects={subjects}
          semester={semester}
          sgpa={calculateSGPA()}
          calculateInternalMarks={calculateInternalMarks}
          calculateRequiredExternalMarks={calculateRequiredExternalMarks}
          onClose={() => setShowPDF(false)}
        />
      )}

      <div className="min-h-screen flex flex-col">
        <div className="flex-grow space-y-8 pb-16">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <GraduationCap className="w-8 h-8 text-primary" />
              <div>
                <h2 className="text-2xl font-semibold">
                  Subject Configuration
                </h2>
                <p className="text-muted-foreground">
                  Enter your semester and number of subjects
                </p>
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
                  onChange={(e) =>
                    setSemester(validateInput(Number(e.target.value), 1, 8))
                  }
                  className="max-w-xs"
                  placeholder="Enter semester (1-8)"
                />
              </div>
              <div>
                <Label htmlFor="numSubjects">Number of Subjects</Label>
                <Input
                  id="numSubjects"
                  type="number"
                  min="6"
                  max="10"
                  value={numSubjects}
                  onChange={(e) =>
                    handleNumSubjectsChange(
                      validateInput(Number(e.target.value), 0, 10)
                    )
                  }
                  className="max-w-xs"
                />
              </div>
            </div>
          </Card>

          {subjects.map((subject, index) => {
            const totalCredits = getTotalCredits(subject);
            const isLowCreditSubject = totalCredits <= 2;

            return (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <BookOpen className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-semibold">Subject {index + 1}</h3>
                  <span className="text-sm text-muted-foreground ml-auto">
                    Internal Marks: {calculateInternalMarks(subject).toFixed(2)}
                  </span>
                </div>

                <div className="grid gap-6">
                  <div className="grid gap-4">
                    <div>
                      <Label>Subject Name</Label>
                      <Input
                        value={subject.name}
                        onChange={(e) =>
                          updateSubject(index, "name", e.target.value)
                        }
                        placeholder="Enter subject name"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Lecture Credits (L)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="4"
                          value={subject.lectureCredits}
                          onChange={(e) =>
                            updateSubject(
                              index,
                              "lectureCredits",
                              Number(e.target.value)
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label>Tutorial Credits (T)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="4"
                          value={subject.tutorialCredits}
                          onChange={(e) =>
                            updateSubject(
                              index,
                              "tutorialCredits",
                              Number(e.target.value)
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label>Practical Credits (P)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="4"
                          value={subject.practicalCredits}
                          onChange={(e) =>
                            updateSubject(
                              index,
                              "practicalCredits",
                              Number(e.target.value)
                            )
                          }
                        />
                      </div>
                    </div>

                    {isLowCreditSubject ? (
                      <div>
                        <Label>Total Internal Marks (out of 50)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="50"
                          value={subject.totalInternalMarks}
                          onChange={(e) =>
                            updateSubject(
                              index,
                              "totalInternalMarks",
                              Number(e.target.value)
                            )
                          }
                        />
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label>CIE 1 (out of 40)</Label>
                            <Input
                              type="number"
                              min="0"
                              max="40"
                              value={subject.cie1}
                              onChange={(e) =>
                                updateSubject(
                                  index,
                                  "cie1",
                                  Number(e.target.value)
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label>CIE 2 (out of 40)</Label>
                            <Input
                              type="number"
                              min="0"
                              max="40"
                              value={subject.cie2}
                              onChange={(e) =>
                                updateSubject(
                                  index,
                                  "cie2",
                                  Number(e.target.value)
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label>CIE 3 (out of 40)</Label>
                            <Input
                              type="number"
                              min="0"
                              max="40"
                              value={subject.cie3}
                              onChange={(e) =>
                                updateSubject(
                                  index,
                                  "cie3",
                                  Number(e.target.value)
                                )
                              }
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
                              onChange={(e) =>
                                updateSubject(
                                  index,
                                  "internalAssessment",
                                  Number(e.target.value)
                                )
                              }
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
                                onChange={(e) =>
                                  updateSubject(
                                    index,
                                    "labMarks",
                                    Number(e.target.value)
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Label>Quiz Marks (5M)</Label>
                              <Input
                                type="number"
                                min="0"
                                max="5"
                                value={subject.quizMarks}
                                onChange={(e) =>
                                  updateSubject(
                                    index,
                                    "quizMarks",
                                    Number(e.target.value)
                                  )
                                }
                              />
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    <div>
                      <Label>Estimated Grade</Label>
                      <Select
                        value={subject.estimatedGrade}
                        onValueChange={(value) =>
                          updateSubject(index, "estimatedGrade", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {grades.map((grade) => (
                            <SelectItem key={grade.value} value={grade.value}>
                              {grade.label} ({grade.points} points)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}

          {subjects.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <Calculator className="w-8 h-8 text-primary" />
                <div>
                  <h2 className="text-2xl font-semibold">Grade Summary</h2>
                  <p className="text-muted-foreground">
                    Required external marks to achieve estimated grades
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Grade Summary</h2>
                <button
                  onClick={handlePrintForm}
                  className="text-primary hover:underline cursor-pointer"
                >
                  Print form 🔗
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Subject</th>
                      <th className="text-left p-2">Credits (L-T-P)</th>
                      <th className="text-left p-2">Internal Marks</th>
                      <th className="text-left p-2">Estimated Grade</th>
                      <th className="text-left p-2">
                        Required External (out of 100)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((subject, index) => {
                      const internalMarks = calculateInternalMarks(subject);
                      const requiredExternal = calculateRequiredExternalMarks(
                        subject,
                        internalMarks
                      );

                      return (
                        <tr key={index} className="border-b">
                          <td className="p-2">
                            {subject.name || `Subject ${index + 1}`}
                          </td>
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
              <div className="mt-6 p-4 bg-secondary rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Expected SGPA</h2>
                <p className="text-3xl font-bold">{calculateSGPA()}</p>
              </div>
            </Card>
          )}
        </div>
        <footer className="bg-secondary py-6 mt-auto">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <h3 className="font-semibold text-lg">CGPA Planner</h3>
                <p className="text-sm text-muted-foreground">
                  Plan and track your academic performance
                </p>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <span className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} CGPA Planner. All rights
                  reserved.
                </span>
              </div>
            </div>
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">
                Developed by Navneeth K S for the students of B.M.S.C.E. For
                more info please visit{" "}
                <a
                  href="https://kingnavneeth.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  kingnavneeth.vercel.app
                </a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
