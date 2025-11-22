export default function UploadCard({ onUpload, fileName }) {
  return (
    <div className="bg-white border border-gray-200 p-6">
      <h2 className="text-base text-gray-900 mb-4">Upload Exam Timetable</h2>
      <input
        type="file"
        accept=".csv"
        onChange={onUpload}
        className="block w-full text-sm text-gray-600 border border-gray-300 px-3 py-2"
      />
      <p className="text-xs text-gray-500 mt-2">CSV or Excel only</p>
      {fileName && <p className="text-sm text-gray-700 mt-3">Uploaded: {fileName}</p>}
    </div>
  );
}
