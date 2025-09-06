'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Monitor, Camera, Mic, ShieldCheck } from 'lucide-react';

export default function PermissionsPage() {
  const router = useRouter();

  const [fullscreenEnabled, setFullscreenEnabled] = useState(false);
  const [cameraAllowed, setCameraAllowed] = useState(false);
  const [micAllowed, setMicAllowed] = useState(false);

  // 🔹 Fullscreen Handler
  const enableFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
      setFullscreenEnabled(true);
    }
  };

  // 🔹 Camera Permission
  const requestCamera = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraAllowed(true);
    } catch (err) {
      setCameraAllowed(false);
    }
  };

  // 🔹 Mic Permission
  const requestMic = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicAllowed(true);
    } catch (err) {
      setMicAllowed(false);
    }
  };

  // 🔹 If already in fullscreen
  useEffect(() => {
    const checkFs = () => setFullscreenEnabled(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", checkFs);
    return () => document.removeEventListener("fullscreenchange", checkFs);
  }, []);

  const allPermissionsGranted = fullscreenEnabled && cameraAllowed && micAllowed;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl max-w-3xl w-full p-10 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-10">
          <ShieldCheck className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Permissions Required</h1>
          <p className="text-gray-600 mt-2 text-base">
            To ensure a fair test environment, please allow the following permissions.
          </p>
        </div>

        {/* Permissions List */}
        <div className="space-y-5 mb-8">
          {/* Fullscreen */}
          <div className="flex items-center justify-between p-4 rounded-xl border bg-gray-50">
            <div className="flex items-center gap-3">
              <Monitor className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-800">Fullscreen Mode</p>
                <p className="text-sm text-gray-600">Test must be taken in fullscreen mode.</p>
              </div>
            </div>
            <button
              onClick={enableFullscreen}
              disabled={fullscreenEnabled}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                fullscreenEnabled
                  ? "bg-green-100 text-green-700 cursor-default"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {fullscreenEnabled ? "Enabled ✓" : "Enable"}
            </button>
          </div>

          {/* Camera */}
          <div className="flex items-center justify-between p-4 rounded-xl border bg-gray-50">
            <div className="flex items-center gap-3">
              <Camera className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-800">Camera Access</p>
                <p className="text-sm text-gray-600">Required for proctoring & monitoring.</p>
              </div>
            </div>
            <button
              onClick={requestCamera}
              disabled={cameraAllowed}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                cameraAllowed
                  ? "bg-green-100 text-green-700 cursor-default"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {cameraAllowed ? "Allowed ✓" : "Allow"}
            </button>
          </div>

          {/* Mic */}
          <div className="flex items-center justify-between p-4 rounded-xl border bg-gray-50">
            <div className="flex items-center gap-3">
              <Mic className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-800">Microphone Access</p>
                <p className="text-sm text-gray-600">Required for voice monitoring during the test.</p>
              </div>
            </div>
            <button
              onClick={requestMic}
              disabled={micAllowed}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                micAllowed
                  ? "bg-green-100 text-green-700 cursor-default"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {micAllowed ? "Allowed ✓" : "Allow"}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            Back
          </button>
          <button
            onClick={() => router.push('./start')}
            disabled={!allPermissionsGranted}
            className={`px-6 py-2.5 rounded-lg font-semibold transition ${
              allPermissionsGranted
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Start Test
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-8">
          Having trouble? Contact{" "}
          <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
            support@example.com
          </a>
        </p>
      </div>
    </div>
  );
}
