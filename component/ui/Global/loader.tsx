'use client';

import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Loader({ show }: { show: boolean }) {
	const [dots, setDots] = useState('');

	useEffect(() => {
		if (!show) return;
		const interval = setInterval(() => {
			setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
		}, 500);
		return () => clearInterval(interval);
	}, [show]);

	// Jika show false, jangan render apapun (RETURN NULL)
	if (!show) return null;

	return (
		// Container Full Screen dengan Z-Index Tertinggi
		<div className="fixed inset-0 z-9999 h-screen w-screen bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center overflow-hidden cursor-wait transition-all duration-300">
			{/* Visual Spinner Wrapper */}
			<div className="relative flex items-center justify-center">
				{/* Outer Ring (Ping Effect) */}
				<div className="absolute inset-0 bg-yellow-200 rounded-full animate-ping opacity-75"></div>

				{/* Background Ring */}
				<div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-gray-100 rounded-full"></div>

				{/* Spinning Ring */}
				<div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 border-4 border-t-[#FBFF00] border-r-[#FBFF00] border-b-transparent border-l-transparent rounded-full animate-spin"></div>

				{/* Icon Tengah */}
				<Loader2 className="absolute w-6 h-6 sm:w-8 sm:h-8 text-yellow-600 animate-pulse" />
			</div>

			{/* Text Status */}
			<div className="mt-6 flex flex-col items-center gap-2">
				<h3 className="font-plus-jakarta-sans font-bold text-lg sm:text-xl text-gray-800 tracking-wider">
					PLEASE WAIT
				</h3>

				{/* Subtext Tech Style */}
				<div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full border border-gray-200">
					<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
					<p className="font-fira-code text-xs sm:text-sm text-gray-500 font-medium">
						PROCESSING_DATA{dots}
					</p>
				</div>
			</div>
		</div>
	);
}
