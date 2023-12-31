import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { HiCheck } from "react-icons/hi";
import { HiChevronUpDown } from "react-icons/hi2";
import { trpc } from "../utils/trpc";
import { Tag } from "./ModalForm";

interface ComboBoxProps {
  selectedTags: Tag[];
  setSelctedTags: Dispatch<SetStateAction<Tag[]>>;
}

export default function ComboBox({
  setSelctedTags,
  selectedTags,
}: ComboBoxProps) {
  const tags = trpc.tag.getAllTags.useQuery();

  const [selected, setSelected] = useState(tags?.data && tags?.data[0]);
  const [query, setQuery] = useState("");

  const filteredTags =
    query === ""
      ? tags.data
      : tags?.data &&
        tags?.data?.filter((tag) =>
          tag.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <Combobox
      value={selected}
      onChange={(value) => {
        setSelected(value);
        setSelctedTags((prev) => [...prev, value]);
      }}
    >
      <div className="relative mt-1">
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
          <Combobox.Input
            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 outline-none focus:ring-0"
            displayValue={(tag: { name: string }) => tag.name}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <HiChevronUpDown
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredTags && filteredTags.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredTags &&
              filteredTags.map((tag) => (
                <Combobox.Option
                  key={tag.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-gray-600 text-white" : "text-gray-900"
                    }`
                  }
                  value={tag}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {tag.name}
                      </span>
                      {selectedTags.includes(tag) ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? "text-white" : "text-teal-600"
                          }`}
                        >
                          <HiCheck className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}
