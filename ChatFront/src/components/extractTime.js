export function extractTime(dateString) {
	const date = new Date(dateString);
	if (isNaN(date.getTime())) {
	  return formatTime(new Date());  
	}
  
	return formatTime(date);
  }
  
  function formatTime(date) {
	const hours = padZero(date.getHours());
	const minutes = padZero(date.getMinutes());
	return `${hours}:${minutes}`;
  }
  
  function padZero(number) {
	return number.toString().padStart(2, "0");
  }
  