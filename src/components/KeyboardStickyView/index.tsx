/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import { hp } from "@/utils/design";
import { useMemo } from "react";
import { Platform } from "react-native";
import {
  KeyboardController,
  KeyboardStickyView as KeyboardStickyViewRN,
  useKeyboardHandler,
} from "react-native-keyboard-controller";
import { runOnJS } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardStickyViewProps } from "./type";

const KeyboardStickyView = (props: KeyboardStickyViewProps) => {
  const { bottom } = useSafeAreaInsets();
  const {
    children,
    style = {},
    withAppBar = false,
    disableBottomSafeArea = false,
    disableBottomWithAppBar = false,
  } = props;
  const openedOffset = useMemo(() => {
    if (disableBottomWithAppBar) {
      return Platform.OS === "ios" ? hp(8.2) : hp(7.2);
    }

    if (withAppBar) {
      return Platform.OS === "ios" ? bottom + hp(8.2) : bottom + hp(7.2);
    }
    if (disableBottomSafeArea) {
      return 0;
    }

    return bottom;
  }, [disableBottomWithAppBar, withAppBar, disableBottomSafeArea, bottom]);

  const offset = {
    closed: 0,
    opened: openedOffset,
  };

  useKeyboardHandler(
    {
      onEnd: (e) => {
        "worklet";

        if (e.height === 0) {
          runOnJS(() => {
            KeyboardController.setDefaultMode();
          });
        }
      },
    },
    []
  );

  return (
    <KeyboardStickyViewRN offset={offset} style={[{ width: "100%" }, style]}>
      {children}
    </KeyboardStickyViewRN>
  );
};

export default KeyboardStickyView;
