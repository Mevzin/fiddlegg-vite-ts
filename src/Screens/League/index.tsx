import { useEffect, useState } from "react";
import { NavBar } from "../../Components/NavBar";
import { apiBase } from "../../Service/api";
import { Bounce, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { ISummoner } from "../../Models/summoner";
import { RankCard } from "../../Components/RankCard";
import { MatchesCard } from "../../Components/MatchsCard";
import { getProfileIconUrl, getChampionIconUrl } from '../../Service/dataDragonService';
import { getChampionKeyById } from '../../Service/championMappingService';
import "./styles.css";

export const League = () => {
	const [summoner, setSummoner] = useState<ISummoner>();
	const { gameName, tagLine } = useParams();
	const [profileUrls, setProfileUrls] = useState<Record<string, string>>({});
	const [loadingProfile, setLoadingProfile] = useState<boolean>(false);
	const [dominantColor, setDominantColor] = useState<string>('#374151');
	const [championMastery, setChampionMastery] = useState<{
		championId: number;
		championLevel: number;
		championPoints: number;
	}[]>([]);
	const [mostPlayedLane, setMostPlayedLane] = useState<string>('');
	const [topChampion, setTopChampion] = useState<{
		championId: number;
		championLevel: number;
		championPoints: number;
	} | null>(null);
	const [championIconUrl, setChampionIconUrl] = useState<string>('');
	console.log(championMastery)

	useEffect(() => {
		searchSummoner(gameName, tagLine);
	}, [gameName, tagLine]);

	useEffect(() => {
		if (summoner?.puuid) {
			fetchChampionMastery(summoner.puuid);
			fetchMostPlayedLane(summoner.puuid);
		}
	}, [summoner]);

	// Função para extrair cor predominante da imagem
	const extractDominantColor = (imageUrl: string): Promise<string> => {
		return new Promise((resolve) => {
			const img = new Image();
			img.crossOrigin = 'anonymous';
			img.onload = () => {
				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d');
				canvas.width = img.width;
				canvas.height = img.height;

				if (ctx) {
					ctx.drawImage(img, 0, 0);
					const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
					const data = imageData.data;

					let r = 0, g = 0, b = 0;
					const pixelCount = data.length / 4;

					for (let i = 0; i < data.length; i += 4) {
						r += data[i];
						g += data[i + 1];
						b += data[i + 2];
					}

					r = Math.floor(r / pixelCount);
					g = Math.floor(g / pixelCount);
					b = Math.floor(b / pixelCount);

					const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
					resolve(hex);
				} else {
					resolve('#374151');
				}
			};
			img.onerror = () => resolve('#374151');
			img.src = imageUrl;
		});
	};

	const loadProfileUrl = async (profileIconId: number) => {
		if (!profileUrls[profileIconId] && !loadingProfile) {
			setLoadingProfile(true);
			try {
				const url = await getProfileIconUrl(profileIconId);
				setProfileUrls(prev => ({ ...prev, [profileIconId]: url }));

				// Extrair cor predominante
				const color = await extractDominantColor(url);
				setDominantColor(color);
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

	const fetchChampionMastery = async (puuid: string) => {
		try {
			const response = await apiBase.get(`/league/championMastery/${puuid}`);
			const masteryData = response.data.mastery;
			setChampionMastery(masteryData);

			if (masteryData && masteryData.length > 0) {
				const topChamp = masteryData[0];
				setTopChampion(topChamp);

				// Buscar ícone do campeão
				try {
					// Converter championId para championKey
					const championKey = await getChampionKeyById(topChamp.championId);
					const iconUrl = await getChampionIconUrl(championKey);
					setChampionIconUrl(iconUrl);
				} catch (error) {
					console.error('Erro ao buscar ícone do campeão:', error);
				}
			}
		} catch (error) {
			console.error('Erro ao buscar maestria de campeões:', error);
		}
	};

	const fetchMostPlayedLane = async (puuid: string) => {
		try {
			const response = await apiBase.get(`/league/searchMatchs/${puuid}`);
			const matches = response.data.matchlist;

			if (matches && matches.length > 0) {
				const laneCount: Record<string, number> = {};

				matches.forEach((match: { info: { participants: { puuid: string; teamPosition?: string; lane?: string }[] } }) => {
					const participant = match.info.participants.find(
						(p: { puuid: string }) => p.puuid === puuid
					);

					if (participant) {
						let lane = participant.teamPosition || participant.lane;

						switch (lane) {
							case 'TOP':
								lane = 'Top';
								break;
							case 'JUNGLE':
								lane = 'Jungle';
								break;
							case 'MIDDLE':
							case 'MID':
								lane = 'Mid';
								break;
							case 'BOTTOM':
							case 'BOT':
								lane = 'ADC';
								break;
							case 'UTILITY':
								lane = 'Support';
								break;
							default:
								lane = 'Unknown';
						}

						if (lane !== 'Unknown') {
							laneCount[lane] = (laneCount[lane] || 0) + 1;
						}
					}
				});

				// Encontrar a lane mais jogada
				const mostPlayed = Object.entries(laneCount).reduce((a, b) =>
					a[1] > b[1] ? a : b
				);

				if (mostPlayed) {
					setMostPlayedLane(mostPlayed[0]);
				}
			}
		} catch (error) {
			console.error('Erro ao calcular lane mais jogada:', error);
		}
	};

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
					<div
						className="flex flex-row items-center justify-center rounded-xl h-[18rem] p-8 relative overflow-hidden border-2 backdrop-blur-sm gap-8"
						style={{
							background: `linear-gradient(270deg, ${dominantColor}15 0%, ${dominantColor}30 25%, rgba(17, 24, 39, 0.8) 100%)`,
							borderColor: `${dominantColor}60`,
							boxShadow: `0 8px 32px ${dominantColor}20`
						}}
					>
						{/* Imagem do perfil */}
						<div className="flex flex-col items-center relative">
							{summoner?.profileIconId && profileUrls[summoner.profileIconId] ? (
								<img
									className="size-24 rounded-full border-4 shadow-lg object-cover"
									style={{
										borderColor: dominantColor,
										boxShadow: `0 0 20px ${dominantColor}40`,
										objectPosition: 'center'
									}}
									src={profileUrls[summoner.profileIconId]}
									alt={`Ícone do perfil de ${summoner.gameName}`}
								/>
							) : (
								<div
									className="size-24 rounded-full bg-gray-700 flex items-center justify-center border-4 shadow-lg"
									style={{
										borderColor: dominantColor,
										boxShadow: `0 0 20px ${dominantColor}40`
									}}
								>
									{loadingProfile ? (
										<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
									) : (
										<span className="text-white text-sm font-bold">{summoner?.gameName?.slice(0, 2).toUpperCase()}</span>
									)}
								</div>
							)}
							<span
								className="absolute text-center mt-[86px] rounded-xl text-white w-8 font-bold border-2"
								style={{
									background: `linear-gradient(135deg, ${dominantColor} 0%, ${dominantColor}80 100%)`,
									borderColor: dominantColor,
									boxShadow: `0 2px 8px ${dominantColor}40`
								}}
							>
								{summoner?.summonerLevel}
							</span>
						</div>

						{/* Nick */}
						<div className="text-4xl">
							<span className="text-gray-50">{summoner?.gameName}</span>
							<span className="text-gray-300"> #{summoner?.tagLine}</span>
						</div>

						{/* Lane mais jogada */}
						{mostPlayedLane && (
							<span
								className="px-5 py-3 rounded-full text-xl font-bold text-white"
								style={{
									background: `linear-gradient(135deg, ${dominantColor} 0%, ${dominantColor}80 100%)`,
									boxShadow: `0 4px 12px ${dominantColor}40`
								}}
							>
								{mostPlayedLane}
							</span>
						)}

						{/* Campeão com maior maestria */}
						{topChampion && (
							<div className="flex items-center">
								{championIconUrl && (
									<img
										className="w-16 h-16 rounded-full mr-4 border-3 object-cover"
										style={{
											borderColor: dominantColor,
											boxShadow: `0 0 12px ${dominantColor}50`,
											objectPosition: 'center'
										}}
										src={championIconUrl}
										alt="Champion"
									/>
								)}
								<div className="flex flex-col">
									<span className="text-white text-xl font-bold">
										Nível {topChampion.championLevel}
									</span>
									<span className="text-gray-300 text-base">
										{topChampion.championPoints?.toLocaleString()} pontos
									</span>
								</div>
							</div>
						)}
					</div>
					<MatchesCard puuid={summoner?.puuid} />
				</div>
			</div>
		</div>
	);
};
