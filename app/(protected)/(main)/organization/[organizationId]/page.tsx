"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseConfig";
import SingleFile from "./_components/file";
import { collection, getDocs, query, where } from "firebase/firestore";

type Props = {
  params: {
    organizationId: string;
  };
};

const OrganizationIdPage: React.FC<Props> = ({ params: { organizationId } }: Props) => {
  const [files, setFiles] = useState<any[]>([]);

  const getFileType = (fileName: string) => {
    const fileExtension = fileName.split(".").pop();
    const imageExtensions = ["jpg", "jpeg", "png", "gif"];
    return imageExtensions.includes(fileExtension!) ? "image" : "doc";
  };

  const getFileName = (fileName: string) => {
    const splitFileName = fileName.split("/");
    return splitFileName[splitFileName.length - 1];
  };

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        const projectCollection = collection(db, "projects");
        const q = query(projectCollection, where("projectId", "==", organizationId));
        const projectSnapshot = await getDocs(q);

        projectSnapshot.forEach(async (projectDoc) => {
          const commitsCollectionRef = collection(projectDoc.ref, "commits");
          const commitsQuery = query(commitsCollectionRef);
          const commitsSnapshot = await getDocs(commitsQuery);

          //@ts-ignore
          commitsSnapshot.forEach(async (commitDoc, idx) => {
            if (idx > 0) return;

            const { files } = commitDoc.data();

            setFiles([
              ...files.map((file: any, idx: number) => {
                return {
                  id: idx,
                  path: file,
                  name: getFileName(file),
                  type: getFileType(file),
                };
              }),
            ]);
          });
        });
      } catch (error) {
        console.error("Error fetching commits:", error);
      }
    };

    fetchCommits();
  }, [organizationId]);

  useEffect(() => {
    console.log(files);
  }, [files]);

  return (
    <div className="w-full">
      {files.length > 0 ? (
        files.map((file) => <SingleFile key={file.id} fileName={file.name} fileType={file.type} path={file.path} />)
      ) : (
        <div className="w-full hover:bg-slate-50 h-8 border px-2 border-gray-400 flex  justify-between items-center"></div>
      )}
    </div>
  );
};

export default OrganizationIdPage;
