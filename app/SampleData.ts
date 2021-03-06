import dayjs from "dayjs";
import { Habit, HabitLog } from "./Types";

const createRandomDates = (startDate: Date, endDate: Date, n: number): Date[] => {
    const startMillis = startDate.getTime()
    const endMillis = endDate.getTime()
    const intervalMillis = endMillis - startMillis
    const outputMillis: number[] = []
    for (let i = 0; i < n; i++) {
        const newMillis = startMillis + intervalMillis * Math.random()
        outputMillis.push(newMillis)
    }
    const dates = outputMillis.sort().map(m => new Date(m))
    return dates
}

const dateToHabitLog = (date: Date): HabitLog => ({
    time: date.toISOString()
})

const sampleStartDate = new Date(2020, 1, 1)
const sampleEndDate = new Date()
// TODO: Refactor date transformations
const habits: Habit[] = [
    {
        id: '0',
        name: 'Drink Water',
        createdTime: (new Date()).toISOString(),
        archived: false,
        logs: createRandomDates(sampleStartDate, sampleEndDate, 1834).map(dateToHabitLog)
    },
    {
        id: '1',
        name: 'Do Planks',
        createdTime: (new Date()).toISOString(),
        archived: false,
        logs: createRandomDates(sampleStartDate, sampleEndDate, 235).map(dateToHabitLog)
    },
    {
        id: '2',
        name: 'Meditate',
        createdTime: (new Date()).toISOString(),
        archived: false,
        logs: createRandomDates(sampleStartDate, sampleEndDate, 788).map(dateToHabitLog)
    },
    {
        id: '3',
        name: 'Resist Social Media',
        createdTime: (new Date()).toISOString(),
        archived: false,
        logs: createRandomDates(sampleStartDate, sampleEndDate, 3453).map(dateToHabitLog)
    },
    {
        id: '4',
        name: 'Journal',
        createdTime: (new Date()).toISOString(),
        archived: false,
        logs: createRandomDates(sampleStartDate, sampleEndDate, 567).map(dateToHabitLog)
    },
    {
        id: '5',
        name: 'Control anger',
        createdTime: (new Date()).toISOString(),
        archived: false,
        logs: createRandomDates(sampleStartDate, sampleEndDate, 876).map(dateToHabitLog)
    },
    {
        id: '6',
        name: 'Eat/drink something healthy',
        createdTime: (new Date()).toISOString(),
        archived: false,
        logs: createRandomDates(sampleStartDate, sampleEndDate, 78).map(dateToHabitLog)
    },
    {
        id: '7',
        name: 'Hold a good posture',
        createdTime: (new Date()).toISOString(),
        archived: false,
        logs: createRandomDates(sampleStartDate, sampleEndDate, 4).map(dateToHabitLog)
    }
]

export { habits as default } 