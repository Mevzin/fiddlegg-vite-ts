import { useEffect } from 'react';
import RoutesFiddle from "./Routes";
import LoadingScreen from './Components/LoadingScreen';
import { LoadingProvider, useLoading } from './hooks/useLoading';
import { setLoadingContext } from './Service/api';

function AppContent() {
	const { isLoading, showLoading, hideLoading } = useLoading();

	useEffect(() => {
		setLoadingContext({ showLoading, hideLoading });
	}, [showLoading, hideLoading]);

	return (
		<>
			<LoadingScreen isLoading={isLoading} />
			<div className="flex items-center justify-center bg-gray-600">
				<RoutesFiddle />
			</div>
		</>
	);
}

function App() {
	return (
		<LoadingProvider>
			<AppContent />
		</LoadingProvider>
	);
}

export default App;
