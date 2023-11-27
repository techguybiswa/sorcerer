import {
  EditorState,
  RichUtils,
  SelectionState,
  Modifier,
  Editor,
} from "draft-js";
import "../App.css";
import { useEffect, useRef, useState } from "react";
import {
  ModifierType,
  mapPatternToModifier,
  styleMap,
} from "../utils/constants";
import {
  getCurrentText,
  getInitialState,
  save,
  startsWithPattern,
} from "../utils/utils";

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

  const getStylesByType = (type: ModifierType) =>
    Object.values(mapPatternToModifier)
      .filter((v) => v.type === type)
      .map((v) => v.style);

  const getEditorStateWithoutPattern = (editorState: EditorState) => {
    const currentContent = editorState.getCurrentContent();
    const textInCurrentBlock = getCurrentText(editorState);
    const pattern = textInCurrentBlock.split(" ")[0];
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
      "forward",
    );

    const editorStateWithoutPattern = EditorState.push(
      editorState,
      contentStateWithoutPattern,
      "remove-range",
    );

    return EditorState.moveFocusToEnd(editorStateWithoutPattern);
  };
  const applyInlineStyleToCurrentBlock = (editorState: EditorState) => {
    const textInCurrentBlock = getCurrentText(editorState);
    const pattern = textInCurrentBlock.split(" ")[0];
    const currentModifier = mapPatternToModifier[pattern];

    const editorStateWithoutPattern = getEditorStateWithoutPattern(editorState);
    if (currentModifier.type === ModifierType.INLINE_STYLE) {
      setEditorState(
        RichUtils.toggleInlineStyle(
          editorStateWithoutPattern,
          currentModifier.style,
        ),
      );
    } else if (currentModifier.type === ModifierType.BLOCK)
      setEditorState(
        RichUtils.toggleBlockType(
          editorStateWithoutPattern,
          currentModifier.style,
        ),
      );
  };

  const removeInlineStyleFromCurrentBlock = (editorState: EditorState) => {
    const currentBlockType = RichUtils.getCurrentBlockType(editorState);

    const inlineStylesToToggle = getStylesByType(ModifierType.INLINE_STYLE);
    const blocksToToggle = getStylesByType(ModifierType.BLOCK);

    for (const inlineStyle of inlineStylesToToggle) {
      if (editorState.getCurrentInlineStyle().has(inlineStyle)) {
        setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
        return "handled";
      }
    }
    for (const block of blocksToToggle) {
      if (currentBlockType === block) {
        setEditorState(
          RichUtils.toggleBlockType(editorState, currentBlockType),
        );
        return "handled";
      }
    }

    setEditorState(editorState);
    return "handled";
  };

  const onChange = (editorState: EditorState) => {
    const textInCurrentBlock = getCurrentText(editorState);

    if (startsWithPattern(textInCurrentBlock)) {
      applyInlineStyleToCurrentBlock(editorState);
      return "handled";
    } else if (textInCurrentBlock === "") {
      // on new line remove all styles
      removeInlineStyleFromCurrentBlock(editorState);
      return "handled";
    }

    setEditorState(editorState);
    return "handled";
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
        <button className="button-save" onClick={() => save(editorState)}>
          Save
        </button>
      </div>
    </>
  );
}

export default Sorcerer;
