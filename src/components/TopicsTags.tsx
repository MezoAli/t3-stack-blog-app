import Link from "next/link";
import React from "react";

interface TopicsProps {
  justify: string;
  topics: boolean;
  tags?: {
    id: string;
    name: string;
  }[];
}

const TopicsTags: React.FC<TopicsProps> = ({ justify, topics, tags }) => {
  return (
    <div className={`flex w-full items-center ${justify}`}>
      {topics ? <div>My Topics : </div> : ""}
      <div className="flex gap-x-2">
        {tags &&
          tags.map((tag) => {
            return (
              <Link
                href={`/tag/${tag.name}`}
                className="rounded-full bg-gray-200 px-4 py-2"
                key={tag.id}
              >
                {tag.name}
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default TopicsTags;
