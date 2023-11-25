export const styleMap = {
  COLOR_RED: {
    color: "red",
  },
  CODE_BLOCK: {
    padding: "5px",
    backgroundColor: "black",
    color: "white",
    fontFamily: "Courier New",
    margin: "20px !important",
    fontSize: "10px",
    lineHeight: "40px",
    fontWeight: "600",
    letterSpacing: "3px",
  },
};
export enum ModifierType {
  BLOCK = "BLOCK",
  INLINE_STYLE = "INLINE_STYLE",
}
export interface ModifierInterface {
  type: ModifierType;
  style: string;
}
export const mapPatternToModifier: Record<string, ModifierInterface> = {
  "*": {
    type: ModifierType.INLINE_STYLE,
    style: "BOLD",
  },
  "**": {
    type: ModifierType.INLINE_STYLE,
    style: "COLOR_RED",
  },
  "***": {
    type: ModifierType.INLINE_STYLE,
    style: "UNDERLINE",
  },
  "```": {
    type: ModifierType.INLINE_STYLE,
    style: "CODE_BLOCK",
  },
  "#": {
    type: ModifierType.BLOCK,
    style: "header-one",
  },

};
