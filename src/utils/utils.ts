import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import { mapPatternToModifier } from "./constants";

export const startsWithPattern = (text: string): boolean => {
  return Object.keys(mapPatternToModifier).some((k) =>
    text.startsWith(k + " "),
  );
};
export const getInitialState = () => {
  const existingState = localStorage.getItem("sorcerer_state");
  return existingState
    ? EditorState.createWithContent(convertFromRaw(JSON.parse(existingState)))
    : EditorState.createEmpty();
};

export const save = (editorState: EditorState) => {
  localStorage.setItem(
    "sorcerer_state",
<<<<<<< Updated upstream
    JSON.stringify(convertToRaw(editorState.getCurrentContent())),
=======
    JSON.stringify(convertToRaw(editorState.getCurrentContent()))
>>>>>>> Stashed changes
  );
  alert("Saved");
};

const getCurrentBlock = (editorState: EditorState) => {
  const currentSelection = editorState.getSelection();
  const blockKey = currentSelection.getStartKey();
  return editorState.getCurrentContent().getBlockForKey(blockKey);
};
export const getCurrentText = (editorState: EditorState) => {
  const currentBlock = getCurrentBlock(editorState);
  const blockText = currentBlock.getText();
  return blockText;
<<<<<<< Updated upstream
};
=======
};
>>>>>>> Stashed changes
