"use client"

import {  uploadFile } from "@/lib/uploadFile";
import { useState } from "react";

export default function ResumeUpload() {

  const [file,setFile] = useState<File | null>(null);
  const [analysis,setAnalysis] = useState<any>(null);
  const [loading,setLoading] = useState(false);

  const handleUpload = async () => {

    if(!file) return;

    try {

      setLoading(true);

      // 1️⃣ Upload Resume
      const resume = await uploadFile(file);

      // const resumeId = resume._id;

      // 2️⃣ Extract Text
      // await extractText(resumeId);

      // 3️⃣ AI Analysisy
      // const aiRes = await analyzeResume(resumeId);

      // setAnalysis(aiRes.analysis);
      setLoading(false);

    } catch (error) {
      console.log(error);
      setLoading(false);
    }

  };

  return (

    <div>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e)=>setFile(e.target.files?.[0] || null)}
      />

      <button onClick={handleUpload}>
        Upload Resume
      </button>

      {loading && <p>Processing Resume...</p>}

      {analysis && (
        <div>

          <h2>Score: {analysis.score}</h2>

          <h3>Skills</h3>
          <ul>
            {analysis.skills.map((skill:string,i:number)=>(
              <li key={i}>{skill}</li>
            ))}
          </ul>

          <h3>Missing Skills</h3>
          <ul>
            {analysis.missingSkills.map((skill:string,i:number)=>(
              <li key={i}>{skill}</li>
            ))}
          </ul>

        </div>
      )}

    </div>

  );
}