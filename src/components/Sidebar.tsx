import FollowItem from "./FollowItem";
import ReadingListItem from "./ReadingListItem";

const Sidebar = () => {
  return (
    <aside className="col-span-4 flex h-full w-full flex-col gap-y-4 p-10">
      <div>
        <h3 className="mb-2 text-lg font-semibold">
          People You Might Be Interested In
        </h3>
        <FollowItem />
        <FollowItem />
        <FollowItem />
      </div>
      <div className="sticky top-5">
        <h3 className="mb-2 text-lg font-semibold">Your Reading List</h3>
        <ReadingListItem />
        <ReadingListItem />
        <ReadingListItem />
      </div>
    </aside>
  );
};

export default Sidebar;
