export type SpaceType = 'Quiet' | 'Group';

export type StudySpace = {
  id: string;
  name: string;
  building: string; // Used as section title in SectionList
  floor: string;
  type: SpaceType;
  seats: number;
  occupied: number; // 0 to seats; occupancy % = occupied / seats
  amenities: string[];
  description: string;
  slots: string[]; // e.g. ["9:00–10:00", "10:00–11:00"]
  bookedSlots: string[]; // Slots already booked
};

export type User = {
  fullName: string;
  section: string;
};

export type Booking = {
  id: string;
  spaceId: string;
  spaceName: string;
  building: string;
  date: string;
  slot: string;
  groupSize: number;
  purpose: string;
};