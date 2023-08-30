export const getTime = (date: Date): number => date.getTime()

export const extractDate = (date: Date) => date.toISOString().split('T')[0]

export const getDateAsString = (date: Date) => new Date(date).toISOString().split('T')[0]

export const getEventDays = (start: Date, end: Date): Date[] => {
  // Calculate the difference in days between the two dates
  const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

  // Generate the date options
  const dates = []
  for (let i = 0; i < days; i++) {
    const date = new Date(start.getTime() + i * 24 * 60 * 60 * 1000)
    dates.push(date)
  }

  return dates
}
