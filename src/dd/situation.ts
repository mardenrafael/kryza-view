export const SituationEnum = {
  ACTIVE: 1,
  INACTIVE: 2,
  PENDING: 3,
  DELETED: 4,
  ARCHIVED: 5,
  SUSPENDED: 6,
  COMPLETED: 7,
  CANCELED: 8,
  EXPIRED: 9,
  UNDER_ANALYSIS: 10,
};

export const Situation = [
  { id: SituationEnum.ACTIVE, name: "ACTIVE" },
  { id: SituationEnum.INACTIVE, name: "INACTIVE" },
  { id: SituationEnum.PENDING, name: "PENDING" },
  { id: SituationEnum.DELETED, name: "DELETED" },
  { id: SituationEnum.ARCHIVED, name: "ARCHIVED" },
  { id: SituationEnum.SUSPENDED, name: "SUSPENDED" },
  { id: SituationEnum.COMPLETED, name: "COMPLETED" },
  { id: SituationEnum.CANCELED, name: "CANCELED" },
  { id: SituationEnum.EXPIRED, name: "EXPIRED" },
  { id: SituationEnum.UNDER_ANALYSIS, name: "UNDER_ANALYSIS" },
];
