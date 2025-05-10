import Image from "next/image";
import path from "path";
import type { ComponentPropsWithoutRef } from "react";
import sharp from "sharp";

interface ImgProps extends ComponentPropsWithoutRef<"img"> {
  src: string;
  className?: string;
}
export default async function BankLogo({
  className,
  width,
  height,
  alt,
  ...props
}: ImgProps) {
  const imagePath = path.join(process.cwd(), "public", props.src);
  const sharpImage = sharp(imagePath);

  const placeholder = await sharpImage.resize(10).toBuffer();
  const base64 = placeholder.toString("base64");
  const blurDataURL = `data:image/png;base64,${base64}`;

  return (
    <div className="bg-foreground flex size-10 items-center justify-center rounded-full">
      <Image
        alt="bank-logo"
        sizes="100%"
        quality={100}
        blurDataURL={blurDataURL}
        width={24}
        height={24}
        className={className}
        {...props}
      />
    </div>
  );
}
