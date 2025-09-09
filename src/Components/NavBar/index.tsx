import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import IMAGES from "../../assets/Images";

export const NavBar = () => {
	const [searchInput, setSearchInput] = useState("");
	const navigate = useNavigate();

	const handleSearch = () => {
		if (searchInput.trim()) {
	
			const parts = searchInput.trim().split('#');
			if (parts.length === 2) {
				const gameName = parts[0].trim();
				const tagLine = parts[1].trim();
				if (gameName && tagLine) {
					navigate(`/league/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
					setSearchInput("");
				}
			}
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSearch();
		}
	};

	return (
		<div className=" flex h-16 w-screen items-center justify-center bg-gray-700 border-b-2">
			<div className="container flex justify-between">
				<div className="flex ml-12">
					<Link to={'/'}>
						<div className="flex h-7 mr-8">
							<img className="mr-3" src={IMAGES.image2} />
							<img src={IMAGES.image1} />
						</div>
					</Link>
					<div className="flex h-7 border-solid border-2 shadow-xl rounded-md border-zinc-400">
						<input
							className="w-80 px-3 text-center bg-transparent text-slate-200 rounded-l-md focus:outline-none"
							type="text"
							placeholder="GameName#TAG"
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							onKeyPress={handleKeyPress}
						/>
						<button
							className="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-r-md transition-colors flex items-center justify-center"
							onClick={handleSearch}
							title="Buscar jogador"
						>
							<FaSearch size={14} />
						</button>
					</div>
				</div>
				<div className="flex mr-12">DropDowm</div>
			</div>
		</div>
	);
};
