export type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type WorkingDaysValue =
  | string
  | string[]
  | Record<string, { start?: string; end?: string; time?: string; day?: string }>
  | Array<{ day?: string; time?: string; start?: string; end?: string }>
  | undefined;

export type WorkingDayEntry = { day: DayKey; time: string | undefined };
export type DayScheduleMap = Partial<Record<DayKey, { start: string; end: string }>>;

const DAY_ALIAS_TO_KEY: Record<string, DayKey> = {
  mon: "monday",
  monday: "monday",
  tue: "tuesday",
  tues: "tuesday",
  tuesday: "tuesday",
  wed: "wednesday",
  weds: "wednesday",
  wednesday: "wednesday",
  thu: "thursday",
  thur: "thursday",
  thurs: "thursday",
  thursday: "thursday",
  fri: "friday",
  friday: "friday",
  sat: "saturday",
  saturday: "saturday",
  sun: "sunday",
  sunday: "sunday",
};

export const DAY_OPTIONS: { key: DayKey; label: string }[] = [
  { key: "monday", label: "Mon" },
  { key: "tuesday", label: "Tue" },
  { key: "wednesday", label: "Wed" },
  { key: "thursday", label: "Thu" },
  { key: "friday", label: "Fri" },
  { key: "saturday", label: "Sat" },
  { key: "sunday", label: "Sun" },
];

export const DAY_LABEL_BY_KEY: Record<DayKey, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

export function normalizeDayKey(rawDay?: string): DayKey | null {
  if (!rawDay) {
    return null;
  }

  return DAY_ALIAS_TO_KEY[rawDay.toLowerCase().trim()] || null;
}

export function parseWorkingDaysMap(workingDays: unknown): DayScheduleMap {
  if (!workingDays) {
    return {};
  }

  let parsed: unknown = workingDays;
  if (typeof workingDays === "string") {
    try {
      parsed = JSON.parse(workingDays);
    } catch {
      return {};
    }
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return {};
  }

  const normalized: DayScheduleMap = {};

  Object.entries(parsed as Record<string, unknown>).forEach(([day, value]) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return;
    }

    const record = value as Record<string, unknown>;
    const start = typeof record.start === "string" ? record.start : "";
    const end = typeof record.end === "string" ? record.end : "";
    const normalizedDay = normalizeDayKey(day);

    if (start && end && normalizedDay) {
      normalized[normalizedDay] = { start, end };
    }
  });

  return normalized;
}

export function parseWorkingDaysEntries(
  workingDays?: WorkingDaysValue,
): WorkingDayEntry[] {
  const normalizeEntries = (
    entries: Array<{ day?: string; time?: string; start?: string; end?: string } | string>,
  ): WorkingDayEntry[] => {
    return entries
      .map((entry) => {
        if (typeof entry === "string") {
          const normalizedDay = normalizeDayKey(entry);
          return normalizedDay ? { day: normalizedDay, time: undefined } : null;
        }

        if (entry && typeof entry === "object") {
          const normalizedDay = normalizeDayKey(entry.day || "");
          if (!normalizedDay) {
            return null;
          }

          const time =
            entry.time ||
            (entry.start && entry.end ? `${entry.start} - ${entry.end}` : undefined);

          return { day: normalizedDay, time };
        }

        return null;
      })
      .filter((entry): entry is WorkingDayEntry => Boolean(entry));
  };

  if (!workingDays) {
    return [];
  }

  try {
    if (typeof workingDays === "string") {
      const parsed = JSON.parse(workingDays);

      if (Array.isArray(parsed)) {
        return normalizeEntries(parsed);
      }

      if (typeof parsed === "object" && parsed !== null) {
        return Object.entries(parsed)
          .map(([day, value]) => {
            const normalizedDay = normalizeDayKey(day);
            if (!normalizedDay) {
              return null;
            }

            const record = value as { start?: string; end?: string };
            return {
              day: normalizedDay,
              time:
                record && record.start && record.end
                  ? `${record.start} - ${record.end}`
                  : undefined,
            };
          })
          .filter((entry): entry is WorkingDayEntry => Boolean(entry));
      }

      if (workingDays.includes(",")) {
        return workingDays
          .split(",")
          .map((d) => normalizeDayKey(d.trim()))
          .filter((day): day is DayKey => Boolean(day))
          .map((day) => ({ day, time: undefined }));
      }
    }

    if (Array.isArray(workingDays)) {
      return normalizeEntries(workingDays);
    }

    if (typeof workingDays === "object" && workingDays !== null) {
      return Object.entries(workingDays)
        .map(([day, value]) => {
          const normalizedDay = normalizeDayKey(day);
          if (!normalizedDay) {
            return null;
          }

          const record = value as { start?: string; end?: string };
          return {
            day: normalizedDay,
            time:
              record && record.start && record.end
                ? `${record.start} - ${record.end}`
                : undefined,
          };
        })
        .filter((entry): entry is WorkingDayEntry => Boolean(entry));
    }
  } catch {
    if (typeof workingDays === "string" && workingDays.includes(",")) {
      return workingDays
        .split(",")
        .map((d) => normalizeDayKey(d.trim()))
        .filter((day): day is DayKey => Boolean(day))
        .map((day) => ({ day, time: undefined }));
    }
  }

  return [];
}