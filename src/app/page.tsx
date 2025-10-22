"use client";
import Pitch from "@/components/Pitch";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Home() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <h1 className="text-2xl font-semibold mb-4">Team Selector</h1>
        <p className="text-gray-600">
          Please <span className="font-medium">sign in</span> or{" "}
          <span className="font-medium">create an account</span> to use the team
          selector.
        </p>
      </div>
    );
  }
  return (
    <>
      <div className="mb-2">
        <h1 className="font-semibold text-xl mb-2">
          Welcome to the Squad Selector{" "}
        </h1>
        <p>
          Choose your team from the drop down on the right, choose your base
          formation and get creative. Drag positions around to create new
          formations and drag and drop the players into position to create your
          preferred XI. Save your XI for future use and don't forget to
          screenshot your favourite lineups to send your mates.{" "}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 p-6">
        {/* Left side (Pitch) */}
        <div className="flex flex-col items-center md:col-span-2">
          <Pitch />
          <div className="gap-4 grid grid-cols-3">
          <button className="mt-6 bg-yellow-500 px-4 py-2 rounded-md font-semibold hover:bg-yellow-600">
            Take Screenshot
          </button>
          <button className="mt-6 bg-yellow-500 px-4 py-2 rounded-md font-semibold hover:bg-yellow-600">
            Save Lineup
          </button>
          <button className="mt-6 bg-yellow-500 px-4 py-2 rounded-md font-semibold hover:bg-yellow-600">
            Load Lineup
          </button>
          </div>
          
        </div>

        <div className="flex flex-col gap-4">
        <div className="border rounded-md p-4 flex-1">Starting Formation</div>
        </div>

        {/* Right side (team dropdown + players) */}
        <div className="flex flex-col gap-4">
          <select className="border rounded-md p-2">
            <option>Select team</option>
          </select>
          <div className="border rounded-md p-4 flex-1">Player list here</div>
        </div>
      </div>
    </>
  );
}
