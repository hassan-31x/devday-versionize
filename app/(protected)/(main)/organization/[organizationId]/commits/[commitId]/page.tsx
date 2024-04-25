"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import FileCommits from "../../_components/file-commits";

type Props = {
  params: {
    organizationId: string;
    commitId: string;
  };
};

const CommitIdPage: React.FC<Props> = ({ params: { organizationId, commitId } }: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [commitMessage, setCommitMessage] = useState("");

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
    setIsMounted(true);
  }, []);

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

          console.log(commitsCollectionRef, commitsQuery, commitsSnapshot);

          commitsSnapshot.forEach((commitDoc) => {
            if (commitDoc.id !== commitId) return;

            const { message, files } = commitDoc.data();
            setCommitMessage(message);

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
          setLoading(false);
        });
      } catch (error) {
        console.error("Error fetching commits:", error);
        setLoading(false);
      }
    };

    fetchCommits();
  }, [organizationId]);

  if (!isMounted) return null;

  return (
    <div className="w-full">
      {loading ? (
        <>
          <Skeleton className="h-12 mb-4 w-[30%]" />
          <div className="flex flex-col gap-1">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} className="h-8 w-full" />
            ))}
          </div>
          <div className="flex flex-col gap-1 mt-5">
            {Array.from({ length: 2 }).map((_, idx) => (
              <Skeleton key={idx} className="h-8 w-full" />
            ))}
          </div>
        </>
      ) : files.length > 0 ? (
        <>
          <h3 className="font-semibold text-3xl mb-6 mt-2">Commit Message: {commitMessage}</h3>
          {files.map((file) => (
            <FileCommits key={file.id} fileName={file.name} fileType={file.type} path={file.path} />
          ))}
        </>
      ) : (
        <h3 className="font-medium text-lg text-center">No files to show</h3>
      )}
    </div>
  );
};

export default CommitIdPage;
