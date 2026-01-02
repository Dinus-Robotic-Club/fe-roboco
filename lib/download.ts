import { ExcelRow, IDownloadExcelProps } from './types'
import * as XLSX from 'xlsx'

export const exportToExcel = <T>({ data, fileName, sheetName = 'Sheet1', mapper }: IDownloadExcelProps<T>) => {
  if (!data || data.length === 0) {
    alert('Tidak ada data untuk diunduh.')
    return
  }

  const formattedData = mapper ? data.map(mapper) : (data as unknown as ExcelRow[])

  const worksheet = XLSX.utils.json_to_sheet(formattedData)

  if (formattedData.length > 0) {
    const firstRow = formattedData[0]
    const columnWidths = Object.keys(firstRow).map((key) => {
      const maxContentLength = formattedData.reduce((max, row) => {
        const cellValue = row[key]
        const cellLength = cellValue ? String(cellValue).length : 0
        return Math.max(max, cellLength)
      }, key.length)

      return { wch: maxContentLength + 2 }
    })
    worksheet['!cols'] = columnWidths
  }

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  const date = new Date().toISOString().split('T')[0]
  const fullFileName = `${fileName}_${date}.xlsx`

  XLSX.writeFile(workbook, fullFileName)
}
