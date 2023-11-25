import {
  EditorState,
  RichUtils,
  SelectionState,
  Modifier,
  Editor,
  convertToRaw,
} from "draft-js";
import "../App.css";
import { useEffect, useRef, useState } from "react";
import {
  ModifierType,
  mapPatternToModifier,
  styleMap,
} from "../utils/constants";
import { getInitialState, startsWithPattern } from "../utils/utils";

function Sorcerer() {
  const [editorState, setEditorState] = useState(() => getInitialState());
  const editorRef = useRef<Editor | null>(null);
  useEffect(() => {
    focusOnEditor();
  });
  const focusOnEditor = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };
  const save = () => {
    localStorage.setItem(
      "sorcerer_state",
      JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    );
    alert("Saved");
  };
  const onChange = (editorState: EditorState) => {
    const selection = editorState.getSelection();
    const currentContent = editorState.getCurrentContent();
    const currentBlock = currentContent.getBlockForKey(selection.getStartKey());
    const textInCurrentBlock = currentBlock.getText();
    const currentBlockType = currentBlock.getType();

    if (startsWithPattern(textInCurrentBlock)) {
      const pattern = textInCurrentBlock.split(" ")[0];
      const currentModifier = mapPatternToModifier[pattern];
      const currentBlockKey = editorState.getSelection().getFocusKey();
      const rangeToRemove = new SelectionState({
        anchorKey: currentBlockKey,
        anchorOffset: 0,
        focusKey: currentBlockKey,
        focusOffset: pattern.length,
      });
      const contentStateWithoutPattern = Modifier.removeRange(
        currentContent,
        rangeToRemove,
        "forward"
      );
      const newStateWithoutPattern = EditorState.push(
        editorState,
        contentStateWithoutPattern,
        "remove-range"
      );
      const editorStateFocussed = EditorState.moveFocusToEnd(
        newStateWithoutPattern
      );
      if (currentModifier.type === ModifierType.INLINE_STYLE) {
        setEditorState(
          RichUtils.toggleInlineStyle(
            editorStateFocussed,
            currentModifier.style
          )
        );
      } else if (currentModifier.type === ModifierType.BLOCK)
        setEditorState(
          RichUtils.toggleBlockType(editorStateFocussed, currentModifier.style)
        );
      return "handled";
    } else if (textInCurrentBlock === "") {
      // on new line remove all styles
      const getStylesByType = (type: ModifierType) =>
        Object.values(mapPatternToModifier)
          .filter((v) => v.type === type)
          .map((v) => v.style);

      const inlineStylesToToggle = getStylesByType(ModifierType.INLINE_STYLE);
      const blocksToToggle = getStylesByType(ModifierType.BLOCK);

      for (const inlineStyle of inlineStylesToToggle) {
        if (editorState.getCurrentInlineStyle().has(inlineStyle)) {
          setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
          return;
        }
      }
      for (const block of blocksToToggle) {
        if (currentBlockType === block) {
          setEditorState(
            RichUtils.toggleBlockType(editorState, currentBlockType)
          );
          return;
        }
      }
    }

    setEditorState(editorState);
    return "not-handled";
  };

  return (
    <>
      <div className="container" onClick={focusOnEditor}>
        <p className="header">Demo editor By Bisso</p>
        <div className="editor-container" onClick={focusOnEditor}>
          <Editor
            editorKey={"editor"}
            customStyleMap={styleMap}
            editorState={editorState}
            onChange={(editorState) => onChange(editorState)}
            placeholder="Type here..."
            ref={editorRef}
          />
        </div>
        <br />
        <button className="button-save" onClick={save}>
          Save
        </button>
      </div>
    </>
  );
}

export default Sorcerer;
