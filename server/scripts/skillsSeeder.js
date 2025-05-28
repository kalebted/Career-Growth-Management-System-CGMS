import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import Skills from "../models/skills.js";

dotenv.config({ path: path.resolve("../.env") }); // Ensure correct .env path
console.log("🔍 MONGO_URI:", process.env.MONGO_URI);

const seedSkills = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  try {
    // Clear the Skills collection first
    await Skills.deleteMany({});
    console.log("🧹 Cleared existing Skills collection");

    // Define the software engineering skill list
    const skillNames = [
      "JavaScript", "TypeScript", "Python", "Java", "C#", "C++", "Ruby", "Go", "PHP", "Swift",
      "Kotlin", "HTML", "CSS", "SASS", "TailwindCSS", "React", "React Native", "Next.js", "Node.js", "Express.js",
      "Django", "Flask", "Spring Boot", "MongoDB", "PostgreSQL", "MySQL", "Redis", "GraphQL", "REST APIs",
      "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Git", "CI/CD", "Jest", "Mocha", "Cypress",
      "Testing Library", "Figma", "Agile Methodologies", "Scrum", "Microservices", "System Design", "Data Structures",
      "Algorithms", "Problem Solving", "Linux", "Shell Scripting", "Web Security", "OAuth", "JWT", "SEO Basics",
      "WebSockets", "Three.js", "Unity (C#)", "Blockchain Basics", "AI/ML Basics"
    ];

    const skillsToInsert = skillNames.map((name) => ({ skill_name: name }));

    await Skills.insertMany(skillsToInsert);
    console.log(`🎯 Seeded ${skillsToInsert.length} skills successfully!`);
  } catch (error) {
    console.error("❌ Error seeding skills:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

seedSkills();
