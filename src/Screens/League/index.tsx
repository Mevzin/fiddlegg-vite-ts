import { useEffect, useState } from "react";
import { NavBar } from "../../Components/NavBar";
import { apiBase } from "../../Service/api";
import { Bounce, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { ISummoner } from "../../Models/summoner";
import { RankCard } from "../../Components/RankCard";
import { MatchesCard } from "../../Components/MatchsCard";
import { getProfileIconUrl } from "../../Service/dataDragonService";
import "./styles.css";

export const League = () => {
	const [summoner, setSummoner] = useState<ISummoner>();
	const { gameName, tagLine } = useParams();
	const [profileUrls, setProfileUrls] = useState<Record<string, string>>({});
	const [loadingProfile, setLoadingProfile] = useState<boolean>(false);

	useEffect(() => {
		searchSummoner(gameName, tagLine);
	}, [gameName, tagLine]);

	const loadProfileUrl = async (profileIconId: number) => {
		if (!profileUrls[profileIconId] && !loadingProfile) {
			setLoadingProfile(true);
			try {
				const url = await getProfileIconUrl(profileIconId);
				setProfileUrls(prev => ({ ...prev, [profileIconId]: url }));
			} catch (error) {
				console.error(`Erro ao carregar ícone de perfil ${profileIconId}:`, error);
			} finally {
				setLoadingProfile(false);
			}
		}
	};

	useEffect(() => {
		if (summoner?.profileIconId) {
			loadProfileUrl(summoner.profileIconId);
		}
	}, [summoner]);

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
		<div className="flex flex-col items-center justify-center w-screen h-screen overflow-x-hidden">
			<NavBar />
			<div className="container flex h-screen">
				<div className="flex w-1/4">
					<RankCard id={summoner?.id} />
				</div>
				<div className="flex flex-col w-3/4 h-36 mt-4 mr-4">
					<div className="flex flex-row items-center rounded-xl h-[15rem]">
						<div className="flex flex-col items-center ml-2">
							{summoner?.profileIconId && profileUrls[summoner.profileIconId] ? (
								<img
									className="size-24 rounded-full"
									src={profileUrls[summoner.profileIconId]}
									alt={`Ícone do perfil de ${summoner.gameName}`}
								/>
							) : (
								<div className="size-24 rounded-full bg-gray-700 flex items-center justify-center">
									{loadingProfile ? (
										<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
									) : (
										<span className="text-white text-sm font-bold">{summoner?.gameName?.slice(0, 2).toUpperCase()}</span>
									)}
								</div>
							)}
							<span className="absolute text-center mt-[86px] rounded-xl bg-black text-white w-8">{summoner?.summonerLevel}</span>
						</div>
						<div className="flex flex-col items-center ml-3">
							<div className="text-3xl ">
								<span className="text-gray-50">{summoner?.gameName}</span>
								<span className="text-gray-300"> #{summoner?.tagLine}</span>
							</div>
						</div>
					</div>
					<MatchesCard puuid={summoner?.puuid} />
				</div>
			</div>
		</div>
	);
};
