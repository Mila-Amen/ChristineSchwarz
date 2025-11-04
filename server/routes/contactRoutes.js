 import axios from "axios";

const verifyCaptcha = async (token) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const response = await axios.post(
    "https://www.google.com/recaptcha/api/siteverify",
    new URLSearchParams({ secret: secretKey, response: token }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
  return response.data.success;
};
 