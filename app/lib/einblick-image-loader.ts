import { createEinblickImageLoader } from "@einblick/sdk";

// Appends the width, quality and format next/image asks for to Einblick asset
// URLs and leaves every other src untouched.
export default createEinblickImageLoader();
