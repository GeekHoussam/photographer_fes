import path from "node:path";
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const photos = [
  "Weddings/Photographe_mariage_fes.jpg",
  "Weddings/0F2A6875.jpg",
  "Weddings/0F2A6874.jpg",
  "Events/DSC02355.JPG",
  "Events/DSC02377.JPG",
  "Events/DSC02378.JPG",
  "Events/IMG_0006.jpg",
  "Events/IMG_0028-Enhanced-NR.jpg",
  "Events/IMG_0124-Enhanced-NR.jpg",
  "Events/IMG_0255-Enhanced-NR.jpg",
  "Events/IMG_0314-Enhanced-NR.jpg",
  "REEL ESTATE/DSC02171.jpg",
  "REEL ESTATE/DSC01919.jpg",
  "REEL ESTATE/DSC01925.jpg",
  "REEL ESTATE/DSC01170.jpg",
  "REEL ESTATE/DSC01201.jpg",
  "REEL ESTATE/DSC01209.jpg",
  "REEL ESTATE/DSC_7906-2.jpg",
  "REEL ESTATE/DSC_7923.jpg",
  "Restaurants & Foods/DSC02457.jpg",
  "Restaurants & Foods/DSC02443.jpg",
  "Restaurants & Foods/DSC02445.jpg",
  "Restaurants & Foods/DSC02448.jpg",
  "Restaurants & Foods/DSC02452.jpg",
  "Restaurants & Foods/DSC02470.jpg",
  "Restaurants & Foods/DSC02478.jpg",
  "Restaurants & Foods/DSC02480.jpg",
  "Restaurants & Foods/DSC02486.jpg",
  "Restaurants & Foods/DSC02493.jpg",
  "Restaurants & Foods/DSC02504.jpg",
  "Restaurants & Foods/DSC02522.jpg",
  "Personnels/m2.png",
];

for (const photo of photos) {
  const source = path.join("_photo-masters", photo);
  const destination = path.join(
    "public",
    "images",
    "portfolio",
    photo.replace(/\.[^.]+$/, ".webp"),
  );

  await mkdir(path.dirname(destination), { recursive: true });
  await sharp(source)
    .rotate()
    .resize({
      width: 2400,
      height: 2400,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 82, effort: 5 })
    .toFile(destination);
  console.log(destination);
}
