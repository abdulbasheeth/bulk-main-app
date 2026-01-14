import React, { useState } from "react";
import axios from "axios";
import { MdEmail, MdHistory, MdLogout } from "react-icons/md";
import * as XLSX from "xlsx";

const Dashboard = () => {
    const [msg, setMsg] = useState("");
    const [emailList, setEmailList] = useState([]);
    const [previewMsg, setPreviewMsg] = useState("");
    const [alert, setAlert] = useState({ show: false, type: "", message: "" });

    function handleMsg(evt) {
        setMsg(evt.target.value);
    }

    function handleFile(event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            const totalEmails = jsonData.map((row) => row[0]).filter((email) => email);
            setEmailList(totalEmails);
        };

        reader.readAsBinaryString(file);
    }

    function send() {
        setPreviewMsg(msg);

        axios
            .post("http://localhost:5000/sendMail", { msg, emailList })
            .then((res) => {
                setAlert({ show: true, type: "success", message: res.data });

            })
            .catch((err) => {
                console.error(err);
                setAlert({ show: true, type: "error", message: "Email failed to send" });

            });
    }


    return (
        <div>
            <h1 className="bg-blue-300 text-white text-center font-bold p-4 text-2xl">Bulk Email Dashboard</h1>

            <div className="flex">
                <div className="p-5 text-white bg-blue-400 h-screen w-60">
                    <div className="flex mt-5 text-xl">
                        <MdEmail className="mt-1" />
                        <p className="pl-3">Send Emails</p>
                    </div>
                    <div className="flex mt-4 text-xl">
                        <MdHistory className="mt-1" />
                        <p className="pl-3">Email History</p>
                    </div>
                    <div className="flex mt-4 text-xl">
                        <MdLogout className="mt-1" />
                        <p className="pl-3">Logout</p>
                    </div>
                </div>

                <div className="h-screen w-screen bg-blue-200 flex justify-center items-start">
                    <div className="p-6 ml-15 w-full max-w-lg">
                        <h1 className="font-bold text-2xl">Send Bulk Emails</h1>

                        <div className="pt-5">
                            <label className="font-bold mt-3">Text</label>
                            <input
                                onChange={handleMsg}
                                value={msg}
                                className="mt-2 border w-full p-1 rounded"
                                placeholder="Enter email subject"
                            />
                        </div>

                        <div className="pt-5">
                            <input
                                onChange={handleFile}
                                className="border-4 border-dashed py-4 px-4 mt-5 mb-5 w-full rounded"
                                type="file"
                            />
                        </div>

                        <div className="mt-3">
                            <p>Total email in the file: {emailList.length}</p>
                        </div>

                        <div className="mt-3">
                            <label>Email Preview</label>
                            <input
                                value={previewMsg}
                                readOnly
                                placeholder="Your email content will appear here..."
                                className="border p-3 mt-3 w-full rounded"
                            />
                        </div>

                        <div className="mt-5">
                            <button
                                onClick={send}
                                className="border p-2 w-full bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Send Emails
                            </button>
                        </div>

                       {alert.show && (
  <div
    className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 p-3 rounded-lg shadow-lg flex items-center space-x-3 ${
      alert.type === "success" ? "bg-green-500" : "bg-red-500"
    }`}
  >
    {alert.type === "success" && (
      <svg
        className="w-8 h-8 text-yellow-300" 
        fill="none"
        stroke="currentColor"
        strokeWidth="3" // Makes the tick bolder
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    )}
    <span className="text-2xl font-extrabold text-white">{alert.message}</span> {/* bold message */}
  </div>
)}



                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
