import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CardContent } from "@/components/ui/CardContend";
import { UploadCloud, FileSearch, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">


      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-6">
        <h2 className="text-4xl md:text-5xl font-bold max-w-3xl">
          Analyze Your Resume with AI and Get an Instant ATS Score
        </h2>
        <p className="mt-6 text-gray-600 max-w-xl">
          Upload your resume and get detailed insights, skill analysis, and
          suggestions to improve your chances of getting hired.
        </p>
        <Button className="mt-8 px-8 py-6 text-lg">
          Upload Resume
        </Button>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-6 px-8 pb-20 max-w-6xl mx-auto">
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6 text-center">
            <UploadCloud className="mx-auto mb-4" size={40} />
            <h3 className="text-lg font-semibold">Easy Resume Upload</h3>
            <p className="text-gray-600 mt-2">
              Upload your resume in seconds with our simple drag & drop
              interface.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6 text-center">
            <FileSearch className="mx-auto mb-4" size={40} />
            <h3 className="text-lg font-semibold">AI Resume Analysis</h3>
            <p className="text-gray-600 mt-2">
              Our AI scans your resume and extracts important information.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6 text-center">
            <BarChart3 className="mx-auto mb-4" size={40} />
            <h3 className="text-lg font-semibold">ATS Score & Suggestions</h3>
            <p className="text-gray-600 mt-2">
              Get an ATS compatibility score and suggestions to improve your
              resume.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20 px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div>
              <h3 className="font-semibold text-lg">1. Upload Resume</h3>
              <p className="text-gray-600 mt-2">
                Upload your resume securely to our platform.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">2. AI Analysis</h3>
              <p className="text-gray-600 mt-2">
                Our AI reads your resume and analyzes skills and experience.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">3. Get Insights</h3>
              <p className="text-gray-600 mt-2">
                Receive an ATS score and personalized suggestions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-gray-900 text-white text-center py-6">
        <p>© {new Date().getFullYear()} AI Resume Analyzer. All rights reserved.</p>
      </footer>
    </div>
  );
}
