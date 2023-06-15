const ReadingListItem = () => {
  return (
    <div className="group my-4 grid grid-cols-12 gap-x-2">
      <div className="col-span-4">
        <div className="h-full w-full rounded-lg bg-gray-300" />
      </div>
      <div className="col-span-8 flex flex-col gap-y-2">
        <p className="text-lg font-semibold decoration-indigo-800 transition group-hover:underline ">
          Lorem ipsum dolor sit amet consectetur.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus ea
          saepe atque.
        </p>
        <div className="flex items-center gap-x-3">
          <div className="h-5 w-5 flex-none rounded-full bg-gray-300" />
          <p>Moutaz Ali</p>
          <time>Dec. 22, 2022</time>
        </div>
      </div>
    </div>
  );
};

export default ReadingListItem;
