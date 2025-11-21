import { groups_list } from "@/lib";
import { DownloadIcon, Eye, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

function TeamList() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = groups_list.filter((team) => {
    const matchSearch =
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.instansi.toLowerCase().includes(searchQuery.toLowerCase());

    let matchStatus = true;
    if (statusFilter === "present") matchStatus = team.present === true;
    else if (statusFilter === "absent") matchStatus = team.present === false;

    let matchCategory = true;
    if (categoryFilter === "sumo") matchCategory = team.category === "sumo";
    else if (categoryFilter === "soccer") matchCategory = team.category === "soccer";

    let matchPayment = true;
    if (paymentFilter === "verified") matchPayment = team.status === "verified";
    else if (paymentFilter === "pending") matchPayment = team.status === "pending";
    else if (paymentFilter === "rejected") matchPayment = team.status === "rejected";

    return matchStatus && matchCategory && matchPayment && matchSearch;
  });

  return (
    <>
      <div className="">
        <h1 className="text-2xl lg:text-3xl font-bold">TEAM LIST</h1>
      </div>
      <div className="w-full  max-w-7xl lg:px-10 ">
        <div className="w-full  justify-between px-4 py-3 mb-3 rounded-md gap-4 flex-wrap lg:flex-nowrap flex items-center">
          <input
            type="text"
            className="py-2 outline-none border-b-3 border-[#FBFF00] lg:w-xs lg:text-base text-sm"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search teams..."
          />
          <button className="bg-[#FBFF00] flex justify-center items-center py-2 px-6 rounded gap-3 cursor-pointer hover:bg-yellow-300 transition-all lg:text-base text-sm">
            <p className="hidden lg:block">Download data</p> <DownloadIcon className="w-5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-5xl">
            <table className="min-w-full border-collapse">
              <thead className="px-4 py-4 font-semibold text-sm bg-[#FBFF00]">
                <tr>
                  <th className="pl-4 pr-2 py-5 text-left">No</th>
                  <th className="px-4 py-4 text-left">Team Name</th>
                  <th className="px-4 py-5 text-left">Instansi</th>
                  <th className="px-4 py-5 text-left">
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="px-4 outline-none"
                    >
                      <option value="all">Category</option>
                      <option value="sumo">SUMMO</option>
                      <option value="soccer">SOCCER</option>
                    </select>
                  </th>
                  <th className="px-4 py-5 text-center">
                    <select
                      value={paymentFilter}
                      onChange={(e) => setPaymentFilter(e.target.value)}
                      className="px-4 outline-none"
                    >
                      <option value="all">Payment</option>
                      <option value="verified">Verified</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </th>
                  <th className="px-4 py-5 text-center">
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 outline-none">
                      <option value="all">Status</option>
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                    </select>
                  </th>
                  <th className="px-4 py-5 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((item, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50 transition">
                    <td className="pl-4 pr-2 py-3">{i + 1}</td>

                    <td className="px-4 py-3 flex items-center gap-3">
                      <div className="w-12 h-12 bg-logo-team flex items-center justify-center ">
                        <Image src={item.logo} alt="logo" width={33} height={33} />
                      </div>
                      <span className="font-semibold">{item.name}</span>
                    </td>

                    <td className="px-4 py-3">{item.instansi}</td>
                    <td className="px-4 py-3 text-center uppercase">{item.category}</td>

                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-3 py-1 text-xs rounded-full capitalize ${
                          item.status === "verified"
                            ? "bg-green-100  text-green-700"
                            : item.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      {item.present ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">Present</span>
                      ) : (
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs">Absent</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center flex gap-4 justify-center">
                      <Eye className="text-green-600 hover:text-green-800 w-5 " />
                      <Pencil className="text-blue-600 hover:text-blue-800 w-5" />
                      <Trash2 className="text-red-600 hover:text-red-800 w-5" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default TeamList;
