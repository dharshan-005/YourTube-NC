const southernStates = [
  "Tamil Nadu",
  "Kerala",
  "Karnataka",
  "Andhra Pradesh",
  "Telangana"
];

function getThemeAndOtpMethod(state) {
  const hour = new Date().getHours();

  const isSouth = southernStates.includes(state);
  const isTimeValid = hour >= 10 && hour < 12;

  const theme = isSouth && isTimeValid ? "light" : "dark";
  const otpMethod = isSouth ? "email" : "sms";

  return { theme, otpMethod };
}

module.exports = { getThemeAndOtpMethod };
