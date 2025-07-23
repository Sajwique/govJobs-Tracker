import { AdmitCard, Result } from "gov-sanity/sanity.types";
import { client } from "./sanity/client";
import { defineQuery } from "groq";

export function formatDuration(seconds: number) {
  if (seconds < 60) {
    return `${seconds} s`;
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remaingSeconds = seconds % 60;

  if (hours > 0) {
    if (remaingSeconds > 0) {
      return `${hours}h ${minutes}m ${remaingSeconds}s`;
    } else if (minutes > 0) {
      return `${hours}h  ${minutes}m`;
    } else {
      return `${hours}h`;
    }
  } else {
    if (remaingSeconds > 0) {
      return `${minutes}m ${remaingSeconds}s`;
    } else {
      return `${minutes}m`;
    }
  }
}

export const formatDate = (dateString?: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("es-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }
};

export const formatTime = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const adimtCardQuery =
  defineQuery(`*[_type == "admitCard"] | order(releaseDate desc) {
    _id,
    title,
    releaseDate,
    buttons
  }`);

export const resultQuery =
  defineQuery(`*[_type == "result"] | order(resultDate desc) {
    _id,
    title,
    resultDate,
    buttons
  }`);

export const jobQuery = defineQuery(`*[_type == "job"]`);

export const supportData = {
  main_title: "Support Our Journey",
  title: "Beta Version Access",
  description:
    "You're using our early-access app! Help us improve by sharing your feedback or feature requests.",
  help: "We need 10,000 downloads to become sustainable. As students ourselves, we understand budget constraints - even small contributions make a huge difference in keeping this app free.",
  payment_list: {
    upi_scanner: "https://example.com/qr-code.png", // Replace with actual QR URL
    upi_id: "yourupi@ybl",
  },
};
