import Image from "next/image"

const Logo = () => {
  return (
    <div className="flex gap-2">
        <Image src="/logo.svg" alt="logo" width={40} height={40} />
        <h1 className="font-bold text-2xl">Versionize</h1>
    </div>
  )
}

export default Logo