import zxcvbn from "zxcvbn";

export function passwordStrengthChecker(password) {
  const result = zxcvbn(password);
  return result.score; // returns a score from 0 (weakest) to 4 (strongest)
}

export function generatePassword(length = 12) {
  // Define character sets
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

  const allCharacters = uppercase + lowercase + numbers + symbols;

  // Generate a random password
  let password = "";
  const crypto = window.crypto || window.msCrypto; // for IE 11

  for (let i = 0; i < length; i++) {
    const randomIndex =
      crypto.getRandomValues(new Uint32Array(1))[0] % allCharacters.length;
    password += allCharacters[randomIndex];
  }

  return password;
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

export function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatDuration(durationString) {
  const durationInMinutes = parseInt(durationString, 10);

  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;

  return {
    hours: hours,
    minutes: minutes,
  };
}
