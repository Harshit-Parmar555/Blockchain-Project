import React from "react";
import Navbar from "../custom/Navbar";

const tickets = [
  { id: 1, name: "Concert Ticket", price: "$50" },
  { id: 2, name: "Movie Ticket", price: "$15" },
  { id: 3, name: "Sport Event Ticket", price: "$30" },
];

const Home = () => {
  return (
    <div className="w-full h-screen overflow-hidden bg-zinc-950 flex flex-col items-center justify-center">
      <Navbar />
      <div className="flex flex-col items-center justify-center mt-20">
        <h1 className="text-3xl text-white mb-5">Available Tickets</h1>
        <div className="flex flex-col gap-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-zinc-800 p-4 rounded justify-between w-auto flex items-center gap-4"
            >
              <span className="text-white">{ticket.name}</span>
              <span className="text-white">{ticket.price}</span>
              <button className="bg-blue-500 text-white p-2 rounded">
                Buy
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
