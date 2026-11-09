// @ts-nocheck -- imported app code; strict typing not yet applied
import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, FolderGit2 } from 'lucide-react';
import JSZip from 'jszip';
import { FLUTTER_PROJECT_FILES } from '../../data/flutterSourceCode';

interface FlutterExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlutterExportModal: React.FC<FlutterExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(1); // main.dart
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  if (!isOpen) return null;

  const currentFile = FLUTTER_PROJECT_FILES[selectedFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Add all project files into zip with proper directory structure
      FLUTTER_PROJECT_FILES.forEach((file) => {
        zip.file(`munowatch_app/${file.path}`, file.content);
      });

      // Add a README.md
      zip.file(
        'munowatch_app/README.md',
        `# MunoWatch Movie Streaming App (Flutter UI)

A pixel-perfect Flutter UI implementation inspired by the MunoWatch mobile streaming platform.

## Architecture
- \`lib/theme/app_colors.dart\` - Centralized color system (#05051F, #00D522, etc.)
- \`lib/theme/app_theme.dart\` - Material 3 dark streaming theme
- \`lib/screens/main_shell.dart\` - 4-tab bottom navigation shell
- \`lib/screens/home_screen.dart\` - Featured banner, Latest releases, Continue watching
- \`lib/widgets/featured_movie_banner.dart\` - Cinematic hero banner with green circular play button
- \`lib/widgets/movie_poster_card.dart\` - Rounded poster card with lock badge

## Getting Started
\`\`\`bash
flutter pub get
flutter run
\`\`\`
`
      );

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'munowatch_flutter_project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="w-full max-w-4xl h-[85vh] bg-[#08082D] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="h-16 px-5 bg-[#05051F] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#00D522]/20 rounded-lg text-[#00D522]">
              <FolderGit2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-white text-base font-bold flex items-center space-x-2">
                <span>Flutter & Dart Source Code</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#00D522] text-[#05051F]">
                  Clean Architecture
                </span>
              </h2>
              <p className="text-[#9292A5] text-xs">
                Production-ready Flutter project matching all MunoWatch design specifications
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="px-3.5 py-1.5 rounded-lg bg-[#00D522] hover:bg-[#02ec27] text-[#05051F] font-bold text-xs flex items-center space-x-1.5 shadow transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{isZipping ? 'Bundling...' : 'Download .ZIP'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[#9292A5] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Two-column layout (File list & Code viewer) */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Tree Sidebar */}
          <div className="w-64 bg-[#05051F]/70 border-r border-white/10 overflow-y-auto p-2 space-y-1">
            <div className="px-3 py-1.5 text-[11px] font-bold text-[#9292A5] uppercase tracking-wider">
              Project Structure
            </div>
            {FLUTTER_PROJECT_FILES.map((file, idx) => (
              <button
                key={file.path}
                onClick={() => setSelectedFileIndex(idx)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono flex items-center space-x-2 transition-colors ${
                  selectedFileIndex === idx
                    ? 'bg-[#00D522]/15 text-[#00D522] font-semibold border border-[#00D522]/30'
                    : 'text-[#D0D0D8] hover:bg-white/5 hover:text-white'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{file.path}</span>
              </button>
            ))}
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col bg-[#030314] overflow-hidden">
            {/* File info bar */}
            <div className="h-10 px-4 bg-[#05051F] border-b border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-[#00D522] font-mono font-semibold">{currentFile.path}</span>
                <span className="text-white/20">|</span>
                <span className="text-[#9292A5] truncate">{currentFile.description}</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white text-xs transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#00D522]" />
                    <span className="text-[#00D522]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#9292A5]" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Content */}
            <div className="flex-1 overflow-auto p-4 text-xs font-mono text-neutral-300 leading-relaxed bg-[#030314]">
              <pre>
                <code>{currentFile.content}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
