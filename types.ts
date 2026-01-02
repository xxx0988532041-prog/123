
export interface Participant {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  members: Participant[];
}

export enum AppTab {
  LIST_MANAGEMENT = 'LIST_MANAGEMENT',
  LUCKY_DRAW = 'LUCKY_DRAW',
  TEAM_GROUPING = 'TEAM_GROUPING'
}
