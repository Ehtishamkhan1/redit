/* eslint-disable prettier/prettier */
/* eslint-disable import/prefer-default-export */
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

export const screenRatio = height / width;

export const getRespValue = (percentage: number) => {
  //   console.log(width, height);
  if (height > 800) return Math.round(height * (percentage / 1000));
  return Math.round((height + 60) * (percentage / 1000));
};

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

// Horizontally scale the font size
// Example: width, marginLeft, marginRight etc.
const hs = (size: number) => (width / guidelineBaseWidth) * size;
// Vertically scale the font size
// Example: height, marginTop, marginBottom etc.
const vs = (size: number) => (height / guidelineBaseHeight) * size;
// Moderately scale the font size
// Example: fontSize,borderRadius etc.
const ms = (size: number, factor: number = 0.5) =>
  size + (hs(size) - size) * factor;

export { hs, ms, vs };
