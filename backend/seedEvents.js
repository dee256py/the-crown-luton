const db = require("./database");

const demoEvents = [
  {
    name: "Golden Hour Open Mic",
    category: "Open Mic",
    day: "Friday",
    time: "7:30 PM",
    capacity: 80,
    isFeatured: 1,
    isPublished: 1,
    description:
      "A warm, intimate night for singers, poets, rappers, comedians and first-time performers to own the room."
  },
  {
    name: "Midnight DJ Sessions",
    category: "DJ Night",
    day: "Saturday",
    time: "9:00 PM",
    capacity: 120,
    isFeatured: 0,
    isPublished: 1,
    description:
      "A late-night DJ experience with high-energy sets, low lighting and a crowd built for movement."
  },
  {
    name: "Soul & Jazz Lounge",
    category: "Live Music",
    day: "Thursday",
    time: "8:00 PM",
    capacity: 90,
    isFeatured: 0,
    isPublished: 1,
    description:
      "Smooth live vocals, soft jazz textures and a relaxed lounge atmosphere made for slow evenings."
  },
  {
    name: "Private Hire Showcase",
    category: "Private Hire",
    day: "Sunday",
    time: "5:00 PM",
    capacity: 100,
    isFeatured: 0,
    isPublished: 1,
    description:
      "Explore how The Castle can host birthdays, celebrations, community nights and private events."
  },
  {
    name: "New Voices Night",
    category: "Community Event",
    day: "Wednesday",
    time: "6:30 PM",
    capacity: 70,
    isFeatured: 0,
    isPublished: 1,
    description:
      "A community-led night for fresh talent, local stories, creative expression and new connections."
  }
];

function seedEvent(event) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT id FROM events WHERE name = ?",
      [event.name],
      (findErr, existingEvent) => {
        if (findErr) {
          reject(findErr);
          return;
        }

        if (existingEvent) {
          console.log(`Skipped existing event: ${event.name}`);
          resolve();
          return;
        }

        const sql = `
          INSERT INTO events
          (name, day, time, description, category, capacity, isFeatured, isPublished)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.run(
          sql,
          [
            event.name,
            event.day,
            event.time,
            event.description,
            event.category,
            event.capacity,
            event.isFeatured,
            event.isPublished
          ],
          function (insertErr) {
            if (insertErr) {
              reject(insertErr);
              return;
            }

            console.log(`Added event: ${event.name}`);
            resolve();
          }
        );
      }
    );
  });
}

async function seedEvents() {
  try {
    for (const event of demoEvents) {
      await seedEvent(event);
    }

    console.log("Demo events seed completed.");
    db.close();
  } catch (err) {
    console.error("Seed failed:", err.message);
    db.close();
  }
}

seedEvents();