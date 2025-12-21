require('dotenv').config();
const Replicate = require('replicate');

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function testGeneration() {
  console.log("Token present:", !!process.env.REPLICATE_API_TOKEN);
  console.log("Token length:", process.env.REPLICATE_API_TOKEN ? process.env.REPLICATE_API_TOKEN.length : 0);

  try {
    console.log("Testing Replicate generation...");
    // Using a known reliable model for testing first, or the requested one
    const model = "google/imagen-3"; // Fallback to 3 if 4 is issues, or try the user's requested model
    // The user used "google/imagen-4" in their request example. Let's try that first as per their request.
    
    console.log("Running google/imagen-3 fast check...");
    const output = await replicate.run("google/imagen-3", {
      input: {
        prompt: "A simple red cube",
        aspect_ratio: "1:1"
      }
    });
    
    console.log("Success! Output:", output);
  } catch (error) {
    console.error("Error:", error);
  }
}

testGeneration();
