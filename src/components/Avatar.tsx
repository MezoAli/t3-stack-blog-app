import Image from "next/image";

interface AvatarProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const Avatar = ({ src, alt, width, height }: AvatarProps) => {
  return (
    <Image
      className="rounded-full"
      src={src}
      alt={alt}
      width={width}
      height={height}
    />
  );
};

export default Avatar;
