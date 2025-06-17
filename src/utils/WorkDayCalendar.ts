import { addDays, format, isWeekend, setHours, setMinutes } from "date-fns";

export class WorkDayCalendar {
    private holidays = new Set<string>();
    private recurringHolidays = new Set<string>();
    private workStartHour = 9;
    private workStopHour = 16;
    private workStartminute = 0;
    private workStopMinute = 0

    setHolidays(date: Date) {
        this.holidays.add(format(date, 'yyyy-MM-dd'))
    }

    setRecurringHolidays(date: Date) {
        this.recurringHolidays.add(format(date, 'MM-dd'))
    }

    setWorkDaystartAndStop(start: Date, stop: Date) {
        this.workStartHour = start.getHours()
        this.workStartminute = start.getMinutes()
        this.workStopHour = stop.getHours()
        this.workStopMinute = stop.getMinutes()
    }

    getWorkDayIncrement(startDate: Date, increment: number): Date {
        let current = new Date(startDate)
        const direction = increment < 0 ? -1 : 1
        const absIncrement = Math.abs(increment)
        let fullDays = Math.floor(absIncrement)
        const fraction = absIncrement - fullDays

        while (fullDays > 0) {
            current = addDays(current, direction)
            if (this.isWorkingDay(current)) {
                fullDays--
            }
        }
        current = this.normalizeWorkingTime(current)
        if (fraction > 0) {
            current = this.addDractionOfDay(current, fraction, direction)
        }

        return current
    }

    isWorkingDay(date: Date): boolean {
        if (isWeekend(date)) return false
        const formatted = format(date, 'yyyy-MM-dd')
        const recurring = format(date, 'MM-dd')
        if (this.holidays.has(formatted)) return false
        if (this.recurringHolidays.has(recurring)) return false
        return true
    }

    private addDractionOfDay(current: Date, fraction: number, direction: number): Date {
        const workStartMinutes = this.workStartHour * 60 + this.workStartminute
        const workDayMinutes = (this.workStopHour * 60 + this.workStopMinute) - workStartMinutes
        let currentTimeMinutes = current.getHours() * 60 + current.getMinutes() - workStartMinutes
        currentTimeMinutes += fraction * workDayMinutes * direction
        if (currentTimeMinutes < 0 || currentTimeMinutes > workDayMinutes) {
            current = addDays(current, direction)
            while (!this.isWorkingDay(current)) {
                current = addDays(current, direction)
            }
            if (currentTimeMinutes < 0) {
                currentTimeMinutes += workDayMinutes
            }
            else currentTimeMinutes -= workDayMinutes
        }

        const newHour = this.workStartHour + Math.floor(currentTimeMinutes / 60)
        const newMinutes = this.workStartminute + Math.floor(currentTimeMinutes % 60)
        return setMinutes(setHours(current, newHour), newMinutes)
    }
    normalizeWorkingTime(date: Date): Date {
        const hour = date.getHours()
        const minute = date.getMinutes()
        if (hour < this.workStartHour || (hour === this.workStartHour && minute < this.workStartminute)) {
            return setMinutes(setHours(date, this.workStartHour), this.workStartminute)
        }
        if (hour > this.workStopHour || (hour === this.workStopHour && minute < this.workStopMinute)) {
            return setMinutes(setHours(date, this.workStopHour), this.workStopMinute)
        }
        return date
    }

}