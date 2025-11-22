import { member_list } from "@/lib";
import { useMounted } from "@/lib/useMounted";
import { DownloadIcon, Eye, Pencil, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { downloadExcelMember } from "./DownloadExcel";

function MemberList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const mounted = useMounted();
  if (!mounted) return null;

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  const handleRoleChange = (value: string) => {
    setRoleFilter(value);
    setCurrentPage(1);
  };

  const filteredData = member_list.filter((member) => {
    const matchSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());

    let matchCategory = true;
    if (categoryFilter === "sumo") matchCategory = member.category === "sumo";
    else if (categoryFilter === "soccer") matchCategory = member.category === "soccer";

    let matchStatus = true;
    if (roleFilter === "leader") matchStatus = member.role === "leader";
    else if (roleFilter === "member") matchStatus = member.role === "member";

    return matchStatus && matchCategory && matchSearch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <>
      <>
        <div className="">
          <h1 className="text-2xl lg:text-3xl font-bold">MEMBER LIST</h1>
        </div>
        <div className="w-full max-w-7xl lg:px-10">
          <div className="w-full justify-between px-4 py-3 mb-3 rounded-md gap-4 flex items-center">
            <input
              type="text"
              className="py-2 outline-none border-b-4 border-[#FBFF00] lg:w-xs lg:text-base text-sm"
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search Member..."
            />
            <button
              onClick={() => downloadExcelMember({ filteredData })}
              className="bg-[#FBFF00] flex justify-center items-center py-2 px-6 rounded gap-3 cursor-pointer hover:bg-yellow-300 transition-all lg:text-base text-sm"
            >
              <p className="hidden lg:block">Download data</p>
              <DownloadIcon className="w-5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-5xl">
              <table className="min-w-full border-collapse">
                <thead className="px-4 py-4 font-semibold text-sm bg-[#FBFF00]">
                  <tr>
                    <th className="pl-4 pr-2 py-5 text-left">No</th>
                    <th className="px-4 py-4 text-left">Member Name</th>
                    <th className="px-4 py-5 text-left">Team</th>
                    <th className="px-4 py-5 text-center">
                      <select
                        value={categoryFilter}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="px-4 outline-none"
                      >
                        <option value="all">Category</option>
                        <option value="sumo">SUMMO</option>
                        <option value="soccer">SOCCER</option>
                      </select>
                    </th>
                    <th className="px-4 py-5 text-center">
                      <select value={roleFilter} onChange={(e) => handleRoleChange(e.target.value)} className="px-4 outline-none">
                        <option value="all">Role</option>
                        <option value="leader">Leader</option>
                        <option value="member">Member</option>
                      </select>
                    </th>
                    <th className="px-4 py-5 text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentItems.map((item, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50 transition">
                      <td className="pl-4 pr-2 py-3">{i + 1}</td>

                      <td className="px-4 py-3 flex items-center gap-3">
                        <span className="font-semibold">{item.name}</span>
                      </td>

                      <td className="px-4 py-3">{item.team}</td>
                      <td className="px-4 py-3 text-center uppercase">{item.category}</td>

                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-3 py-1 text-xs rounded-full capitalize ${
                            item.role === "leader" ? "bg-blue-100  text-blue-700" : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {item.role}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center flex gap-4 justify-center">
                        <Eye className="text-green-600 hover:text-green-800 w-5" />
                        <Pencil className="text-blue-600 hover:text-blue-800 w-5" />
                        <Trash2 className="text-red-600 hover:text-red-800 w-5" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-center items-center gap-4 py-6">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-[#FBFF00] rounded disabled:opacity-50 text-sm lg:text-base"
            >
              Prev
            </button>

            <span className="font-semibold text-sm lg:text-base">{currentPage}</span>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-[#FBFF00] rounded disabled:opacity-50 text-sm lg:text-base"
            >
              Next
            </button>
          </div>
        </div>
      </>
    </>
  );
}

export default MemberList;
