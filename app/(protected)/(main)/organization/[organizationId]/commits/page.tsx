"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  params: {
    organizationId: string;
  };
};

const CommitsPage: React.FC<Props> = ({ params: { organizationId } }: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const [commits, setCommits] = useState<{ id: string; message: string }[]>([]);
  const [loading, setLoading] = useState(true);

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
          const temp: any = [];

          commitsSnapshot.forEach(async (commitDoc) => {
            const commitData = commitDoc.data();
            temp.push({
              id: commitDoc.id,
              message: commitData.message,
            });
          });
          setCommits(temp);
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
              <Skeleton key={idx} className="h-10 w-full" />
            ))}
          </div>
          <div className="flex flex-col gap-1 mt-5">
            {Array.from({ length: 2 }).map((_, idx) => (
              <Skeleton key={idx} className="h-10 w-full" />
            ))}
          </div>
        </>
      ) : commits.length > 0 ? (
        <>
        <h3 className="font-bold text-4xl mb-6 mt-2">Previous Commits</h3>
        {commits.map((commit) => (
          <div className="w-full hover:bg-slate-50 h-8 border py-2 px-3 border-gray-400 flex justify-between items-center">
            <span className="font-medium">{commit.message}</span>
            <Link href={`/organization/${organizationId}/commits/${commit.id}`} className="text-slate-800 hover:underline cursor-pointer text-sm">
              {commit.id}
            </Link>
          </div>
        ))}
        </>
      ) : (
        <h3 className="font-medium text-lg text-center">No files to show</h3>
      )}
    </div>
  );
};

export default CommitsPage;
