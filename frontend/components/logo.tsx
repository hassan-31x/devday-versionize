import Image from "next/image"

const Logo = () => {
  return (
    <div className="flex gap-2 items-center">
        <Image src="/logo.svg" alt="logo" width={30} height={30} />
        <h1 className="font-bold text-xl">Versionize</h1>
    </div>
  )
}

export default Logo