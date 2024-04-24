"use client";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import TaskCard from "./TaskCard";

function ColumnContainer({ column, createTask, tasks, updateTask }: any) {
  const [editMode, setEditMode] = useState(false);

  const tasksIds = useMemo(() => {
    return tasks.map((task: any) => task.id);
  }, [tasks]);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
    borderRadius: "4px",
    backgroundColor: "white",
    padding: "12px",
    marginBottom: "8px",
    width: "300px",
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
        
      bg-columnBackgroundColor
      opacity-40
      border-2
      border-grey-100
      w-[350px]
      h-full
      max-h-[300px]
      rounded-md
      flex
      flex-col
      "
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="
  bg-columnBackgroundColor
  border-2
  p-4 
  
  shadow-md
  w-[500px]
  h-[500px]
  rounded-md
  flex
  flex-col
  "
    >
      {/* Column title  */}
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        className="
      bg-mainBackgroundColor
      text-md
      h-[60px]
      cursor-grab
      rounded-md
      rounded-b-none
      p-4
      font-bold
      border-columnBackgroundColor
      border-4
      flex
      items-center
      justify-between">
        <div className="flex gap-2">
          <div
            className="flex
        justify-center
        items-center
        bg-columnBackgroundColor
        px-2
        py-1
        text-sm
        rounded-full"></div>
          {!editMode && column.title}
          {editMode && (
            <input
              className="border rounded outline-none px-2"
              value={column.title}
              // onChange={(e) => updateColumn(column.id, e.target.value)}
              onChange={(e) => console.log(e)}
              autoFocus
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
      </div>

      {/* Column task container */}
      <div className=" flex flex-grow flex-col gap-2 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIds}>
          {tasks.map((task: any) => (
            <TaskCard key={task.id} task={task} updateTask={updateTask} />
          ))}
        </SortableContext>
      </div>
      {/* Column footer */}
      <button
        className="flex gap-2 items-center  text-sm  border-gray-100
  r border-2 rounded-md  border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-grey-500 active:bg-black "
        style={{ width: "120px", height: "40px", borderRadius: "1rem" }}
        onClick={(e) => {
          e.stopPropagation();
          createTask(column.id);
        }}
      >
        <div className="ms-2"></div>
        Create Issue
      </button>
    </div>
  );
}

export default ColumnContainer;
