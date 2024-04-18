import { useEffect, useState } from "react";
import { NavBar } from "../../Components/NavBar";
import { apiBase } from "../../Service/api";
import { Bounce, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { ISummoner } from "../../Models/summoner";
import { RankCard } from "../../Components/RankCard";

export const League = () => {
	const [summoner, setSummoner] = useState<ISummoner>();
	const { gameName, tagLine } = useParams();
	const dataLink: string =
		"https://ddragon.leagueoflegends.com/cdn/14.7.1/img/profileicon";

	useEffect(() => {
		searchSummoner(gameName, tagLine);
	}, [gameName, tagLine]);

	async function searchSummoner(
		name: string | undefined,
		tag: string | undefined,
	) {
		if (!name || !tag) return;

		await apiBase
			.get(`/league/searchUser/${name}/${tag}`)
			.then((res) => {
				setSummoner(res.data);
			})
			.catch((e) => {
				console.error(e);
				setSummoner(undefined);
				toast.error("Jogador não encontrado", {
					position: "top-right",
					icon: false,
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
					transition: Bounce,
				});
			});

		return;
	}

	return (
		<div className="flex flex-col items-center justify-center w-screen h-screen">
			<NavBar />
			<div className="container flex h-screen bg-gray-700">
				{/* Side bar left */}
				<div className="flex w-1/4">
					<RankCard id={summoner?.id} />
				</div>
				{/* Side bar right */}
				<div className="flex flex-col border-solid border-2 rounded-xl bg-gray-500 w-3/4 h-36 mt-4 mr-4">
					{/* Profile */}
					<div className="flex flex-row items-center  h-36">
						<img
							className="size-32 rounded-full ml-2"
							src={`${dataLink}/${summoner?.profileIconId}.png`}
						/>
						<div className="flex flex-col items-center ml-3">
							<div className="text-3xl ">
								<span className="text-gray-50">{summoner?.gameName}</span>
								<span className="text-gray-300"> #{summoner?.tagLine}</span>
							</div>
							<div className="text-3xl text-gray-50">
								Level {summoner?.summonerLevel}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
