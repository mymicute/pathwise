export const lessons = [
  {
    id: 1,
    title: "Introduction to Fundamentals",
    description: "Build your foundation with core concepts and best practices.",
    estimatedTime: "45 min",
    steps: [
      {
        type: "text",
        title: "Welcome to Your Journey",
        content: "Mastering any career starts with understanding the fundamentals. In this lesson, you'll learn the core principles that professionals use daily. Take your time, and don't skip the exercises."
      },
      {
        type: "video",
        title: "Core Concepts Overview",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with your video
        duration: "12:30"
      },
      {
        type: "quiz",
        title: "Quick Knowledge Check",
        question: "What is the most important factor in long-term skill development?",
        options: ["Natural talent", "Consistent practice", "Expensive tools", "Luck"],
        correctIndex: 1,
        explanation: "Consistency beats intensity. Small, daily improvements compound over time."
      },
      {
        type: "exercise",
        title: "Your First Task",
        instruction: "Write down 3 goals you want to achieve in this career path.",
        placeholder: "1. \n2. \n3. ",
        validation: "min:10" // Minimum characters to pass
      }
    ]
  },
  {
    id: 2,
    title: "Core Concepts Deep Dive",
    description: "Explore advanced patterns and real-world applications.",
    estimatedTime: "60 min",
    steps: [
      {
        type: "text",
        title: "Beyond the Basics",
        content: "Now that you understand the fundamentals, let's look at how experts structure their work. We'll cover frameworks, mental models, and common pitfalls."
      },
      {
        type: "quiz",
        title: "Pattern Recognition",
        question: "Which approach yields the highest ROI for beginners?",
        options: ["Memorizing syntax", "Building small projects", "Watching tutorials only", "Reading documentation"],
        correctIndex: 1,
        explanation: "Projects force you to apply knowledge, debug, and learn contextually."
      },
      {
        type: "exercise",
        title: "Mini Project Setup",
        instruction: "Outline a simple project idea that uses 2 concepts from this lesson.",
        placeholder: "Project Name: \nConcepts Used: \nGoal: ",
        validation: "min:15"
      }
    ]
  },
  {
    id: 3,
    title: "Practical Applications",
    description: "Hands-on practice with real-world scenarios.",
    estimatedTime: "90 min",
    steps: [
      { type: "text", title: "Putting Theory to Work", content: "Theory without practice fades quickly. Let's walk through a real workflow step-by-step." },
      { type: "exercise", title: "Workflow Simulation", instruction: "Describe how you would approach a client brief using the framework we covered.", placeholder: "Step 1: \nStep 2: \nStep 3: ", validation: "min:20" }
    ]
  },
  {
    id: 4,
    title: "Real-World Projects",
    description: "Capstone challenge to prove your skills.",
    estimatedTime: "120 min",
    steps: [
      { type: "text", title: "The Final Challenge", content: "You've learned the tools. Now it's time to build something that matters." },
      { type: "exercise", title: "Capstone Project", instruction: "Plan your final project. Include scope, timeline, and success metrics.", placeholder: "Scope: \nTimeline: \nMetrics: ", validation: "min:25" }
    ]
  }
];