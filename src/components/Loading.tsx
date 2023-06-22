import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Loading = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-y-6">
      <div className="text-3xl">Loading ...</div>

      <AiOutlineLoading3Quarters size={30} className="animate-spin" />
    </div>
  );
};

export default Loading;
