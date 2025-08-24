import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
      <Image src="/404img.png" alt="404 Not Found" width={300} height={300} className="mb-8" />
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">THIS PAGE DOES NOT EXIST</h1>
      <p className="text-lg text-center text-gray-400 mb-8">And never has</p>
      <Link href="/" passHref>
        <Button className="px-8 py-3 text-lg font-semibold rounded-lg" style={{ backgroundColor: "#6C61FF" }}>
          Return to Home
        </Button>
      </Link>
    </div>
  )
}
