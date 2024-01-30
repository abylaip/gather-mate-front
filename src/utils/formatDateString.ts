export function formatDateString(dateString: string): string {
  const months: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let date: Date = new Date(dateString);

  let day: number = date.getUTCDate();
  let month: string = months[date.getUTCMonth()];
  let hours: number = date.getUTCHours();
  let minutes: any = date.getUTCMinutes();
  let ampm: string = hours >= 12 ? "pm" : "am";

  hours = hours % 12;
  hours = hours || 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  return `${day} ${month}, ${hours}:${minutes} ${ampm}`;
}

// Example usage
