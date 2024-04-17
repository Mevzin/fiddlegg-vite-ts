import { useParams } from "react-router-dom";
import { NavBar } from "../../Components/NavBar";

export const League = () => {
	const { gameName, tagLine } = useParams();
	return (
		<div className="flex flex-col w-screen h-screen">
			<NavBar />
			<h1>{gameName}</h1>
			<h1>{tagLine}</h1>
		</div>
	);
};
