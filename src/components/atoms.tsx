import { atom } from "jotai";
import { Group } from "./types";

export const SelectedgroupAtom = atom<Group | null>(null);
