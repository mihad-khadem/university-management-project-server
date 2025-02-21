import { TSchedule } from "./offeredCourse.interface";

export const isScheduleConflict = (
  assignedSchedule: TSchedule[],
  newSchedule: TSchedule
): boolean => {
  for (const schedule of assignedSchedule) {
    const existingStartTime = new Date(`2021-01-01T${schedule.startTime}`);
    const existingEndTime = new Date(`2021-01-01T${schedule.endTime}`);
    const newStartTime = new Date(`2021-01-01T${newSchedule.startTime}`);
    const newEndTime = new Date(`2021-01-01T${newSchedule.endTime}`);

    if (
      (newStartTime >= existingStartTime && newStartTime < existingEndTime) ||
      (newEndTime > existingStartTime && newEndTime <= existingEndTime)
    ) {
      return true;
    }
  }

  return false;
};
