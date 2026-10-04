import mongoose from "mongoose";
// Create the CalendarSettings schema: a single document holding the company's
// consultation availability, edited in /admin/calendar (see lib/booking/settings.js).
const WeeklyHoursSchema = new mongoose.Schema({
  day: { type: Number, min: 0, max: 6, required: true }, // 0 = Sunday … 6 = Saturday
  enabled: { type: Boolean, default: false },
  start: { type: String, default: "09:00" }, // "HH:MM" in `timezone`
  end: { type: String, default: "17:00" },
}, { _id: false });

const BlockedDateSchema = new mongoose.Schema({
  date: { type: String, required: true }, // "YYYY-MM-DD" in `timezone`
  reason: { type: String, trim: true, maxlength: 100 },
}, { _id: false });

const CalendarSettingsSchema = new mongoose.Schema({
  key: { type: String, default: "default", unique: true }, // singleton
  timezone: { type: String, default: "Africa/Nairobi" },
  slotMinutes: { type: Number, default: 30 },
  minNoticeHours: { type: Number, default: 12 }, // no bookings sooner than this
  horizonDays: { type: Number, default: 30 }, // how far ahead people can book
  hiddenSlotPercent: { type: Number, default: 30 }, // share of free slots shown as taken (stable per slot)
  weekly: { type: [WeeklyHoursSchema], default: [] },
  blockedDates: { type: [BlockedDateSchema], default: [] },
}, {
  timestamps: true
});

// Create the CalendarSettings model using the schema
const CalendarSettings = mongoose.models.CalendarSettings || mongoose.model('CalendarSettings', CalendarSettingsSchema);

export default CalendarSettings
