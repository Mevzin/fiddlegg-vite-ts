import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "../Screens/Home";
import { League } from "../Screens/League";

export default function RoutesFiddle() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/league/:gameName/:tagLine" element={<League />} />
			</Routes>
		</BrowserRouter>
	);
}
