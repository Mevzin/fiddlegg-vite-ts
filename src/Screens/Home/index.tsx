import { useState } from "react";
import WrapperProfile from "../../Components/WrapperProfile/index";
import IMAGES from "../../assets/Images";
import { FaSearch } from "react-icons/fa";

export const Home = () => {
	const [searchInput, setSearchInput] = useState("");
	const [summonerName, SetSummonerName] = useState("");
	const [summonerTagline, SetSummonerTagLine] = useState("");
	const [shouldSearch, setShouldSearch] = useState(false);
	const [searchKey, setSearchKey] = useState(0);

	const handleSearch = () => {
		if (searchInput.trim()) {
	
			const parts = searchInput.trim().split('#');
			if (parts.length === 2) {
				const gameName = parts[0].trim();
				const tagLine = parts[1].trim();
				if (gameName && tagLine) {
					SetSummonerName(gameName);
					SetSummonerTagLine(tagLine);
					setShouldSearch(true);
					setSearchKey(prev => prev + 1);
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
		<div className="flex flex-col items-center justify-center w-screen h-screen bg-gray-800">
			<div className="flex flex-col items-center justify-center">
				<div className="flex h-20 mb-8">
					<img className="mr-3" src={IMAGES.image2} />
					<img src={IMAGES.image1} />
				</div>
				<div className="flex flex-col items-center justify-center">
					<div className="flex gap-2 mb-4">
						<input
							className="h-12 w-80 px-4 bg-gray-700 border-2 border-gray-600 rounded-l-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
							type="text"
							placeholder="GameName#TAG (ex: Player#BR1)"
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							onKeyPress={handleKeyPress}
						/>
						<button
							className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-r-md transition-colors h-12"
							onClick={handleSearch}
							title="Buscar jogador"
						>
							<FaSearch />
							Buscar
						</button>
					</div>
					<p className="text-gray-400 text-sm mb-4">Digite o nome do jogador seguido de # e a TAG (ex: Player#BR1)</p>
				</div>
				{shouldSearch && (
					<WrapperProfile
						key={searchKey}
						namegame={summonerName}
						tagline={summonerTagline}
						shouldSearch={shouldSearch}
					/>
				)}
			</div>
		</div>
	);
};
