import { AuthState } from "~/src/redux/slices/authSlice";
import { HardwareState } from "~/src/redux/slices/hardwareSlice";
import { InteractionState } from "./interactionTypes";

// src/types/state.ts
export type RootState = {
    hardware: HardwareState;
    auth: AuthState;
    myRobot: InteractionState;
    gemini: InteractionState;
  };
  