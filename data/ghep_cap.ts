// data/menteePairings.ts

export interface MenteePairing {
  studentUsername: string;  // username sinh viên
  tutorUsername: string;    // username tutor
}

// Sinh viên nào đang ghép với tutor nào (mock)
export const mockMenteePairings: MenteePairing[] = [
  { studentUsername: "sv1", tutorUsername: "tutor1" },
  { studentUsername: "sv002", tutorUsername: "tutor_a" },
  { studentUsername: "sv003", tutorUsername: "tutor_b" },
  { studentUsername: "sv004", tutorUsername: "tutor_c" },
];
