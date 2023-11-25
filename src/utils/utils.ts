import { EditorState, convertFromRaw } from "draft-js";
import { mapPatternToModifier } from "./constants";

export const startsWithPattern = (text: string): boolean => {
  return Object.keys(mapPatternToModifier).some((k) =>
    text.startsWith(k + " ")
  );
};
export const getInitialState = () => {
  const existingState = localStorage.getItem("sorcerer_state");
  return existingState
    ? EditorState.createWithContent(convertFromRaw(JSON.parse(existingState)))
    : EditorState.createEmpty();
};