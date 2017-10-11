export class Class {
  id: String;
  name: String;
  defaultSkills?: {skillID: String}[];
  meta?: {
    creationDate: Date;
    modificationDate: Date
  };
}
