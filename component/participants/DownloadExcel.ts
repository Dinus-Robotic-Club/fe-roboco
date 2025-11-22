import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { DownloadExcelMemberProps, DownloadExcelTeamProps } from "@/lib/types/type";

export const downloadExcelTeams = ({ filteredData }: DownloadExcelTeamProps) => {
  const dataToExport = filteredData.map((team, index) => ({
    No: index + 1,
    Name: team.name,
    Instansi: team.instansi,
    Category: team.category,
    Payment: team.status,
    Status: team.present,
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Teams");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(file, "team_list.xlsx");
};

export const downloadExcelMember = ({ filteredData }: DownloadExcelMemberProps) => {
  const dataToExport = filteredData.map((team, index) => ({
    No: index + 1,
    Name: team.name,
    team: team.team,
    Category: team.category,
    role: team.role,
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Teams");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(file, "member_list.xlsx");
};
