export const currentUser = {
  id: "you",
  name: "You",
  role: "This device",
  presence: "Ready to share",
  accent: "from-sky-500 to-cyan-400",
};

export const onlineUsers = [
  {
    id: "ali",
    name: "Ali",
    role: "Product",
    presence: "MacBook Pro",
    accent: "from-amber-400 to-orange-500",
  },
  {
    id: "sara",
    name: "Sara",
    role: "Operations",
    presence: "Windows workstation",
    accent: "from-rose-400 to-pink-500",
  },
  {
    id: "maya",
    name: "Maya",
    role: "Design",
    presence: "iPad Air",
    accent: "from-violet-400 to-fuchsia-500",
  },
  {
    id: "ahmed",
    name: "Ahmed",
    role: "Finance",
    presence: "Android phone",
    accent: "from-emerald-400 to-teal-500",
  },
  {
    id: "noah",
    name: "Noah",
    role: "Operations",
    presence: "Chrome on Linux",
    accent: "from-indigo-400 to-blue-500",
  },
];

export const people = [currentUser, ...onlineUsers];

export const peopleById = people.reduce((accumulator, person) => {
  accumulator[person.id] = person;
  return accumulator;
}, {});

export const initialShares = [
  {
    id: "share-1",
    senderId: "ali",
    createdAt: "2026-04-16T09:14:00+05:00",
    audienceIds: [],
    text: "Morning update: drop any files or notes for today's Wi-Fi handoff here so the whole room can stay aligned.",
    files: [],
  },
  {
    id: "share-2",
    senderId: "sara",
    createdAt: "2026-04-16T09:42:00+05:00",
    audienceIds: ["you", "maya"],
    text: "Latest floor plan attached for Maya and this device.",
    files: [
      {
        name: "floor-plan-v3.pdf",
        size: 2489000,
        mimeType: "application/pdf",
      },
    ],
  },
  {
    id: "share-3",
    senderId: "maya",
    createdAt: "2026-04-16T10:03:00+05:00",
    audienceIds: [],
    text: "Fresh signage ideas are ready. If anyone prints samples locally, place the exports here instead of sending them around one by one.",
    files: [],
  },
  {
    id: "share-4",
    senderId: "noah",
    createdAt: "2026-04-16T10:37:00+05:00",
    audienceIds: ["you"],
    text: "",
    files: [
      {
        name: "handoff-checklist.xlsx",
        size: 896000,
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    ],
  },
  {
    id: "share-5",
    senderId: "ahmed",
    createdAt: "2026-04-16T11:08:00+05:00",
    audienceIds: [],
    text: "",
    files: [
      {
        name: "printer-drivers.zip",
        size: 12640000,
        mimeType: "application/zip",
      },
    ],
  },
  {
    id: "share-6",
    senderId: "sara",
    createdAt: "2026-04-16T11:26:00+05:00",
    audienceIds: ["ali", "ahmed"],
    text: "Quiet note for Ali and Ahmed: booth invoice copy is on the board for your review before noon.",
    files: [],
  },
];
