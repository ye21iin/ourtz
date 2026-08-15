export type ComparisonTimezone = {
  city: string;
  timezone: string;
};

export type Event = {
  id: string;
  title: string;
  datetime: string;
  timezone: string;
  city: string;
  comparisonTimezones: ComparisonTimezone[];
};
