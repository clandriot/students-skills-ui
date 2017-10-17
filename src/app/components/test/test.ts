export class Test {
  id: String;
  name: String;
  date: Date;
  description?: String;
  classID: String;
  skills: SkillScore[];
  results: TestResult[];
  meta?: {
    creationDate: Date;
    modificationDate: Date;
  };
}

export class SkillScore {
  skillID: String;
  scoringScale: number;
}

export class SkillSelection {
  skillScore: SkillScore;
  shortName: String;
  selected: boolean;
}

export class TestResult {
  studentID: String;
  notes: TestNote[];
}

export class TestNote {
  skillID: String;
  skillNote: number;
}
