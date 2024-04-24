import { storage } from "@/lib/firebaseConfig";
import { getDownloadURL, ref } from "firebase/storage";
import { File, FileImage, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  fileName: string;
  fileType: "doc" | "image";
  path: string;
  handleDelete: (path: string) => void;
};

const SingleFile = ({ fileName, fileType, path, handleDelete }: Props) => {
  const icons = {
    doc: <File className="h-4 w-4" />,
    image: <FileImage className="h-4 w-4" />,
  };
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchDownloadUrl = async () => {
      const pathRef = ref(storage, path.slice(1));
      const downloadUrl = await getDownloadURL(pathRef);
      setDownloadUrl(downloadUrl);
    };

    fetchDownloadUrl();
  }, [fileName]);

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


      <Trash2 className="h-4 w-4 cursor-pointer text-red-600 hover:text-red-500" onClick={() => handleDelete(path)} />
    </div>
  );
};

export default SingleFile;
