import { storage } from "@/lib/firebaseConfig";
import { getDownloadURL, ref } from "firebase/storage";
import { File, FileImage, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  fileName: string;
  fileType: "doc" | "image";
  path: string;
  handleDelete: (path: string, commitMessage: string) => void;
};

const SingleFile = ({ fileName, fileType, path, handleDelete }: Props) => {
  const icons = {
    doc: <File className="h-4 w-4" />,
    image: <FileImage className="h-4 w-4" />,
  };
  const [commitMessage, setCommitMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchDownloadUrl = async () => {
      const pathRef = ref(storage, path.slice(1));
      const downloadUrl = await getDownloadURL(pathRef);
      setDownloadUrl(downloadUrl);
    };

    fetchDownloadUrl();
  }, [fileName]);

  const delete2 = () => {
    handleDelete(path, commitMessage)
    setIsOpen(false)
  }

  return (
    <div className="w-full hover:bg-slate-50 h-8 border px-2 border-gray-400 flex justify-between items-center">
      <div className="flex items-center h-full gap-2">
        {icons[fileType]}
        {downloadUrl ? (
          <a href={downloadUrl} className="text-slate-800 hover:underline cursor-pointer text-sm" target="_blank">
            {fileName}
          </a>
        ) : (
          <span className="text-slate-800 cursor-pointer text-sm">{fileName}</span>
        )}
      </div>

      <Dialog open={isOpen}>
        <DialogTrigger>
          <Trash2 className="h-4 w-4 cursor-pointer text-red-600 hover:text-red-500" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="leading-6">Are you absolutely sure you want to delete '{fileName}'?</DialogTitle>
            <DialogDescription className="pt-1">This action cannot be undone. This will delete your file. However, you can recover it later from commit history.</DialogDescription>
          </DialogHeader>

          <div className="flex gap-3 items-center">
          <Input value={commitMessage} onChange={e => setCommitMessage(e.target.value)} placeholder="commit message" />
          <Button onClick={delete2} variant='destructive'>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SingleFile;
