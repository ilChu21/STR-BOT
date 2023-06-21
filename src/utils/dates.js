export function getCurrentDate() {
  try {
    const date = new Date();
    const year = date.getFullYear();
    const month = padZero(date.getMonth() + 1);
    const day = padZero(date.getDate());
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('❌ getCurrentDate()', error);
  }
}

function padZero(value) {
  try {
    return value.toString().padStart(2, '0');
  } catch (error) {
    console.error('❌ padZero()', error);
  }
}

export function getWeeksSince(date) {
  try {
    const timeDiff = currentDate.getTime() - date.getTime();
    const weeks = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 7));

    return weeks;
  } catch (error) {
    console.error('❌ getWeeksSince()', error);
  }
}
