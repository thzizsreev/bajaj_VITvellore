import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


const isNumericString = (s) => /^[+-]?\d+$/.test(s);  
const isAlphaString   = (s) => /^[A-Za-z]+$/.test(s); 
const isAlnum         = (s) => /^[A-Za-z0-9]+$/.test(s);


function buildConcatString(alphaItems) {
  const chars = [];
  for (const word of alphaItems) {
    for (const ch of word) {
      if (/[A-Za-z]/.test(ch)) chars.push(ch);
    }
  }
 
  chars.reverse();
  
  return chars
    .map((ch, idx) => (idx % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
    .join("");
}

app.post("/bfhl", (req, res) => {
  try {
    const { data } = req.body ?? {};
    if (!Array.isArray(data)) {
      return res.status(200).json({
        is_success: false,
        user_id: null,
        email: process.env.EMAIL || null,
        roll_number: process.env.ROLL_NUMBER || null,
        odd_numbers: [],
        even_numbers: [],
        alphabets: [],
        special_characters: [],
        sum: "0",
        concat_string: ""
      });
    }

    const email = process.env.EMAIL || "john@xyz.com";
    const roll = process.env.ROLL_NUMBER || "ABCD123";
    const fullName = (process.env.FULL_NAME || "john doe").toLowerCase().replace(/\s+/g, "_");
    const dob = process.env.DOB || "17091999"; // ddmmyyyy
    const user_id = `${fullName}_${dob}`;

    const odd = [];
    const even = [];
    const alphasUpper = [];
    const specials = [];
    let sum = 0;

    for (const item of data) {
      
      const s = String(item);

      if (isNumericString(s)) {
        
        const num = parseInt(s, 10);
        sum += num;
        if (Math.abs(num) % 2 === 0) {
          even.push(s);
        } else {
          odd.push(s);
        }
      } else if (isAlphaString(s)) {
        alphasUpper.push(s.toUpperCase());
      } else {
        
        if (!isAlnum(s)) specials.push(s);
      }
    }

    const concat_string = buildConcatString(alphasUpper);

    return res.status(200).json({
      is_success: true,
      user_id,
      email,
      roll_number: roll,
      odd_numbers: odd,
      even_numbers: even,
      alphabets: alphasUpper,
      special_characters: specials,
      sum: String(sum),
      concat_string
    });
  } catch (err) {
    
    return res.status(200).json({
      is_success: false,
      user_id: null,
      email: process.env.EMAIL || null,
      roll_number: process.env.ROLL_NUMBER || null,
      odd_numbers: [],
      even_numbers: [],
      alphabets: [],
      special_characters: [],
      sum: "0",
      concat_string: "",
      error: "An unexpected error occurred"
    });
  }
});


app.get("/", (_req, res) => {
  res.status(200).send("VIT  API is running. POST /bfhl");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
