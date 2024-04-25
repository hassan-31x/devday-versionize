"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { db, storage } from "@/lib/firebaseConfig";
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { FileCheck2, FilePlus2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";

type Props = {
  params: {
    organizationId: string;
  };
};

const CommitsPage: React.FC<Props> = ({ params: { organizationId } }: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const [commits, setCommits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


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
          const commitsQuery = query(commitsCollectionRef, orderBy("createdAt", "desc"));
          const commitsSnapshot = await getDocs(commitsQuery);

          const { files } = commitsSnapshot.docs[0].data();

          setFiles([
            ...commits.map((file: any, idx: number) => {
              return {
                id: idx,
                path: file,
                name: getFileName(file),
                type: getFileType(file),
              };
            }),
          ]);
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
      ) : commits.length > 0 ? (
        commits.map((file) => <></>)
      ) : (
        <h3 className="font-medium text-lg text-center">No files to show</h3>
      )}
    </div>
  );
};

export default CommitsPage;
