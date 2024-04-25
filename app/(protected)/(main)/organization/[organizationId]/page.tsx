"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { db, storage } from "@/lib/firebaseConfig";
import SingleFile from "./_components/file";
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

const OrganizationIdPage: React.FC<Props> = ({ params: { organizationId } }: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState({ pathRef: "", url: "" } as any);
  const [commitMessage, setCommitMessage] = useState("");

  const router = useRouter();

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
            ...files.map((file: any, idx: number) => {
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

  const handleDelete = async (path: string, commitMessage: string) => {
    try {
      const newFiles = files.filter((file) => file.path !== path).map((file) => file.path);

      const projectCollection = collection(db, "projects");
      const q = query(projectCollection, where("projectId", "==", organizationId));
      const projectSnapshot = await getDocs(q);
      const projectDoc = projectSnapshot.docs[0];

      const commitsCollectionRef = collection(projectDoc.ref, "commits");
      addDoc(commitsCollectionRef, {
        message: commitMessage,
        createdAt: serverTimestamp(),
        files: newFiles,
      });

      toast.success("File deleted successfully");
      router.refresh();
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Error deleting file");
    }
  };

  const handleAdd = async (commitMessage: string) => {
    if (url.pathRef === "" || commitMessage === '') {
      toast.error("Please select a file and add a commit message");
      return;
    };
    const newFiles = [...files.map((file: any) => file.path), `/${url.pathRef.fullPath}`];
    try {

      const projectCollection = collection(db, "projects");
      const q = query(projectCollection, where("projectId", "==", organizationId));
      const projectSnapshot = await getDocs(q);
      const projectDoc = projectSnapshot.docs[0];


      const commitsCollectionRef = collection(projectDoc.ref, "commits");
      addDoc(commitsCollectionRef, {
        message: commitMessage,
        createdAt: serverTimestamp(),
        files: newFiles,
      });

      toast.success("File Added successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error adding file:", error);
      toast.error("Error adding file");
    } finally {
      setIsOpen(false);
      setCommitMessage("");
    }
  };

  const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const imageUpload = e.target.files[0];

      const uniqueName = `${organizationId}/${imageUpload.name}`;

      const imageRef = ref(storage, uniqueName);
      await uploadBytes(imageRef, imageUpload);

      const pathRef = ref(storage, uniqueName);
      const url = await getDownloadURL(pathRef);
      setUrl({ pathRef, url });
    }
  };

  return (
    <div className="w-full">
      <Dialog open={isOpen}>
        <DialogTrigger className="w-full">
          <div className="w-full mt-2 mb-10 flex justify-end">
            <Button variant="ghost" size="icon" className="rounded-full p-2" onClick={() => setIsOpen(true)}>
              <FilePlus2 className="h-6 w-6 text-blue-500 cursor-pointer hover:text-blue-600" />
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="leading-6">Select file</DialogTitle>
            <DialogDescription className="pt-1">Select any file to upload and add a commit message</DialogDescription>
          </DialogHeader>

          <div className="">
            {url?.url ? (
              <div className="h-48 w-full bg-slate-100 rounded-xl flex items-center justify-center">
                <FileCheck2 className="h-7 w-7 text-green-500" />
              </div>
            ) : (
              <label className="cursor-pointer">
                <input className="hidden" type="file" onChange={uploadImage} />
                <div className="h-48 w-full bg-slate-100 rounded-xl flex items-center justify-center">
                  <Upload className="h-7 w-7" />
                </div>
              </label>
            )}
            <div className="flex gap-3 items-center mt-5">
              <Input value={commitMessage} onChange={(e) => setCommitMessage(e.target.value)} placeholder="commit message" />
              <Button onClick={() => handleAdd(commitMessage)}>Add</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
      ) : files.length > 0 ? (
        files.map((file) => <SingleFile key={file.id} fileName={file.name} fileType={file.type} path={file.path} handleDelete={handleDelete} />)
      ) : (
        <h3 className="font-medium text-lg text-center">No files to show</h3>
      )}
    </div>
  );
};

export default OrganizationIdPage;
