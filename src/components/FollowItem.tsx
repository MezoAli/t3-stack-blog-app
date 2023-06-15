import React from "react";

const FollowItem = () => {
  return (
    <div className="my-4 flex flex-col gap-y-2">
      <div className="flex items-center justify-between gap-x-1">
        <div className="mr-3 h-8 w-8 flex-none rounded-full bg-gray-500" />
        <div>
          <p className="font-semibold">Moutaz Ali</p>
          <p className="break-words text-sm text-gray-500">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            Perferendis, maxime?
          </p>
        </div>
        <button className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-gray-700 transition hover:border-gray-600">
          Follow
        </button>
      </div>
    </div>
  );
};

export default FollowItem;
