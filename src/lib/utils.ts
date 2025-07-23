import { GetWorkoutsQueryResult } from "./sanity/sanity.types";

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "beginner":
      return "bg-green-500";
    case "intermediate":
      return "bg-yellow-500";
    case "advanced":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export const getDifficultyText = (difficulty: string) => {
  switch (difficulty) {
    case "beginner":
      return "Beginner";
    case "intermediate":
      return "Intermediate";
    case "advanced":
      return "Advanced";
    default:
      return "Unknown";
  }
};

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

export const getTotalSets = (workout: GetWorkoutsQueryResult[number]) => {
  return (
    workout.exercises?.reduce((total, exercise) => {
      return total + (exercise.sets?.length || 0);
    }, 0) || 0
  );
};
