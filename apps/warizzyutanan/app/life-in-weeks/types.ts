export interface LifeEvent {
  id: string;
  started_at: string;
  ended_at?: string;
  title: string;
  description: string;
  color?: string;
  is_private?: boolean;
}

export interface WeekData {
  index: number;
  date: Date;
  events: LifeEvent[];
  isCurrentWeek: boolean;
}
