import Image from "next/image";

interface AvatarProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const Avatar = ({ src, alt, width, height }: AvatarProps) => {
  return (
    <div className="relative h-7 w-7 rounded-full bg-gray-500">
      <Image
        className="rounded-full"
        src={src}
        alt={alt}
        fill
        width={width}
        height={height}
      />
    </div>
  );
};

export default Avatar;
