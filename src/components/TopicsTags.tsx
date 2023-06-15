import React from "react";

interface TopicsProps {
  justify: string;
  topics: boolean;
}

const TopicsTags: React.FC<TopicsProps> = ({ justify, topics }) => {
  return (
    <div className={`flex w-full items-center ${justify}`}>
      {topics ? <div>My Topics : </div> : ""}
      <div className="flex gap-x-2">
        {Array.from({ length: 4 }).map((_, i) => {
          return (
            <div className="rounded-full bg-gray-200 px-4 py-2" key={i}>
              tag{i}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopicsTags;
