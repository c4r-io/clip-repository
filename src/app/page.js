import InitPrompt from "@/components/InitPrompt";

export default function Home() {
  return (
    <main className="bg-[#171819] text-white w-[405px] h-[700px] overflow-auto">
      <div className="flex justify-center min-h-[700px]">
        <div className="absolute left-0  w-[405px]">
          <InitPrompt />
        </div>
      </div>
    </main>
  )
}
