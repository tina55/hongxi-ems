import { useRef, useState, useEffect } from 'react';
import { Minimize2 } from 'lucide-react';

export default function Cockpit() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className={`${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-black'
          : 'bg-gray-50'
      }`}
      style={isFullscreen ? {} : { height: 'calc(100vh - 64px)' }}
    >
      {isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 z-10 flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors backdrop-blur"
        >
          <Minimize2 size={16} />
          <span>退出全屏</span>
        </button>
      )}

      <iframe
        ref={iframeRef}
        src="/cockpit/主页.html"
        title="能源驾驶舱"
        className="w-full border-0"
        style={{
          height: isFullscreen ? '100vh' : '100%',
        }}
        allow="fullscreen"
      />
    </div>
  );
}
