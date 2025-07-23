import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStoreage from "@react-native-async-storage/async-storage";

export interface WorkoutSet {
  id: string;
  reps: string;
  weight: string;
  weightUnit: "kg" | "lbs";
  isCompleted: boolean;
}

export interface WorkoutExercise {
  id: string;
  sanityId: string;
  name: string;
  sets: WorkoutSet[];
}

interface WorkoutStore {
  workoutExercise: WorkoutExercise[];
  weightUnit: "kg" | "lbs";

  //   Actions
  addExerciseToWorkout: (exercise: { name: string; sanityId: string }) => void;
  setWorkoutExercise: (
    exercises:
      | WorkoutExercise[]
      | ((prev: WorkoutExercise[]) => WorkoutExercise[])
  ) => void;
  setWeightUnit: (unit: "kg" | "lbs") => void;
  resetWorkout: () => void;
}

export const useWorkokutStore = create<WorkoutStore>()(
  persist(
    (set) => ({
      workoutExercise: [],
      weightUnit: "lbs",

      addExerciseToWorkout: (exercise) =>
        set((state) => {
          const newExercise: WorkoutExercise = {
            id: Math.random().toString(),
            sanityId: exercise.sanityId,
            name: exercise.name,
            sets: [],
          };
          return {
            workoutExercise: [...state.workoutExercise, newExercise],
          };
        }),

      setWorkoutExercise: (exercise) =>
        set((state) => ({
          workoutExercise:
            typeof exercise === "function"
              ? exercise(state.workoutExercise)
              : exercise,
        })),

      setWeightUnit: (unit) =>
        set({
          weightUnit: unit,
        }),

      resetWorkout: () =>
        set({
          workoutExercise: [],
        }),
    }),
    {
      name: "workout-store",
      storage: createJSONStorage(() => AsyncStoreage),
      partialize: (state) => ({
        weightUnit: state.weightUnit,
      }),
    }
  )
);
